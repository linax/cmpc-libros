import React from "react"
import { Container, Alert, Snackbar } from "@mui/material"

import { useBooks } from "../../contexts/BookContext/useBooks"
import { BookFilters as BookFiltersType, SortParams } from "../../models/book.models"
import { BookFilters } from "../../components/BookFilters/BookFilters"
import { BookList } from "../../components/BookList/BookList"

export const BooksPage: React.FC = () => {
  const { books, totalBooks, loading, error, filters, pagination, sort, searchTerm, setFilters, setPagination, setSort, setSearchTerm, genres, publishers, authors } = useBooks()

  const handleFilterChange = (newFilters: BookFiltersType) => {
    setFilters(newFilters)
    setPagination({ ...pagination, page: 1 }) // Reset to first page on filter change
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setPagination({ ...pagination, page: 1 }) // Reset to first page on search
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
    setPagination({ ...pagination, page: 1 }) // Reset to first page
  }

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page })
  }

  const handleLimitChange = (limit: number) => {
    setPagination({ page: 1, limit })
  }

  const handleSortChange = (newSort: SortParams) => {
    setSort(newSort)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BookFilters filters={filters} searchTerm={searchTerm} onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} onClearFilters={handleClearFilters} genres={genres} publishers={publishers} authors={authors} />

      <BookList books={books} loading={loading} totalBooks={totalBooks} page={pagination.page} limit={pagination.limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} onSortChange={handleSortChange} currentSort={sort} />

      <Snackbar open={!!error} autoHideDuration={6000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}
