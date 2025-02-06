/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Casillero } from './Casillero'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
  Snackbar,
  Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function AdministracionCasilleros() {
  const navigate = useNavigate()
  const [selectedCasillero, setSelectedCasillero] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  })
  const [letras, setLetras] = useState([])
  const [casilleros, setCasilleros] = useState([])
  const [selectedLetra, setSelectedLetra] = useState('A')
  const [page, setPage] = useState(1) // Página actual
  const [totalPages, setTotalPages] = useState(1) // Total de páginas
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })
  const loggedUser = JSON.parse(
    atob(localStorage.getItem('token').split('.')[1])
  )

  // Obtener las letras de los bloques desde la API
  useEffect(() => {
    axios
      .get(`${API_URL}/api/casillero-bloques`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        setLetras(response.data.letras)
        setSelectedLetra(response.data.letras[0])
        setTotalPages(response.data.letras.length)
      })
      .catch((error) => {
        console.error('Error al obtener las letras:', error)
      })
  }, [])

  // Obtener los casilleros del bloque según la letra y la página
  useEffect(() => {
    obtenerCasilleros()
  }, [selectedLetra, page])

  const obtenerCasilleros = () => {
    axios
      .get(`${API_URL}/api/casilleros?letra=${selectedLetra}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        setCasilleros(response.data.casilleros)
      })
      .catch((error) => {
        console.error('Error al obtener los casilleros:', error)
      })
  }

  const openModal = (casillero) => {
    setSelectedCasillero(casillero)
    setFormData({
      nombre: casillero.propietario || '',
      correo: casillero.correo || '',
      telefono: casillero.telefono || ''
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedCasillero(null)
    setFormData({ nombre: '', correo: '', telefono: '' })
    setIsModalOpen(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSave = (id) => {
    if (!formData.nombre || !formData.correo || !formData.telefono) {
      setSnackbar({
        open: true,
        message: 'Todos los campos son necesarios',
        severity: 'error'
      })
      return
    }
    const propietarioActualizado = {
      propietario: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono,
      registrado_por: loggedUser.id
    }
    axios
      .put(`${API_URL}/api/casillero?casillero=${id}`, propietarioActualizado, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        obtenerCasilleros()
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        const errorMsg = error.response?.data.message || error.message
        console.error('Error al registrar casillero:', errorMsg)
        // Mostrar mensaje de error
        setSnackbar({ open: true, message: errorMsg, severity: 'error' })
      })
    closeModal()
  }

  const handleDelete = (id) => {
    axios
      .put(
        `${API_URL}:3000/api/casillero/${id}`,
        { registrado_por: loggedUser.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        }
      )
      .then((response) => {
        obtenerCasilleros()
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        const errorMsg = error.response?.data.message || error.message
        console.error('Error al iniciar sesión:', errorMsg)
        // Mostrar mensaje de error
        setSnackbar({ open: true, message: errorMsg, severity: 'error' })
      })
    closeModal()
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    setSelectedLetra(letras[value - 1])
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'left',
          gap: 8
        }}
      >
        <Typography variant="h3" color="#fff" gutterBottom>
          Casilleros
        </Typography>
        {loggedUser.rol && (
          <IconButton
            onClick={() => navigate('/administracion/casilleros/bloques')}
            sx={{
              backgroundColor: '#787878',
              color: '#fff',
              '&:hover': { backgroundColor: '#5b5b5b' },
              borderRadius: '50%',
              width: '50px',
              height: '50px'
            }}
          >
            <SettingsIcon />
          </IconButton>
        )}
      </Box>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '20px'
        }}
      >
        <div className="casilleros-container">
          <header className="letra-bloque">
            <h1>{selectedLetra}</h1>
          </header>
          <section className="bloque-casillero-container">
            <div className="bloque-casillero">
              {casilleros.map((casillero) => (
                <Casillero
                  key={casillero.id}
                  numero={casillero.numero}
                  isArrended={casillero.ocupado}
                  onClick={() => openModal(casillero)}
                />
              ))}
            </div>
          </section>
        </div>
        <Stack spacing={2} className="paginator">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white'
              }
            }}
          />
        </Stack>

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

        {/* Modal */}
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 3,
              borderRadius: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography
                id="modal-title"
                variant="h6"
                color={selectedCasillero?.ocupado ? 'primary' : 'success'}
              >
                {selectedCasillero?.ocupado
                  ? 'Información del Casillero'
                  : 'Casillero Disponible'}
              </Typography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              id="modal-description"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <TextField
                label="Número"
                value={selectedCasillero?.numero}
                disabled
              />
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                error={!formData.nombre}
                helperText={
                  !formData.nombre ? 'Este campos es obligatorio!!' : ''
                }
              />
              <TextField
                label="Correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                required
                error={!formData.correo}
                helperText={
                  !formData.correo ? 'Este campos es obligatorio!!' : ''
                }
              />
              <TextField
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                error={!formData.telefono}
                helperText={
                  !formData.telefono ? 'Este campos es obligatorio!!' : ''
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {selectedCasillero?.ocupado && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(selectedCasillero.id)}
                >
                  Eliminar
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSave(selectedCasillero.id)}
              >
                {selectedCasillero?.ocupado ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={closeModal}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  )
}
