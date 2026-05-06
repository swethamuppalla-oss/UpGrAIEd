export function evaluateAnswer({ studentText, expectedPoints }) {
  let score = 0;
  const feedback = [];

  expectedPoints.forEach(point => {
    if (studentText.toLowerCase().includes(point.toLowerCase())) {
      score += 1;
    } else {
      feedback.push(`Missing: ${point}`);
    }
  });

  return {
    score,
    total: expectedPoints.length,
    feedback
  };
}
