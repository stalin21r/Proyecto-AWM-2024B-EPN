import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Snackbar,
  Alert
} from '@mui/material'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'
export function Usuario() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    usuario: '',
    anteriorContrasena: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  useEffect(() => {
    const fetchUsuario = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const loggedUser = JSON.parse(atob(token.split('.')[1]))

      axios
        .get(`${API_URL}/api/usuario/${loggedUser.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        })
        .then((response) => {
          const usr = response.data.usuario
          setUsuario({
            nombre: usr.nombre || '',
            apellido: usr.apellido || '',
            correo: usr.correo || '',
            usuario: usr.usuario || '',
            anteriorContrasena: '', // Inicializa los campos de contraseñas vacíos
            nuevaContrasena: '',
            confirmarContrasena: ''
          })
        })
        .catch((error) => {
          setSnackbar({
            open: true,
            message: error.data.message,
            severity: 'error'
          })
        })
    }

    fetchUsuario()
  }, [])

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (usuario.nuevaContrasena !== usuario.confirmarContrasena) {
      setSnackbar({
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error'
      })
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      return
    }
    const loggedUser = JSON.parse(atob(token.split('.')[1]))

    axios
      .put(
        `${API_URL}/api/usuario/${loggedUser.id}`,
        {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          usuario: usuario.usuario,
          anteriorContrasena: usuario.anteriorContrasena,
          contrasena: usuario.nuevaContrasena
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        }
      )
      .then((response) => {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error'
        })
      })
  }

  return (
    <Box
      sx={{
        width: 600,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2
      }}
    >
      <Typography variant="h4" gutterBottom>
        Actualizar Usuario
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre *"
              name="nombre"
              value={usuario.nombre || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido *"
              name="apellido"
              value={usuario.apellido || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Correo *"
              name="correo"
              value={usuario.correo || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Usuario *"
              name="usuario"
              value={usuario.usuario || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              name="nuevaContrasena"
              type="password"
              value={usuario.nuevaContrasena || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              name="confirmarContrasena"
              type="password"
              value={usuario.confirmarContrasena || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contraseña Anterior"
              name="anteriorContrasena"
              type="password"
              value={usuario.anteriorContrasena || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Actualizar
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
