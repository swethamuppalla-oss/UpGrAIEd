export const getTemplatesByConcept = async (conceptId) => {
  // Replace with DB later
  return [
    {
      id: 't1',
      difficulty: 'easy',
      type: 'same_pattern',
      template: 'What is {a} + {b}?',
    },
    {
      id: 't2',
      difficulty: 'hard',
      type: 'advanced',
      template: 'Ravi has {a} apples and gets {b} more. Total?',
    },
    {
      id: 't3',
      difficulty: 'easy',
      type: 'remedial',
      template: '{a} + {b} = ?',
    },
  ]
}
