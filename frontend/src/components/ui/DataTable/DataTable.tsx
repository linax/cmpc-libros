import React from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Box, Typography, TableSortLabel } from "@mui/material"

interface Column<T> {
  id: keyof T
  label: string
  minWidth?: number
  align?: "right" | "left" | "center"
  format?: (value: any) => string
}

interface DataTableProps<T> {
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
}

export function DataTable<T extends { id: string | number }>({ columns, data, loading, totalItems, page, rowsPerPage, onPageChange, onRowsPerPageChange, onSort, orderBy, orderDirection = "asc" }: DataTableProps<T>) {
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
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={String(column.id)} align={column.align} style={{ minWidth: column.minWidth }}>
                  {onSort ? (
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
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography variant="body1">No hay datos disponibles</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map(row => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map(column => {
                    const value = row[column.id]
                    return (
                      <TableCell key={String(column.id)} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={totalItems} rowsPerPage={rowsPerPage} page={page - 1} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Filas por página:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`} />
    </Paper>
  )
}
