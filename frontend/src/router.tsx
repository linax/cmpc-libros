import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ROUTES } from "./config/routes"
import { BooksPage } from "./pages/BooksPage/BooksPage"
import { LoginPage } from "./pages/AuthPages/LoginPage"
import { RegisterPage } from "./pages/AuthPages/RegisterPage"
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute"
// TODO: Uncomment the following imports when the components are implemented
// import { BookDetailsPage } from './pages/BookDetailsPage/BookDetailsPage';
// import { BookFormPage } from './pages/BookFormPage/BookFormPage';

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

      {/* TODO: Uncomment the following routes when the components are implemented */}
      {/* 
      <Route 
        path={ROUTES.BOOK_DETAILS} 
        element={
          <ProtectedRoute>
            <BookDetailsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.BOOK_NEW} 
        element={
          <ProtectedRoute>
            <BookFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.BOOK_EDIT} 
        element={
          <ProtectedRoute>
            <BookFormPage />
          </ProtectedRoute>
        } 
      />
      */}

      {/* Ruta para redirigir rutas no encontradas */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
    </Routes>
  )
}
