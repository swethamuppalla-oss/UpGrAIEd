import { createContext, useContext, useState, useEffect } from 'react'
import {
  clearSession,
  demoLogin as demoLoginService,
  getStoredSession,
  logout as logoutService,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getStoredSession()
    if (session) {
      setToken(session.token)
    }
    setIsLoading(false)
  }, [])

  const login = async () => {
    const newToken = await demoLoginService()
    setToken(newToken)
  }

  const logout = async () => {
    await logoutService()
    setToken(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user: null, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
