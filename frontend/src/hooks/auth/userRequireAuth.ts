import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext/useAuth"

export const useRequireAuth = (redirectTo = "/login") => {
  const {
    state: { isAuthenticated, isLoading }
  } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo)
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  return { isLoading, isAuthenticated }
}
