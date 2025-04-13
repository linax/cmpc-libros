import React, { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext/useAuth"
import { Container, Box, Typography, TextField, Button, Paper, Link, Alert, CircularProgress } from "@mui/material"
import { ROUTES } from "../../config/routes"

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    try {
      await login(email, password)
      // La redirección se maneja en el AuthProvider
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh"
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: "100%"
          }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" autoComplete="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />

            <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                ¿No tienes una cuenta?{" "}
                <Link component={RouterLink} to={ROUTES.REGISTER}>
                  Regístrate
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
