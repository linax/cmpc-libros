import { BrowserRouter } from "react-router-dom"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { theme } from "./config/theme"
import { AppRouter } from "./router"
import { BookProvider } from "./contexts/BookContext/BookProvider"
import { AuthProvider } from "./contexts/AuthContext/AuthProvider"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <BookProvider>
            <AppRouter />
          </BookProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
