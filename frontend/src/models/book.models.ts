export interface Book {
  id: string
  title: string
  author: string
  publisher: string
  availability: boolean
  genre: string
  stock: number
  price: number
  imageUrl?: string
}

export interface BookFilters {
  genre?: string
  publisher?: string
  author?: string
  availability?: boolean
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

export enum BookGenre {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  SCIENCE = "SCIENCE",
  TECHNOLOGY = "TECHNOLOGY",
  HISTORY = "HISTORY",
  BIOGRAPHY = "BIOGRAPHY",
  CHILDREN = "CHILDREN",
  ROMANCE = "ROMANCE",
  THRILLER = "THRILLER",
  FANTASY = "FANTASY",
  OTHER = "OTHER"
}
