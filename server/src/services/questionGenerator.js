export const generateFromTemplate = (templateObj) => {
  const a = Math.floor(Math.random() * 20)
  const b = Math.floor(Math.random() * 20)

  const text = templateObj.template
    .replace('{a}', a)
    .replace('{b}', b)

  return {
    id: Date.now().toString(),
    text,
    answer: (a + b).toString(),
    templateId: templateObj.id,
  }
}
