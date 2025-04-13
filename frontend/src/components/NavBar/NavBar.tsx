import React from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from "@mui/material"
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext/useAuth"
import { ROUTES } from "../../config/routes"

export const NavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleClose()
    await logout()
  }

  /*  const handleProfile = () => {
    handleClose()
    navigate(ROUTES.PROFILE)
  }
*/
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Librería App
        </Typography>

        {isAuthenticated ? (
          <>
            <Button color="inherit" component={RouterLink} to={ROUTES.BOOKS}>
              Libros
            </Button>

            <Box sx={{ ml: 2 }}>
              <IconButton size="large" aria-label="cuenta del usuario" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
                {user?.name ? <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>{user.name.charAt(0).toUpperCase()}</Avatar> : <AccountCircle />}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* TODO: Change this if you add profile page
                 <MenuItem onClick={handleProfile}>Mi Perfil</MenuItem>
                */}
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to={ROUTES.LOGIN}>
              Iniciar Sesión
            </Button>
            <Button color="inherit" component={RouterLink} to={ROUTES.REGISTER}>
              Registrarse
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
