import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Grid, CircularProgress, Snackbar, Alert } from "@mui/material"

import { BookGenre } from "../../models/book.models" // Asumiendo que tienes un enum para géneros
import { createBook } from "../../services/bookService"

interface AddBookModalProps {
  open: boolean
  onClose: () => void
  onBookAdded: () => void // Callback para refrescar la lista de libros
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ open, onClose, onBookAdded }) => {
  // Estado inicial para un nuevo libro
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

  // Maneja cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setBookData({
      ...bookData,
      [name]: value
    })
  }

  // Maneja cambios en el switch de disponibilidad
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookData({
      ...bookData,
      availability: e.target.checked
    })
  }

  // Envía el formulario para crear un nuevo libro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Convertimos el precio y stock a números
      const bookToSave = {
        ...bookData,
        price: Number(bookData.price),
        stock: Number(bookData.stock)
      }

      await createBook(bookToSave)
      setSuccess(true)
      setBookData(initialBookState)
      onBookAdded() // Notificar al componente padre para que actualice la lista

      // Cerrar el modal después de un breve retraso
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError("Error al crear el libro. Por favor, inténtalo de nuevo.")
      console.error("Error creating book:", err)
    } finally {
      setLoading(false)
    }
  }

  // Función para resetear el formulario
  const handleReset = () => {
    setBookData(initialBookState)
    setError(null)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Nuevo Libro</DialogTitle>
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
              Limpiar
            </Button>
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success">Libro creado exitosamente!</Alert>
      </Snackbar>
    </>
  )
}
