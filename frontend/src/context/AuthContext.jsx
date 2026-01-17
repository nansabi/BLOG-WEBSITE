import { createContext, useContext, useEffect, useState } from "react"
import {
  getToken,
  getUser,
  saveToken,
  saveUser,
  removeToken,
  removeUser,
} from "../utils/tokenStorage"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  /* =========================
     LOAD AUTH FROM STORAGE
  ========================= */
  useEffect(() => {
    const storedUser = getUser()
    const storedToken = getToken()

    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    } else {
      setUser(null)
      setToken(null)
    }

    setLoading(false)
  }, [])

  /* =========================
     LOGIN
  ========================= */
  const login = (userData, authToken) => {
    if (!userData || !authToken) return

    setUser(userData)
    setToken(authToken)

    saveUser(userData)
    saveToken(authToken)
  }

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    setUser(null)
    setToken(null)

    removeUser()
    removeToken()
  }

  /* =========================
     CONTEXT VALUE
  ========================= */
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

/* =========================
   OPTIONAL HELPER HOOK
========================= */
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
