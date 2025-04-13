import React from "react"
import { Paper, Grid, FormControlLabel, Switch, Typography, Button, Box } from "@mui/material"
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
export const BookFilters: React.FC<BookFiltersProps> = ({ filters, searchTerm, onFilterChange, onSearchChange, onClearFilters }) => {
  const [showOnlyAvailable, setShowOnlyAvailable] = React.useState(filters.availability === true)

  React.useEffect(() => {
    setShowOnlyAvailable(filters.availability === true)
  }, [filters.availability])

  const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setShowOnlyAvailable(checked)
    onFilterChange({
      ...filters,
      availability: checked ? true : undefined
    })
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

        <Grid item xs={12} md={3}>
          <FormControlLabel control={<Switch checked={showOnlyAvailable} onChange={handleAvailabilityChange} name="availability" />} label="Solo disponibles" />
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
