import api, { get } from './api'

export async function uploadMedia(file, section = 'general') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('section', section)

  const res = await api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const getMediaLibrary = (type) =>
  get(`/upload/library${type ? `?type=${encodeURIComponent(type)}` : ''}`)

export const getMedia = (section) =>
  get(`/media${section ? `?section=${encodeURIComponent(section)}` : ''}`)
