export function getBloomMessage({ accuracy, progress, weakAreas = [] } = {}) {
  const numericAccuracy = Number(accuracy);
  const numericProgress = Number(progress);
  const safeAccuracy = Number.isFinite(numericAccuracy) ? numericAccuracy : 70;
  const safeProgress = Number.isFinite(numericProgress) ? numericProgress : 0;
  const areas = Array.isArray(weakAreas) ? weakAreas : [];

  if (safeAccuracy > 85 && safeProgress > 80) {
    return "Bloom has evolved 🌸🔥";
  }

  if (safeAccuracy < 50) {
    return "Let’s slow down and build this step by step 🌱";
  }

  if (areas.length > 0) {
    return `Let’s improve ${areas[0]} together 🌿`;
  }

  if (safeAccuracy > 85) {
    return "You’re doing amazing — keep going! 🌸";
  }

  return "You're growing stronger every day 🌾";
}
