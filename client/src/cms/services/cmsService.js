import API from '../../services/api'

export async function fetchPageSections(page) {
  const res = await API.get(`/cms/${page}`)
  return res.data.sections || []
}

export async function fetchAllPageSections(page) {
  const res = await API.get(`/cms/${page}/all`)
  return res.data.sections || []
}

export async function fetchPageConfig(page) {
  const res = await API.get(`/cms/${page}/config`)
  return res.data.config
}

export async function saveSection(page, section, data) {
  const res = await API.put(`/cms/${page}/${section}`, data)
  return res.data.section
}

/**
 * Save a single top-level field on a section.
 * Uses PUT /api/cms/update for a lightweight partial update.
 */
export async function saveField(page, section, field, value) {
  const res = await API.put('/cms/update', { page, section, [field]: value })
  return res.data.section
}

export async function toggleSection(page, section, enabled) {
  const res = await API.patch(`/cms/${page}/${section}/toggle`, { enabled })
  return res.data.section
}

export async function reorderPageSections(page, sections) {
  const res = await API.post(`/cms/${page}/reorder`, { sections })
  return res.data
}
