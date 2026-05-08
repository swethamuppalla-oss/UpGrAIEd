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
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getStoredSession()
    if (session) {
      setToken(session.token)
    }
    setIsLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setToken(authToken)
    setUser(userData)
  }

  const logout = async () => {
    await logoutService()
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  console.log("AUTH TOKEN:", token)

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
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
