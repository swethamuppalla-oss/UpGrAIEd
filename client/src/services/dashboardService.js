import { get } from './api'

export async function getStudentDashboard() {
  try {
    return await get('/student/dashboard')
  } catch (err) {
    console.error('Dashboard fetch error:', err)
    throw err
  }
}
