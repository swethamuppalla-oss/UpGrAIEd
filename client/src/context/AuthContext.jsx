import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [token,     setToken]     = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until localStorage is read

  // Hydrate from localStorage ONCE on mount — before any ProtectedRoute evaluates
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole  = localStorage.getItem('role');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedRole) {
      setToken(storedToken);
      try {
        setUser(storedUser ? JSON.parse(storedUser) : { role: storedRole });
      } catch {
        setUser({ role: storedRole });
      }
    }
    setIsLoading(false);
  }, []);

  // login(userData, jwtToken) — user object first, token second
  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role',  userData.role);
    localStorage.setItem('user',  JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const homeRoute = user
    ? ({
        student: '/dashboard/student',
        parent:  '/dashboard/parent',
        creator: '/dashboard/creator',
        admin:   '/dashboard/admin',
      }[user.role] ?? '/login')
    : '/login';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, homeRoute, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
