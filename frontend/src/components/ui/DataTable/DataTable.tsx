import React from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Box, Typography, TableSortLabel } from "@mui/material"

interface Column<T> {
  // Recibe un tipo genérico T
  id: keyof T
  label: string
  minWidth?: number
  align?: "right" | "left" | "center"
  format?: (value: any) => React.ReactNode | string | number | boolean // Permite ReactNode
  renderCell?: (row: T) => React.ReactNode // Nueva propiedad para renderización personalizada
  preventRowClick?: boolean // Nueva propiedad
}

interface DataTableProps<T> {
  // Recibe un tipo genérico T
  columns: Column<T>[]
  data: T[]
  loading: boolean
  totalItems: number
  page: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rowsPerPage: number) => void
  onSort?: (property: keyof T) => void
  orderBy?: keyof T
  orderDirection?: "asc" | "desc"
  onRowClick?: (row: T) => void // Prop para manejar el click en la fila
}

export function DataTable<T extends object>({
  // Asegura que T es un objeto
  columns,
  data,
  loading,
  totalItems,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  orderBy,
  orderDirection = "asc",
  onRowClick
}: DataTableProps<T>) {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage + 1)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10))
  }

  const handleSort = (property: keyof T) => () => {
    if (onSort) {
      onSort(property)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                {onSort && column.id !== "delete" ? ( // No permitir ordenar en la columna de eliminar
                  <TableSortLabel active={orderBy === column.id} direction={orderBy === column.id ? orderDirection : "asc"} onClick={handleSort(column.id)}>
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography variant="subtitle1">No hay datos disponibles</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(row => (
              <TableRow
                key={Object.values(row).join("-")} // Asegúrate de que la clave sea única
                onClick={event => {
                  const clickedElement = event.target as HTMLElement
                  // Verifica si el clic ocurrió dentro de un elemento que debería prevenir el click de la fila
                  if (onRowClick && !clickedElement.closest("button, a, input")) {
                    onRowClick(row)
                  }
                }}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align}>
                    {column.renderCell
                      ? column.renderCell(row) // Renderiza el contenido personalizado
                      : column.format
                      ? column.format(row[column.id])
                      : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={totalItems} rowsPerPage={rowsPerPage} page={page - 1} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`} />
    </TableContainer>
  )
}
