export interface Book {
  id: string
  title: string
  author: string
  publisher: string
  price: number
  available: boolean
  genre: string
  imageUrl?: string
}

export interface BookFilters {
  genre?: string
  publisher?: string
  author?: string
  available?: boolean
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface SortParams {
  field: keyof Book
  direction: "asc" | "desc"
}

export interface BooksResponse {
  books: Book[]
  total: number
}
