import React, { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext/useAuth"
import { Container, Box, Typography, TextField, Button, Paper, Link, Alert, CircularProgress } from "@mui/material"
import { ROUTES } from "../../config/routes"

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      await register(name, email, password)
      // La redirección se maneja en el AuthProvider
    } catch (err: any) {
      setError(err.message || "Error al registrarse")
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
            Crear Cuenta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField margin="normal" fullWidth id="name" label="Nombre Completo" name="name" autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)} disabled={loading} />

            <TextField margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />

            <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />

            <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirmar Contraseña" type="password" id="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Registrarse"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                ¿Ya tienes una cuenta?{" "}
                <Link component={RouterLink} to={ROUTES.LOGIN}>
                  Inicia Sesión
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
