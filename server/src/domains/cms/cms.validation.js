export function validateSectionPayload(data) {
  const errors = []
  const { title, subtitle, primaryCTA, secondaryCTA, order, enabled } = data

  if (title !== undefined) {
    if (typeof title !== 'string') errors.push('title must be a string')
    else if (title.length > 200) errors.push('title must be ≤ 200 characters')
  }
  if (subtitle !== undefined) {
    if (typeof subtitle !== 'string') errors.push('subtitle must be a string')
    else if (subtitle.length > 600) errors.push('subtitle must be ≤ 600 characters')
  }
  if (primaryCTA !== undefined && typeof primaryCTA !== 'string')
    errors.push('primaryCTA must be a string')
  if (secondaryCTA !== undefined && typeof secondaryCTA !== 'string')
    errors.push('secondaryCTA must be a string')
  if (order !== undefined && (!Number.isFinite(Number(order)) || Number(order) < 0))
    errors.push('order must be a non-negative number')
  if (enabled !== undefined && typeof enabled !== 'boolean')
    errors.push('enabled must be a boolean')

  if (data.metadata !== undefined) {
    if (typeof data.metadata !== 'object' || Array.isArray(data.metadata)) {
      errors.push('metadata must be a plain object')
    } else {
      try {
        if (JSON.stringify(data.metadata).length > 50_000)
          errors.push('metadata exceeds maximum allowed size (50 KB)')
      } catch {
        errors.push('metadata contains non-serialisable values')
      }
    }
  }

  return errors
}

export function validateReorderPayload(sections) {
  if (!Array.isArray(sections)) return ['sections must be an array']
  return sections
    .map((s, i) => (!s?.section ? `sections[${i}].section is required` : null))
    .filter(Boolean)
}
