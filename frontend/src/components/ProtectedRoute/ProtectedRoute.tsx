import React from "react"
import { Navigate } from "react-router-dom"

import { ROUTES } from "../../config/routes"
import { Box, CircularProgress } from "@mui/material"
import { useAuth } from "../../contexts/AuthContext/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <>{children}</>
}
