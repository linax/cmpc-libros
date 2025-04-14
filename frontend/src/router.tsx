import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ROUTES } from "./config/routes"
import { BooksPage } from "./pages/BooksPage/BooksPage"
import { LoginPage } from "./pages/AuthPages/LoginPage"
import { RegisterPage } from "./pages/AuthPages/RegisterPage"
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute"

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.BOOKS} />} />
      <Route
        path={ROUTES.BOOKS}
        element={
          <ProtectedRoute>
            <BooksPage />
          </ProtectedRoute>
        }
      />

      {/* Not found routes */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
    </Routes>
  )
}
