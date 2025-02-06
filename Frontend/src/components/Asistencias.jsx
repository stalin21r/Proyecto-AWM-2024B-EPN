import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Snackbar,
  Alert
} from '@mui/material'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function Asistencias() {
  //estados
  const [asistencias, setAsistencias] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })
  //useEffect obtener asistencias
  useEffect(() => {
    obtenerAsistencias()
  }, [])
  //Funciones
  //Función obtener asistencias
  const obtenerAsistencias = () => {
    const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
    console.log(user)
    axios
      .get(`${API_URL}/api/asistencias?usuario=${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setAsistencias(response.data.asistencias)
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
  //Función cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }
  //Render
  return (
    <div style={{ width: '80%' }}>
      {/* Titulo */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'left'
        }}
      >
        <Typography variant="h3" color="#fff" gutterBottom>
          Mis Asistencias
        </Typography>
      </Box>
      <Box>
        {/* Tabla */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Día</TableCell>
                <TableCell>Hora Inicio</TableCell>
                <TableCell>Hora Fin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asistencias.map((asistencia, index) => (
                <TableRow key={asistencia.id}>
                  <TableCell>{++index}</TableCell>
                  <TableCell>{`${asistencia.nombre} ${asistencia.apellido}`}</TableCell>
                  <TableCell>{asistencia.dia}</TableCell>
                  <TableCell>{asistencia.hora_llegada}</TableCell>
                  <TableCell>{asistencia.hora_salida}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
    </div>
  )
}

/*
            "id": 1,
            "nombre": "Stalin",
            "apellido": "García",
            "dia": "2025-01-27",
            "hora_llegada": "11:05:00",
            "hora_salida": "13:06:00"
*/
