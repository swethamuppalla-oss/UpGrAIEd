import { get, put } from './api'

export const getContent = (section) => get(`/content/${section}`)
export const updateContent = (section, data) => put(`/content/${section}`, data)
