import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  IconButton,
  Typography,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function AdministracionTurnos() {
  const [turnos, setTurnos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedTurno, setSelectedTurno] = useState(null)
  const [formData, setFormData] = useState({
    usuario: '',
    dia: '',
    hora_inicio: null,
    hora_fin: null
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })

  const diasSemana = [
    { nombre: 'Lunes', valor: 1 },
    { nombre: 'Martes', valor: 2 },
    { nombre: 'Miércoles', valor: 3 },
    { nombre: 'Jueves', valor: 4 },
    { nombre: 'Viernes', valor: 5 }
  ]

  useEffect(() => {
    obtenerTurnos()
    obtenerUsuarios()
  }, [])

  const obtenerTurnos = () => {
    axios
      .get(`${API_URL}/api/turnos`, {
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
      .then((response) => setTurnos(response.data.turnos))
      .catch((error) => console.error('Error al obtener turnos:', error))
  }

  const obtenerUsuarios = () => {
    axios
      .get(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
      .then((response) => setUsuarios(response.data.usuarios))
      .catch((error) => console.error('Error al obtener usuarios:', error))
  }

  const handleOpenModal = (type, turno = null) => {
    setModalType(type)
    setSelectedTurno(turno)
    console.log(turno)
    console.log(selectedTurno)

    // Set form data for edit mode
    if (turno) {
      const usuarioEncontrado = usuarios.find(
        (usuario) =>
          usuario.nombre === turno.nombre && usuario.apellido === turno.apellido
      )
      setFormData({
        usuario: usuarioEncontrado ? usuarioEncontrado.id : '',
        dia: diasSemana.find((dia) => dia.nombre === turno.dia)?.valor || '',
        hora_inicio: turno.hora_inicio
          ? dayjs('0000-01-01T' + turno.hora_inicio)
          : null,
        hora_fin: turno.hora_fin ? dayjs('0000-01-01T' + turno.hora_fin) : null
      })
    } else {
      setFormData({
        usuario: '',
        dia: '',
        hora_inicio: null,
        hora_fin: null
      })
    }

    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedTurno(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTimeChange = (name) => (value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    const horaInicio = `${formData.hora_inicio.$H
      .toString()
      .padStart(2, '0')}:00:00`
    const horaFin = `${formData.hora_fin.$H.toString().padStart(2, '0')}:00:00`

    const body = {
      dia: formData.dia,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      usuario: formData.usuario
    }
    console.log(body)
    const request =
      modalType === 'edit'
        ? axios.put(`${API_URL}/api/turno/${selectedTurno.id}`, body, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
          })
        : axios.post(`${API_URL}/api/turno`, body, {
            headers: { Authorization: `Bearer ${localStorage.token}` }
          })

    request
      .then((response) => {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
        obtenerTurnos()
        handleCloseModal()
      })
      .catch((error) => {
        setSnackbar({ open: true, message: error.message, severity: 'error' })
      })
  }

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/api/turno/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Turno eliminado',
          severity: 'success'
        })
        obtenerTurnos()
      })
      .catch((error) => {
        setSnackbar({ open: true, message: error.message, severity: 'error' })
      })
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'left'
        }}
      >
        <Typography variant="h3" color="#fff" gutterBottom>
          Turnos
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleOpenModal('create')}
          sx={{
            borderRadius: '50%',
            minWidth: '50px',
            width: '50px',
            height: '50px',
            top: 10,
            padding: 0
          }}
        >
          <AddIcon />
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Día</TableCell>
              <TableCell>Hora Inicio</TableCell>
              <TableCell>Hora Fin</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno, index) => (
              <TableRow key={turno.id}>
                <TableCell>{++index}</TableCell>
                <TableCell>{turno.nombre}</TableCell>
                <TableCell>{turno.apellido}</TableCell>
                <TableCell>{turno.dia}</TableCell>
                <TableCell>{turno.hora_inicio}</TableCell>
                <TableCell>{turno.hora_fin}</TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal('edit', turno)}
                    sx={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      paddingRight: 1,
                      paddingLeft: 1
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(turno.id)}
                    sx={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      paddingRight: 1,
                      paddingLeft: 1
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
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
        open={openModal}
        onClose={handleCloseModal}
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
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography id="modal-title" variant="h6" color="black">
              {modalType === 'edit' ? 'Editar Turno' : 'Agregar Turno'}
            </Typography>
            <IconButton onClick={handleCloseModal}>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Usuario</InputLabel>
              <Select
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
              >
                {usuarios.map((usuario) => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Día</InputLabel>
              <Select
                name="dia"
                value={formData.dia}
                onChange={handleInputChange}
              >
                {diasSemana.map((dia) => (
                  <MenuItem key={dia.valor} value={dia.valor}>
                    {dia.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Hora Inicio"
                value={formData.hora_inicio}
                onChange={handleTimeChange('hora_inicio')}
                fullWidth
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Hora Fin"
                value={formData.hora_fin}
                onChange={handleTimeChange('hora_fin')}
                fullWidth
              />
            </LocalizationProvider>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="error" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {modalType === 'edit' ? 'Guardar Cambios' : 'Agregar Turno'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
