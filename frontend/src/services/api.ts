import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiError } from "../models/error.models"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

let isRefreshing = false
let failedQueue: {
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
  config: AxiosRequestConfig
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else if (token && prom.config.headers) {
      prom.config.headers.Authorization = `Bearer ${token}`
      prom.resolve(axios(prom.config))
    }
  })

  failedQueue = []
}

// Interceptor to add auth token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken")
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken")
    if (!refreshTokenValue) return null

    const response = await axios.post<{ accessToken: string; refreshToken?: string }>(`${API_URL}/auth/refresh`, { refreshToken: refreshTokenValue }, { headers: { "Content-Type": "application/json" } })

    localStorage.setItem("accessToken", response.data.accessToken)
    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken)
    }

    return response.data.accessToken
  } catch (error) {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    return null
  }
}

// Interceptor pto avoid errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (!originalRequest) {
      return Promise.reject(error)
    }
    if ((originalRequest as any)._retry) {
      return Promise.reject(error)
    }

    const apiError: ApiError = {
      message: error.message || "Error desconocido",
      statusCode: error.response?.status || 500
    }

    if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as Record<string, any>
      apiError.message = data.message || apiError.message
      apiError.errors = data.errors
    }

    if (apiError.statusCode === 401 && localStorage.getItem("refreshToken")) {
      if (!isRefreshing) {
        isRefreshing = true
        ;(originalRequest as any)._retry = true

        try {
          const newToken = await refreshToken()
          if (newToken) {
            processQueue(null, newToken)

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return axios(originalRequest)
          } else {
            processQueue(apiError)

            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            window.location.href = "/login"
            return Promise.reject(apiError)
          }
        } catch (refreshError) {
          processQueue(refreshError)

          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          window.location.href = "/login"
          return Promise.reject(apiError)
        } finally {
          isRefreshing = false
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
      }
    }

    // 401 error redirect to login
    if (apiError.statusCode === 401) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      window.location.href = "/login"
    }

    return Promise.reject(apiError)
  }
)

export default apiClient
