import api from "./api"
import { Book, BookFilters, PaginationParams, SortParams, BooksResponse } from "../models/book.models"

export const fetchBooks = async (filters: BookFilters = {}, pagination: PaginationParams = { page: 1, limit: 10 }, sort: SortParams = { field: "title", direction: "asc" }, searchTerm: string = ""): Promise<BooksResponse> => {
  const { data } = await api.get("/books", {
    params: {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sort.field,
      sortDirection: sort.direction,
      search: searchTerm
    }
  })
  return data
}

export const fetchBookById = async (id: string): Promise<Book> => {
  const { data } = await api.get(`/books/${id}`)
  return data
}

export const createBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const { data } = await api.post("/books", book)
  return data
}

export const updateBook = async (book: Partial<Book>): Promise<Book> => {
  try {
    // Extraemos el ID y el resto de propiedades
    const { id, ...bookData } = book

    // Aseguramos que las propiedades numéricas sean números
    const preparedData = {
      ...bookData,
      price: bookData.price !== undefined ? Number(bookData.price) : undefined,
      stock: bookData.stock !== undefined ? Number(bookData.stock) : undefined
    }

    // Realizamos la petición PATCH
    const { data } = await api.patch(`/books/${id}`, preparedData)
    return data
  } catch (error) {
    console.error("Error updating book:", error)
    throw error
  }
}

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`)
}

// Obtener opciones para filtros
export const fetchGenres = async (): Promise<string[]> => {
  const { data } = await api.get("/books/genres")
  return data
}

export const fetchPublishers = async (): Promise<string[]> => {
  const { data } = await api.get("/books/publishers")
  return data
}

export const fetchAuthors = async (): Promise<string[]> => {
  const { data } = await api.get("/books/authors")
  return data
}
