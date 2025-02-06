import axios from 'axios'
import { ItemSearch } from './ItemSearch'
import { Productos } from './Productos'
import { useEffect, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function AdministracionTienda() {
  const [productos, setProductos] = useState([])
  const [categoria, setCategoria] = useState(null)
  const [pattern, setPattern] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Cargar categorías al montar el componente
  useEffect(() => {
    axios
      .get(`${API_URL}/api/producto-categorias`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        setCategorias(response.data.categorias)
      })
      .catch((error) => {
        console.error('Error al obtener categorías:', error)
        setSnackbar({
          open: true,
          message: 'No se pudo cargar las categorías. Intente más tarde.',
          severity: 'error'
        })
      })
  }, []) // Ejecuta solo al montar

  // Cargar productos cuando cambia la categoría o el patrón
  useEffect(() => {
    cargarProductos()
  }, [categoria, pattern]) // Ejecuta cada vez que cambia la categoría o el patrón

  const cargarProductos = () => {
    let opts = []
    if (categoria) opts.push(`categoria=${categoria}`)
    if (pattern) opts.push(`pattern=${pattern}`)
    const queryString = opts.length > 0 ? `?${opts.join('&')}` : ''
    axios
      .get(`${API_URL}/api/productos${queryString}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        setProductos(response.data.productos)
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error)
        setProductos([])
        setSnackbar({
          open: true,
          message: 'No existen productos.',
          severity: 'error'
        })
      })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  return (
    <>
      <ItemSearch
        categorias={categorias}
        setCategoria={setCategoria}
        setPattern={setPattern}
        onActualizarProductos={cargarProductos}
        setSnackbar={setSnackbar}
      />
      <Productos
        categorias={categorias}
        productos={productos}
        totalPages={Math.ceil(productos.length / 10)}
        onActualizarProductos={cargarProductos}
        setSnackbar={setSnackbar}
      />
      {/* Snackbar para mostrar mensajes */}
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
    </>
  )
}
