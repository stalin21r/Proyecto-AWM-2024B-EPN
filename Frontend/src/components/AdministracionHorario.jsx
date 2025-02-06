import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  Divider,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

// Función para convertir hora en formato de 12 horas a 24 horas
const convertirHora24 = (hora12) => {
  const [hora, minuto, periodo] = hora12.split(/[:\s]/)
  let hora24 = parseInt(hora)
  if (periodo === 'PM' && hora24 < 12) {
    hora24 += 12
  } else if (periodo === 'AM' && hora24 === 12) {
    hora24 = 0
  }
  return `${hora24.toString().padStart(2, '0')}:${minuto}:00`
}
const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']
const horas = [
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM'
]

export function AdministracionHorario() {
  const navigate = useNavigate()
  const [turnos, setTurnos] = useState([]) // Estado para almacenar los turnos
  const [isOpen, setOpen] = useState(false)
  const [selectedTurno, setSelectedTurno] = useState({})
  const [horaLlegada, setHoraLlegada] = useState('')
  const [horaSalida, setHoraSalida] = useState('')
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const [loggedUser, setLoggedUser] = useState({})

  useEffect(() => {
    const u = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
    setLoggedUser(u)
  }, [])
  // Efecto para obtener los turnos de la API cuando el componente se monta
  useEffect(() => {
    axios
      .get(`${API_URL}/api/turnos`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        setTurnos(response.data.turnos)
      })
      .catch((error) => {
        console.error('Error al obtener los turnos:', error)
        setSnackbar({
          open: true,
          message: 'No se pudo cargar los turnos. Intente más tarde.',
          severity: 'error'
        })
      })
  }, []) // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  const handleOpen = (turno) => {
    setSelectedTurno(turno)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  const handleRegistrarAsistencia = () => {
    if (!horaLlegada || !horaSalida) {
      setSnackbar({
        open: true,
        message: 'Debe ingresar la hora de llegada y salida',
        severity: 'error'
      })
      setHoraLlegada('')
      setHoraSalida('')
      return
    }

    const userId = JSON.parse(
      atob(localStorage.getItem('token').split('.')[1])
    ).id
    const asistencia = {
      usuario: userId,
      dia: new Date()
        .toLocaleString('sv-SE', { timeZone: 'America/Guayaquil' })
        .split(' ')[0],
      hora_llegada: horaLlegada,
      hora_salida: horaSalida
    }

    const asistenciaDia =
      diasSemana[new Date(asistencia.dia).getDay()].toLowerCase()

    if (asistenciaDia !== selectedTurno.dia.toLowerCase()) {
      console.error('El día de la asistencia no coincide con el día del turno')
      setSnackbar({
        open: true,
        message: 'El día de la asistencia no coincide con el día del turno',
        severity: 'error'
      })
      setHoraLlegada('')
      setHoraSalida('')
      return
    }

    axios
      .post(`${API_URL}/api/asistencia`, asistencia, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        console.log(response.data.message)
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        console.error('Error al registrar la asistencia:', error)
        setSnackbar({
          open: true,
          message: 'No se pudo registrar la asistencia. Intente más tarde.',
          severity: 'error'
        })
      })
    setHoraLlegada('')
    setHoraSalida('')
    handleClose()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'horaLlegada') {
      setHoraLlegada(value)
    } else if (name === 'horaSalida') {
      setHoraSalida(value)
    }
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'left',
          gap: 8
        }}
      >
        <Typography variant="h3" color="#fff" gutterBottom>
          Turnos y Asistencia
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate('/administracion/turnos-y-asistencia/mis-asistencias')
          }
          sx={{ height: 30, position: 'relative', top: 10, lineHeight: 1 }}
        >
          Mis Asistencias
        </Button>
        {loggedUser.rol && (
          <IconButton
            onClick={() =>
              navigate('/administracion/turnos-y-asistencia/administrar')
            }
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
      <TableContainer component={Paper}>
        <Table className="table-horario">
          <TableHead sx={{ '& th': { padding: '5px 20px' } }}>
            <TableRow>
              <TableCell>Hora</TableCell>
              {diasSemana.map((dia) => (
                <TableCell key={dia}>
                  {dia.charAt(0).toUpperCase() + dia.slice(1)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {horas.map((hora12) => {
              const hora24 = convertirHora24(hora12) // Convertir la hora al formato de 24 horas
              return (
                <TableRow key={hora12} sx={{ '& td': { padding: '0px 20px' } }}>
                  <TableCell>{hora12}</TableCell>
                  {diasSemana.map((dia) => (
                    <TableCell key={dia}>
                      {turnos
                        .filter(
                          (turno) =>
                            turno.dia.toLowerCase() === dia &&
                            turno.hora_inicio === hora24
                        )
                        .map((turno) => (
                          <Button
                            key={turno.id}
                            onClick={() => handleOpen(turno)}
                          >
                            {turno.nombre} {turno.apellido}
                          </Button>
                        ))}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

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

      {/* Modal para registrar asistencia */}
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2
          }}
        >
          {/* Botón de cierre (X) */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography id="modal-title" variant="h6" color="primary">
              Asistencia
            </Typography>
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
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', color: 'black' }}
            >
              {selectedTurno.nombre} {selectedTurno.apellido},{' '}
              {selectedTurno.dia} {selectedTurno.hora_inicio}
            </Typography>
            <div className="form-container">
              <label htmlFor="horaLlegada">Hora de Llegada</label>
              <input
                id="horaLlegada"
                type="time"
                name="horaLlegada"
                value={horaLlegada}
                onChange={handleInputChange}
                className="input-field"
              />

              <label htmlFor="horaSalida">Hora de Salida</label>
              <input
                id="horaSalida"
                type="time"
                name="horaSalida"
                value={horaSalida}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegistrarAsistencia}
            >
              Registrar Asistencia
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
