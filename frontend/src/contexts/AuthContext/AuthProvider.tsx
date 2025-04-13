import React, { useState, useEffect, ReactNode } from "react"

import * as authService from "../../services/authService"
import { User } from "../../models/user.models"
import { AuthContext } from "./AuthContext"

// Props para el provider
interface AuthProviderProps {
  children: ReactNode
}

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const loggedUser = await authService.login({ email, password })
      console.log(loggedUser)
      setUser(loggedUser)
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const newUser = await authService.register({ name, email, password })
      setUser(newUser)
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return

    try {
      const updatedUser = await authService.updateUserProfile(userData)
      setUser(updatedUser)
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      throw error
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await authService.changePassword(oldPassword, newPassword)
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
