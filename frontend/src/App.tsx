import React from "react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { theme } from "./config/theme"
import { AppRouter } from "./router"
import { BookProvider } from "./contexts/BookContext/BookProvider"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <BookProvider>
          <AppRouter />
        </BookProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
