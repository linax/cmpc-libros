import React, { useState, useEffect, ReactNode } from "react"
import { BookContext } from "./BookContext"
import { Book, BookFilters, PaginationParams, SortParams } from "../../models/book"
import * as bookService from "../../services/bookService"
import { useDebounce } from "../../hooks/useDebounce"

interface BookProviderProps {
  children: ReactNode
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<BookFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 })
  const [sort, setSort] = useState<SortParams>({ field: "title", direction: "asc" })
  const [searchTerm, setSearchTerm] = useState("")

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    fetchBooks()
  }, [filters, pagination.page, pagination.limit, sort, debouncedSearchTerm])

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookService.fetchBooks(filters, pagination, sort, debouncedSearchTerm)
      setBooks(response.data)
      setTotalBooks(response.pagination.total)
    } catch (err) {
      setError("Error al cargar los libros")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BookContext.Provider
      value={{
        books,
        totalBooks,
        loading,
        error,
        filters,
        pagination,
        sort,
        searchTerm,
        setFilters,
        setPagination,
        setSort,
        setSearchTerm,
        fetchBooks
        /* genres,
        publishers,
        authors*/
      }}
    >
      {children}
    </BookContext.Provider>
  )
}
