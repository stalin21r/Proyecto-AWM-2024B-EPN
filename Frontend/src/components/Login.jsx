import { useState, useEffect } from 'react'
import '../Login.css' // Importa los estilos específicos para este componente
import lobo from '../assets/loboLogin.png'
import electronicaText from '../assets/electronica-text.png'
import logoAeie from '../assets/logo.png'
import axios from 'axios'
import { Snackbar, Alert } from '@mui/material'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function Login() {
  const [formData, setFormData] = useState({ User: '', Password: '' })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })

  // Borra el token al entrar en la página de login
  useEffect(() => {
    localStorage.removeItem('token')
  }, [])

  const ingresar = async (e) => {
    e.preventDefault() // Prevenir el comportamiento predeterminado del formulario
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        usuario: formData.User,
        contrasena: formData.Password
      })

      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token)

      // Mostrar mensaje de éxito y redirigir a administración
      setSnackbar({
        open: true,
        message: 'Inicio de sesión exitoso.',
        severity: 'success'
      })

      setTimeout(() => {
        window.location.href = '/administracion' // Redirige a la página de administración
      }, 1000)
    } catch (error) {
      const errorMsg = error.response?.data.message || error.message
      console.error('Error al iniciar sesión:', errorMsg)

      // Mostrar mensaje de error
      setSnackbar({ open: true, message: errorMsg, severity: 'error' })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={lobo} alt="Wolf Avatar" className="wolf-avatar" />
        <img
          src={electronicaText}
          alt="electronica-text"
          className="electronica-text"
        />
      </div>
      <div className="right-section">
        <div className="right-section-content">
          <img src={logoAeie} alt="AEIE Logo" className="aeie-logo" />
          <h2>Iniciar Sesión</h2>
          <form className="login-form" onSubmit={ingresar}>
            <input
              name="User"
              value={formData.User}
              onChange={handleChange}
              type="text"
              placeholder="Usuario"
            />
            <input
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              type="password"
              placeholder="Contraseña"
            />
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
    </div>
  )
}
