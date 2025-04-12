import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ROUTES } from "./config/routes"
import { BooksPage } from "./pages/BooksPage/BooksPage"
// TODO: Uncomment the following imports when the components are implemented
// import { BookDetailsPage } from './pages/BookDetailsPage/BookDetailsPage';
// import { BookFormPage } from './pages/BookFormPage/BookFormPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.BOOKS} />} />
      <Route path={ROUTES.BOOKS} element={<BooksPage />} />
      {/* TODO: Uncomment the following routes when the components are implemented
      <Route path={ROUTES.BOOK_DETAILS} element={<BookDetailsPage />} />
      <Route path={ROUTES.BOOK_NEW} element={<BookFormPage />} />
      <Route path={ROUTES.BOOK_EDIT} element={<BookFormPage />} />
      */}
    </Routes>
  )
}
