import React, { useState } from "react"
import { Paper, Typography, Box, Button, Chip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { Book, SortParams } from "../../../src/models/book.models"
import { DataTable } from "../../../src/components/ui/DataTable/DataTable"
import { useNavigate } from "react-router-dom"
import { AddBookModal } from "./AddBookModal"

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
  onRefreshBooks: () => void // Nueva prop para refrescar la lista después de agregar
}

export const BookList: React.FC<BookListProps> = ({ books, loading, totalBooks, page, limit, onPageChange, onLimitChange, onSortChange, currentSort, onRefreshBooks }) => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSortChange = (property: keyof Book) => {
    const isAsc = currentSort.field === property && currentSort.direction === "asc"
    onSortChange({ field: property, direction: isAsc ? "desc" : "asc" })
  }

  const goToBookDetails = (id: string) => {
    navigate(`/books/${id}`)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBookAdded = () => {
    onRefreshBooks() // Recargar la lista de libros después de agregar uno nuevo
  }

  const columns = [
    { id: "title" as keyof Book, label: "Título", minWidth: 200 },
    { id: "author" as keyof Book, label: "Autor", minWidth: 170 },
    { id: "publisher" as keyof Book, label: "Editorial", minWidth: 170 },
    {
      id: "price" as keyof Book,
      label: "Precio",
      minWidth: 100,
      align: "right" as const
      // format: (value: number) => `$${value.toFixed(2)}`
    },
    {
      id: "genre" as keyof Book,
      label: "Género",
      minWidth: 130,
      format: (value: string) => <Chip label={value} size="small" color="primary" variant="outlined" />
    },
    {
      id: "availability" as keyof Book, // Cambiado de "available" a "availability" para coincidir con tu backend
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

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Agregar Libro
        </Button>
      </Box>

      <DataTable<Book> columns={columns} data={books} loading={loading} totalItems={totalBooks} page={page} rowsPerPage={limit} onPageChange={onPageChange} onRowsPerPageChange={onLimitChange} onSort={handleSortChange} orderBy={currentSort.field} orderDirection={currentSort.direction} onRowClick={row => goToBookDetails(row.id)} />

      {/* Modal para agregar libro */}
      <AddBookModal open={isModalOpen} onClose={handleCloseModal} onBookAdded={handleBookAdded} />
    </Paper>
  )
}
