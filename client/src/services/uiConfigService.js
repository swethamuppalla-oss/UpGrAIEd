import { get, post } from './api'

export const getUIConfig = () => get('/ui-config')
export const updateUIConfig = (data) => post('/ui-config', data)
