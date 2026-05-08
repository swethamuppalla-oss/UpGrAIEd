import { get, put } from './api'

export const getUIConfig    = ()     => get('/ui-config')
export const updateUIConfig = (data) => put('/ui-config', data)
