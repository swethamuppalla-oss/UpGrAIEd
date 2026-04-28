import Anthropic from '@anthropic-ai/sdk'
import { generateBloomPrompt } from './bloomPrompt.js'
import { validateBloomJSON } from './bloomValidator.js'

export const getFallbackPlan = () => ({
  days: [
    { day: 1, bloomLevel: 'remember', title: 'Fallback Lesson 1', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'This is a fallback lesson because AI generation failed.' }] },
    { day: 2, bloomLevel: 'understand', title: 'Fallback Lesson 2', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'Please try regenerating later.' }] },
    { day: 3, bloomLevel: 'understand', title: 'Fallback Lesson 3', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'Fallback content.' }] },
    { day: 4, bloomLevel: 'apply', title: 'Fallback Lesson 4', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'Fallback content.' }] },
    { day: 5, bloomLevel: 'apply', title: 'Fallback Lesson 5', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'Fallback content.' }] },
    { day: 6, bloomLevel: 'analyze', title: 'Fallback Lesson 6', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'Fallback content.' }] },
    { day: 7, bloomLevel: 'create', title: 'Fallback Lesson 7', estimatedTime: 5, xpReward: 50, sections: [{ type: 'explanation', text: 'Fallback content.' }] }
  ]
})

export const callBloomAI = async (chapterText, isRetry = false) => {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock') {
    // Return mock successful response for testing
    return {
      days: [
        { day: 1, bloomLevel: 'remember', title: 'Intro', estimatedTime: 5, xpReward: 50, sections: [
          { type: 'explanation', text: 'Welcome to this topic!' },
          { type: 'quiz', text: 'Test memory', question: 'What did we learn?', options: ['A', 'B', 'C', 'D'], answer: 'A' }
        ]},
        { day: 2, bloomLevel: 'understand', title: 'Understanding', estimatedTime: 10, xpReward: 70, sections: [{ type: 'explanation', text: 'Mock understand.' }]},
        { day: 3, bloomLevel: 'understand', title: 'More Understanding', estimatedTime: 10, xpReward: 70, sections: [{ type: 'explanation', text: 'Mock understand 2.' }]},
        { day: 4, bloomLevel: 'apply', title: 'Application', estimatedTime: 10, xpReward: 100, sections: [{ type: 'activity', text: 'Do this activity.' }]},
        { day: 5, bloomLevel: 'apply', title: 'More Application', estimatedTime: 10, xpReward: 100, sections: [{ type: 'activity', text: 'Do this activity 2.' }]},
        { day: 6, bloomLevel: 'analyze', title: 'Analysis', estimatedTime: 15, xpReward: 150, sections: [{ type: 'explanation', text: 'Analyze this.' }]},
        { day: 7, bloomLevel: 'create', title: 'Creation', estimatedTime: 20, xpReward: 200, sections: [{ type: 'activity', text: 'Create something.' }]}
      ]
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const prompt = generateBloomPrompt(chapterText)

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }]
    })

    let text = response.content[0].text
    // Sanitization
    text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim()

    const parsed = JSON.parse(text)
    validateBloomJSON(parsed)
    return parsed

  } catch (err) {
    console.warn('Bloom AI Call Failed:', err.message)
    if (!isRetry) {
      console.log('Retrying Bloom AI Call...')
      return callBloomAI(chapterText, true)
    }
    // Return fallback if retry fails
    return getFallbackPlan()
  }
}
