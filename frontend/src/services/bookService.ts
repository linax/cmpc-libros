import apiClient from "./api"
import { Book, BookFilters, PaginationParams, SortParams, BooksResponse } from "../models/book.models"

export const fetchBooks = async (filters: BookFilters = {}, pagination: PaginationParams = { page: 1, limit: 10 }, sort: SortParams = { field: "title", direction: "asc" }, searchTerm: string = ""): Promise<BooksResponse> => {
  const { data } = await apiClient.get("/books", {
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
  const { data } = await apiClient.get(`/books/${id}`)
  return data
}

export const createBook = async (book: Omit<Book, "id">): Promise<Book> => {
  const { data } = await apiClient.post("/books", book)
  return data
}

export const updateBook = async (book: Partial<Book>): Promise<Book> => {
  try {
    const { id, ...bookData } = book

    const preparedData = {
      ...bookData,
      price: bookData.price !== undefined ? Number(bookData.price) : undefined,
      stock: bookData.stock !== undefined ? Number(bookData.stock) : undefined
    }

    const { data } = await apiClient.patch(`/books/${id}`, preparedData)
    return data
  } catch (error) {
    console.error("Error updating book:", error)
    throw error
  }
}

export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete(`/books/${id}`)
}

export const fetchGenres = async (): Promise<string[]> => {
  const { data } = await apiClient.get("/books/genres")
  return data
}

export const fetchPublishers = async (): Promise<string[]> => {
  const { data } = await apiClient.get("/books/publishers")
  return data
}

export const fetchAuthors = async (): Promise<string[]> => {
  const { data } = await apiClient.get("/books/authors")
  return data
}
