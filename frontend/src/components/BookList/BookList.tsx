import React, { useState } from "react"
import { Paper, Typography, Box, Button, Chip, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { Book, SortParams } from "../../../src/models/book.models"
import { DataTable, Column } from "../../../src/components/ui/DataTable/DataTable"
import { useNavigate } from "react-router-dom"
import { BookModal } from "./BookModal" // Importamos el nuevo componente
import * as bookService from "../../services/bookService"

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
  onRefreshBooks: () => void
}

export const BookList: React.FC<BookListProps> = ({ books, loading, totalBooks, page, limit, onPageChange, onLimitChange, onSortChange, currentSort, onRefreshBooks }) => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const handleSortChange = (property: keyof Book) => {
    const isAsc = currentSort.field === property && currentSort.direction === "asc"
    onSortChange({ field: property, direction: isAsc ? "desc" : "asc" })
  }

  const goToBookDetails = (id: string) => {
    navigate(`/books/${id}`)
  }

  const handleOpenModal = (book?: Book) => {
    if (book) {
      // Importante: clonar el objeto para evitar modificaciones directas
      setSelectedBook({ ...book })
    } else {
      setSelectedBook(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBook(null)
  }

  const handleBookSaved = () => {
    onRefreshBooks()
  }

  const handleEditBook = (book: Book) => {
    handleOpenModal(book)
  }

  const handleDeleteBook = async (bookId: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este libro?")
    if (confirmDelete) {
      try {
        await bookService.deleteBook(bookId)
        onRefreshBooks()
      } catch (error) {
        alert("Hubo un error al intentar eliminar el libro")
      }
    }
  }

  const columns: Column<Book>[] = [
    { id: "title", label: "Título", minWidth: 200 },
    { id: "author", label: "Autor", minWidth: 170 },
    { id: "publisher", label: "Editorial", minWidth: 170 },
    {
      id: "price",
      label: "Precio",
      minWidth: 100,
      align: "right",
      format: (value: any) => {
        // Asegurarse de que el valor es un número antes de usar toFixed
        const numValue = typeof value === "string" ? parseFloat(value) : Number(value)
        return isNaN(numValue) ? "$0.00" : `$${numValue.toFixed(2)}`
      }
    },
    {
      id: "genre",
      label: "Género",
      minWidth: 130,
      format: (value: string) => <Chip label={value} size="small" color="primary" variant="outlined" />
    },
    {
      id: "availability",
      label: "Disponibilidad",
      minWidth: 130,
      format: (value: boolean) => <Chip label={value ? "Disponible" : "No disponible"} color={value ? "success" : "error"} size="small" />
    },
    {
      id: "actions",
      label: "Acciones",
      renderCell: (book: Book) => (
        <Box>
          <IconButton
            color="primary"
            onClick={e => {
              e.stopPropagation()
              handleEditBook(book)
            }}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={e => {
              e.stopPropagation()
              handleDeleteBook(book.id)
            }}
            sx={{ padding: "8px", color: "red" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      align: "center",
      preventRowClick: true
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

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Agregar Libro
        </Button>
      </Box>

      <DataTable<Book> columns={columns} data={books} loading={loading} totalItems={totalBooks} page={page} rowsPerPage={limit} onPageChange={onPageChange} onRowsPerPageChange={onLimitChange} onSort={handleSortChange} orderBy={currentSort.field} orderDirection={currentSort.direction} onRowClick={row => goToBookDetails(row.id)} />

      {/* Modal para agregar o editar libro */}
      <BookModal open={isModalOpen} onClose={handleCloseModal} onBookSaved={handleBookSaved} bookToEdit={selectedBook} />
    </Paper>
  )
}
