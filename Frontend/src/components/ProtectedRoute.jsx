/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode' // jwt-decode no tiene exportación por defecto, ajusta si es necesario

function isTokenExpired(token) {
  try {
    const currentTime = Math.floor(Date.now() / 1000) // Tiempo actual en segundos
    return token.exp < currentTime
  } catch (error) {
    console.error('Error al verificar la expiración del token:', error)
    return true
  }
}

function verifyRole(token, requiredRole) {
  // Si no se requiere un rol específico, permite el acceso
  if (requiredRole === false) {
    return true
  }
  // Verifica si el rol del token coincide con el rol requerido
  return token.rol === requiredRole
}

export function ProtectedRoute({ children, requiredRole = false }) {
  const token = localStorage.getItem('token')
  // Si no hay token, redirige al inicio
  if (!token) {
    return <Navigate to="/" replace />
  }
  try {
    const decoded = jwtDecode(token)
    // Verifica si el token está expirado
    if (isTokenExpired(decoded)) {
      console.warn('Token expirado, redirigiendo al inicio.')
      localStorage.removeItem('token')
      return <Navigate to="/" replace />
    }
    // Verifica el rol del usuario
    if (!verifyRole(decoded, requiredRole)) {
      console.warn('Acceso denegado: el usuario no tiene el rol requerido.')
      return <Navigate to="/administracion" replace />
    }
    // Si todo es válido, renderiza el componente hijo
    return children
  } catch (error) {
    console.error('Error al procesar el token:', error)
    localStorage.removeItem('token')
    return <Navigate to="/" replace />
  }
}
