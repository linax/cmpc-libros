import React from "react"
import { TextField, InputAdornment } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  fullWidth?: boolean
}

export const SearchField: React.FC<SearchFieldProps> = ({ value, onChange, placeholder = "Buscar...", fullWidth = true }) => {
  return (
    <TextField
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
    />
  )
}
