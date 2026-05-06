export function getBloomState({ grade, accuracy = 70, progress = 0, speed } = {}) {
  const numericGrade = Number(grade);
  const numericAccuracy = Number(accuracy);
  const numericProgress = Number(progress);
  const safeAccuracy = Number.isFinite(numericAccuracy) ? numericAccuracy : 70;
  const safeProgress = Number.isFinite(numericProgress) ? numericProgress : 0;

  let stage;

  if (numericGrade <= 5) stage = 'bloom';
  else if (numericGrade <= 7) stage = 'bloomy';
  else if (numericGrade <= 9) stage = 'bloomio';
  else if (numericGrade === 10) stage = 'bloomix';
  else stage = 'bloomax';

  if (safeAccuracy < 50) return 'bloom';
  if (safeAccuracy < 70) return stage;
  if (safeAccuracy > 85 && safeProgress > 70) return 'bloomax';

  return stage;
}
