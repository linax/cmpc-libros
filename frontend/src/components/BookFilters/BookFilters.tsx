import React from "react"
import { Paper, Grid, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, FormControlLabel, Switch, Typography, Button, Box } from "@mui/material"
import { BookFilters as BookFiltersType } from "../../../src/models/book.models"
import { SearchField } from "../../../src/components/common/SearchField/SearchField"

interface BookFiltersProps {
  filters: BookFiltersType
  searchTerm: string
  onFilterChange: (filters: BookFiltersType) => void
  onSearchChange: (value: string) => void
  onClearFilters: () => void
  genres: string[]
  publishers: string[]
  authors: string[]
}

export const BookFilters: React.FC<BookFiltersProps> = ({ filters, searchTerm, onFilterChange, onSearchChange, onClearFilters, genres, publishers, authors }) => {
  const handleFilterChange = (key: keyof BookFiltersType) => (event: SelectChangeEvent) => {
    onFilterChange({ ...filters, [key]: event.target.value })
  }

  const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, available: event.target.checked })
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filtros
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <SearchField value={searchTerm} onChange={onSearchChange} placeholder="Buscar por título o autor..." />
        </Grid>
        {/* TODO: Uncomment the following routes when the components are implemented
              <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="genre-select-label">Género</InputLabel>
            <Select labelId="genre-select-label" id="genre-select" value={filters.genre || ""} label="Género" onChange={handleFilterChange("genre")}>
              <MenuItem value="">Todos</MenuItem>
              {genres.map(genre => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="publisher-select-label">Editorial</InputLabel>
            <Select labelId="publisher-select-label" id="publisher-select" value={filters.publisher || ""} label="Editorial" onChange={handleFilterChange("publisher")}>
              <MenuItem value="">Todas</MenuItem>
              {publishers.map(publisher => (
                <MenuItem key={publisher} value={publisher}>
                  {publisher}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="author-select-label">Autor</InputLabel>
            <Select labelId="author-select-label" id="author-select" value={filters.author || ""} label="Autor" onChange={handleFilterChange("author")}>
              <MenuItem value="">Todos</MenuItem>
              {authors.map(author => (
                <MenuItem key={author} value={author}>
                  {author}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      */}

        <Grid item xs={12} md={3}>
          <FormControlLabel control={<Switch checked={!!filters.available} onChange={handleAvailabilityChange} name="available" />} label="Solo disponibles" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={onClearFilters}>
          Limpiar filtros
        </Button>
      </Box>
    </Paper>
  )
}
