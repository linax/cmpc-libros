import { User } from "../models/user.models"
import apiClient from "./api"
import { jwtDecode } from "jwt-decode"

interface UserPayload {
  id: string
  email: string
  role?: string
  fullName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}
interface AuthResponse {
  user: UserPayload
  accessToken: string
  refreshToken?: string
}

interface TokenPayload {
  userId: string
  email: string
  role?: string
  exp: number
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  fullName: string
  email: string
  password: string
}

// Función para verificar si el token actual ha expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch {
    return true
  }
}

// Función para guardar tokens
const saveTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem("accessToken", accessToken)
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken)
  }
}

// Función para obtener el token de acceso
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken")
}

// Función para refrescar el token cuando expire
export const refreshAuthToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    throw new Error("No hay refresh token disponible")
  }

  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken
    })

    saveTokens(data.accessToken, data.refreshToken)
    return data.accessToken
  } catch (error) {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    throw error
  }
}

// Decodificar información del usuario desde el token
export const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }
  } catch {
    return null
  }
}

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials)

    saveTokens(data.accessToken, data.refreshToken)
    const user = data.user
    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error: any) {
    throw error
  }
}

export const register = async (userData: RegisterData): Promise<User | null> => {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", userData)

    saveTokens(data.accessToken, data.refreshToken)

    const user = data.user
    return {
      id: user.id,
      email: user.email,
      role: user.role
    }
  } catch (error: any) {
    throw error
  }
}

export const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refreshToken")

  // Invalidar el token en el servidor (opcional pero recomendado)
  if (refreshToken) {
    try {
      await apiClient.post("/auth/logout", { refreshToken })
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error)
    }
  }

  // Eliminar tokens del almacenamiento local
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getAccessToken()

  if (!token) {
    return null
  }

  if (isTokenExpired(token)) {
    try {
      await refreshAuthToken()

      /* try {
        const { data } = await apiClient.get<User>("/auth/me")
        return data
      } catch {
        return getUserFromToken(newToken)
      }*/
    } catch {
      // Si falla el refresh, limpiar tokens y retornar null
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return null
    }
  }

  return getUserFromToken(token)
}

export const isAuthenticated = (): boolean => {
  const token = getAccessToken()
  return !!token && !isTokenExpired(token)
}

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  const { data } = await apiClient.patch<User>("/auth/profile", userData)
  return data
}

export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await apiClient.post("/auth/change-password", {
    oldPassword,
    newPassword
  })
}
