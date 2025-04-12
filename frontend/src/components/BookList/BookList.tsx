import React from "react"
import { Paper, Typography, Box, Button, Chip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { Book, SortParams } from "../../../src/models/book.models"
import { DataTable } from "../../../src/components/ui/DataTable/DataTable"
import { useNavigate } from "react-router-dom"

interface BookListProps {
  books: Book[]
  loading: boolean
  totalBooks: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSortChange: (sort: SortParams) => void
  currentSort: SortParams
}

export const BookList: React.FC<BookListProps> = ({ books, loading, totalBooks, page, limit, onPageChange, onLimitChange, onSortChange, currentSort }) => {
  const navigate = useNavigate()

  const handleSortChange = (property: keyof Book) => {
    const isAsc = currentSort.field === property && currentSort.direction === "asc"
    onSortChange({ field: property, direction: isAsc ? "desc" : "asc" })
  }

  const goToAddBook = () => {
    navigate("/books/new")
  }

  const goToBookDetails = (id: string) => {
    navigate(`/books/${id}`)
  }

  const columns = [
    { id: "title" as keyof Book, label: "Título", minWidth: 200 },
    { id: "author" as keyof Book, label: "Autor", minWidth: 170 },
    { id: "publisher" as keyof Book, label: "Editorial", minWidth: 170 },
    {
      id: "price" as keyof Book,
      label: "Precio",
      minWidth: 100,
      align: "right" as const,
      format: (value: number) => `$${value.toFixed(2)}`
    },
    {
      id: "genre" as keyof Book,
      label: "Género",
      minWidth: 130,
      format: (value: string) => <Chip label={value} size="small" color="primary" variant="outlined" />
    },
    {
      id: "available" as keyof Book,
      label: "Disponibilidad",
      minWidth: 130,
      format: (value: boolean) => <Chip label={value ? "Disponible" : "No disponible"} color={value ? "success" : "error"} size="small" />
    }
  ]

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Typography variant="h5">Inventario de Libros</Typography>

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={goToAddBook}>
          Agregar Libro
        </Button>
      </Box>

      <DataTable<Book> columns={columns} data={books} loading={loading} totalItems={totalBooks} page={page} rowsPerPage={limit} onPageChange={onPageChange} onRowsPerPageChange={onLimitChange} onSort={handleSortChange} orderBy={currentSort.field} orderDirection={currentSort.direction} />
    </Paper>
  )
}
