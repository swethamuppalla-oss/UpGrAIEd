const _invalidDateSeen = new Set();

export function computeWeakAreas(history) {
  const map = new Map();
  const now = Date.now();

  for (const h of history) {
    if (!h.conceptId) {
      console.warn("[weakAreas] missing conceptId in history entry", h);
      continue;
    }

    const conceptKey = h.conceptId;

    if (!map.has(conceptKey)) {
      map.set(conceptKey, { wrong: 0, total: 0, lastSeenAt: null });
    }

    const v = map.get(conceptKey);
    v.total += 1;

    if (!h.isCorrect) {
      v.wrong += 1;

      const ts = h.at instanceof Date ? h.at.getTime() : Date.parse(h.at);

      if (!Number.isNaN(ts)) {
        const at = new Date(ts);
        if (!v.lastSeenAt || at > v.lastSeenAt) v.lastSeenAt = at;
      } else {
        const warnKey = `${h.conceptId ?? "unknown"}:${String(h.at)}`;
        if (!_invalidDateSeen.has(warnKey)) {
          _invalidDateSeen.add(warnKey);
          console.warn("[weakAreas] invalid at", {
            value: h.at,
            conceptId: h.conceptId,
          });
        }
      }
    }
  }

  const withScore = [...map.entries()]
    .filter(([_, v]) => v.total >= 3 && v.wrong / v.total >= 0.4)
    .map(([conceptId, v]) => {
      const errorRate = v.wrong / v.total;
      const recencyDays = v.lastSeenAt
        ? (now - v.lastSeenAt.getTime()) / (1000 * 60 * 60 * 24)
        : 999;
      const score = errorRate * 0.7 + (1 / (1 + recencyDays)) * 0.3;
      return { conceptId, lastSeenAt: v.lastSeenAt, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (process.env.DEBUG_WEAK_AREAS) {
    console.debug("[weakAreas]", withScore);
  }

  return withScore.map(({ conceptId, lastSeenAt }) => ({ conceptId, lastSeenAt }));
}
