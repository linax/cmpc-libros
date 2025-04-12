import { createContext } from "react"
import { Book, BookFilters, PaginationParams, SortParams } from "../../models/book.models"

interface BookContextProps {
  books: Book[]
  totalBooks: number
  loading: boolean
  error: string | null
  filters: BookFilters
  pagination: PaginationParams
  sort: SortParams
  searchTerm: string
  setFilters: (filters: BookFilters) => void
  setPagination: (pagination: PaginationParams) => void
  setSort: (sort: SortParams) => void
  setSearchTerm: (searchTerm: string) => void
  fetchBooks: () => Promise<void>
  genres: string[]
  publishers: string[]
  authors: string[]
}

export const BookContext = createContext<BookContextProps>({} as BookContextProps)
