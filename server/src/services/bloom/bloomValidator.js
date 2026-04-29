export const validateBloomJSON = (data) => {
  if (!data || !Array.isArray(data.days) || data.days.length !== 7) {
    throw new Error('Invalid JSON: Must contain exactly 7 days.')
  }

  const expectedLevels = ['remember', 'understand', 'understand', 'apply', 'apply', 'analyze', 'create']

  data.days.forEach((day, i) => {
    if (day.day !== i + 1) {
      throw new Error(`Invalid JSON: Day ${i + 1} has incorrect day number.`)
    }
    if (day.bloomLevel !== expectedLevels[i]) {
      throw new Error(`Invalid JSON: Day ${i + 1} must be bloomLevel '${expectedLevels[i]}'.`)
    }
    if (!Array.isArray(day.sections) || day.sections.length === 0) {
      throw new Error(`Invalid JSON: Day ${i + 1} must contain sections array.`)
    }

    day.sections.forEach((section, sIdx) => {
      if (!['explanation', 'guided_thinking', 'application', 'reflection', 'quiz'].includes(section.type)) {
        throw new Error(`Invalid JSON: Day ${day.day} section ${sIdx} has invalid type '${section.type}'.`)
      }
      if (section.type === 'quiz') {
        if (!section.question || !Array.isArray(section.options) || !section.answer) {
          throw new Error(`Invalid JSON: Day ${day.day} quiz is missing question, options, or answer.`)
        }
        if (!section.options.includes(section.answer)) {
          throw new Error(`Invalid JSON: Day ${day.day} quiz answer must be one of the options.`)
        }
      }
    })
  })

  return true
}
