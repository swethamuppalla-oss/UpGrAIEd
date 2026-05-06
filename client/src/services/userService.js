import { get, post } from './api'

export const createUser = (data) => post('/users', data)

export const getUsers = () => get('/users')
