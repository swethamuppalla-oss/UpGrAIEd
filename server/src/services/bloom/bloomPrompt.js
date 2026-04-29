export const generateBloomPrompt = (chapterText) => `
You are an expert curriculum designer building a child-centric, adaptive learning journey based on Bloom's Taxonomy.
The content must be structured precisely into a 7-day progression.

RULES:
1. MAX 10 minutes of learning per day.
2. Use simple, engaging, age-appropriate language.
3. Bloom Level progression MUST strictly be:
   - Day 1: remember
   - Day 2: understand
   - Day 3: understand
   - Day 4: apply
   - Day 5: apply
   - Day 6: analyze
   - Day 7: create
16. Each day must contain 'sections' array. The sections array MUST include all 4 of these types: "explanation", "guided_thinking", "application", and "reflection". (You may also include a "quiz" section if appropriate).
17. Quiz sections MUST contain 'question', 'options' (array of strings), and 'answer' (exact string matching one option).
18. Guided Thinking and Reflection sections MUST contain a 'prompt' string instead of 'text'. Application sections MUST contain a 'task' string. Explanation sections MUST contain 'content' string instead of 'text'.
19. Provide reasonable estimates for 'estimatedTime' (minutes) and 'xpReward' (e.g. 50-150).

RETURN ONLY STRICT VALID JSON in this exact schema. Do not include markdown code blocks (\`\`\`json) or any conversational text.

SCHEMA:
{
  "days": [
    {
      "day": 1,
      "bloomLevel": "remember",
      "title": "Short Day Title",
      "estimatedTime": 5,
      "xpReward": 50,
      "sections": [
        {
          "type": "explanation",
          "content": "Simple explanation..."
        },
        {
          "type": "guided_thinking",
          "prompt": "How would you solve...?"
        },
        {
          "type": "application",
          "task": "Try to calculate..."
        },
        {
          "type": "reflection",
          "prompt": "What did you learn today?"
        },
        {
          "type": "quiz",
          "text": "Let's check your memory!",
          "question": "What is...?",
          "options": ["A", "B", "C", "D"],
          "answer": "A"
        }
      ]
    }
  ]
}

CHAPTER TEXT TO ADAPT:
${chapterText.slice(0, 3000)}
`
