import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { Menu, MenuItem, IconButton, Typography } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import lobo from '../assets/lobo.png'
import { useNavigate } from 'react-router-dom'

export function Sidebar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [user, setUser] = useState({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)
  const token = localStorage.getItem('token')

  // Obtener y decodificar el token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (error) {
        console.error('Error al decodificar el token:', error)
      }
    }
  }, [token])

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900)
      if (window.innerWidth >= 900) {
        setIsSidebarOpen(false) // Cerrar sidebar si se agranda la pantalla
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Abrir/cerrar el menú de usuario
  const handleUserMenuClick = (event) => setAnchorEl(event.currentTarget)
  const handleUserMenuClose = () => setAnchorEl(null)
  const handleLogout = () => {
    navigate('/login')
    handleUserMenuClose()
  }
  const handleAccount = () => {
    navigate('/administracion/usuario')
    handleUserMenuClose()
  }

  // Abrir/cerrar el aside en pantallas pequeñas
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Botón para abrir/cerrar el aside en pantallas pequeñas */}
      {isMobile && (
        <IconButton
          className="sidebar-toggle"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            background: '#fde269'
          }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      )}

      {/* Aside */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <img className="lobo-aeie" src={lobo} alt="aeie-lobo" />
        <NavLink to="/administracion">
          <h2 className="titulo-sidebar">AEIE</h2>
        </NavLink>
        <nav className="menu">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'menu-item active' : 'menu-item'
            }
            to="/administracion/inicio"
          >
            Inicio
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'menu-item active' : 'menu-item'
            }
            to="/administracion/tienda"
          >
            Tienda
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'menu-item active' : 'menu-item'
            }
            to="/administracion/casilleros"
          >
            Casilleros
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'menu-item active' : 'menu-item'
            }
            to="/administracion/turnos-y-asistencia"
          >
            Turnos y Asistencia
          </NavLink>
          {user.rol === true && (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'menu-item active' : 'menu-item'
              }
              to="/administracion/usuarios"
            >
              Administrar Usuarios
            </NavLink>
          )}
        </nav>

        {/* Botón de usuario y menú desplegable */}
        <div className="user-menu-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IconButton
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserMenuClick}
              color="inherit"
              size="large"
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
            <Typography className="user-name">
              {user.nombre} {user.apellido}
            </Typography>
          </div>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem onClick={handleAccount}>Cuenta</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </div>
      </aside>
    </>
  )
}
