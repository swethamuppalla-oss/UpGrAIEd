// Top-level fields on the CmsSection document (not inside metadata)
export const SECTION_TOP_FIELDS = new Set([
  'title', 'subtitle',
  'primaryCTA', 'secondaryCTA',
  'primaryCTALink', 'secondaryCTALink',
  'backgroundImage', 'enabled', 'order',
])

/**
 * Parse "page.section.field" → { page, section, field }
 * Also supports "page.section.meta.nested.path" for metadata fields.
 */
export function parseContentKey(contentKey) {
  const parts = contentKey.split('.')
  if (parts.length < 3) {
    throw new Error(`Invalid contentKey: "${contentKey}". Expected "page.section.field"`)
  }
  const [page, section, ...fieldParts] = parts
  return { page, section, field: fieldParts.join('.') }
}

export function buildContentKey(page, section, field) {
  return `${page}.${section}.${field}`
}

/** Read a dot-path from an object (e.g. "features.0.title") */
export function getByPath(obj, path) {
  return path.split('.').reduce((cur, key) => cur?.[key], obj)
}

/** Immutably set a dot-path value */
export function setByPath(obj, path, value) {
  const keys = path.split('.')
  const result = { ...obj }
  let cur = result
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...(cur[keys[i]] || {}) }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return result
}

/**
 * Build the update payload for a single field save.
 * Returns { [field]: value } for top-level fields.
 * Returns null for metadata paths (caller must handle full metadata merge).
 */
export function buildFieldPayload(field, value) {
  if (SECTION_TOP_FIELDS.has(field)) return { [field]: value }
  return null
}
