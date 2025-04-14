import React, { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Grid, CircularProgress, Snackbar, Alert } from "@mui/material"

import { Book, BookGenre } from "../../models/book"
import { createBook, updateBook } from "../../services/bookService"

interface BookModalProps {
  open: boolean
  onClose: () => void
  onBookSaved: () => void
  bookToEdit?: Book | null
}

export const BookModal: React.FC<BookModalProps> = ({ open, onClose, onBookSaved, bookToEdit }) => {
  const initialBookState = {
    title: "",
    author: "",
    publisher: "",
    price: 0,
    genre: "",
    description: "",
    isbn: "",
    availability: true,
    stock: 0
  }

  const [bookData, setBookData] = useState(initialBookState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isEditMode = Boolean(bookToEdit)

  useEffect(() => {
    if (bookToEdit) {
      setBookData({
        ...bookToEdit,
        price: typeof bookToEdit.price === "string" ? parseFloat(bookToEdit.price) : bookToEdit.price,
        stock: typeof bookToEdit.stock === "string" ? parseInt(bookToEdit.stock as string, 10) : bookToEdit.stock
      })
    } else {
      setBookData(initialBookState)
    }
  }, [bookToEdit, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setBookData({
      ...bookData,
      [name as string]: value
    })
  }

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookData({
      ...bookData,
      availability: e.target.checked
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const bookToSave = {
        ...bookData,
        price: Number(bookData.price),
        stock: Number(bookData.stock)
      }

      if (isEditMode) {
        const { id, title, author, publisher, price, genre, description, isbn, availability, stock } = bookToSave

        await updateBook({
          id,
          title,
          author,
          publisher,
          price,
          genre,
          description,
          isbn,
          availability,
          stock
        })
      } else {
        await createBook(bookToSave)
      }

      setSuccess(true)
      onBookSaved()

      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      const action = isEditMode ? "actualizar" : "crear"
      setError(`Error al ${action} el libro. Por favor, inténtalo de nuevo.`)
      console.error(`Error ${action} book:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (isEditMode && bookToEdit) {
      setBookData(bookToEdit)
    } else {
      setBookData(initialBookState)
    }
    setError(null)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? "Editar Libro" : "Agregar Nuevo Libro"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField name="title" label="Título" value={bookData.title} onChange={handleChange} fullWidth margin="normal" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="author" label="Autor" value={bookData.author} onChange={handleChange} fullWidth margin="normal" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="publisher" label="Editorial" value={bookData.publisher} onChange={handleChange} fullWidth margin="normal" required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="price" label="Precio" type="number" value={bookData.price} onChange={handleChange} fullWidth margin="normal" required InputProps={{ inputProps: { min: 0, step: 0.01 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Género</InputLabel>
                  <Select name="genre" value={bookData.genre} onChange={handleChange} label="Género">
                    {/* Asumiendo que tienes un enum BookGenre */}
                    {Object.values(
                      BookGenre || {
                        FICTION: "Fiction",
                        NON_FICTION: "Non-fiction",
                        SCIENCE: "Science",
                        TECHNOLOGY: "Technology",
                        HISTORY: "History"
                      }
                    ).map(genre => (
                      <MenuItem key={genre} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="stock" label="Stock" type="number" value={bookData.stock} onChange={handleChange} fullWidth margin="normal" InputProps={{ inputProps: { min: 0 } }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="isbn" label="ISBN" value={bookData.isbn} onChange={handleChange} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel control={<Switch checked={bookData.availability} onChange={handleAvailabilityChange} name="availability" color="primary" />} label="Disponible" style={{ marginTop: 16 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="description" label="Descripción" value={bookData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
              </Grid>
            </Grid>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleReset} color="secondary">
              {isEditMode ? "Restaurar" : "Limpiar"}
            </Button>
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success">{isEditMode ? "Libro actualizado exitosamente!" : "Libro creado exitosamente!"}</Alert>
      </Snackbar>
    </>
  )
}
