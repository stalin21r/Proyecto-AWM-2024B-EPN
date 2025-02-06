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
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function AdministrarBloquesCasilleros() {
  const [casilleros, setCasilleros] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBloque, setSelectedBloque] = useState({})
  const [dialogType, setDialogType] = useState({
    type: '',
    message: '',
    title: ''
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })
  const loggedUser = JSON.parse(
    atob(localStorage.getItem('token').split('.')[1])
  )
  useEffect(() => {
    obtenerCasilleros()
  }, [])
  const obtenerCasilleros = () => {
    axios
      .get(`${API_URL}/api/casilleros-ocupancia`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        setCasilleros(response.data.bloques)
      })
      .catch((error) => {
        setCasilleros([])
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error'
        })
      })
  }
  const handleCancelDialog = () => {
    setOpenDialog(false)
  }
  const handleOpenDialog = (tipo, bloque) => {
    if (bloque) {
      setSelectedBloque(bloque)
    }
    setDialogType({
      type: tipo,
      message: '¿En que modo desea crear el bloque?',
      title: 'Crear bloque'
    })
    setOpenDialog(true)
  }
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }
  const handleCreateBloque = (modo) => {
    axios
      .post(
        `${API_URL}/api/casillero`,
        { modo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        }
      )
      .then((response) => {
        obtenerCasilleros()
        setOpenDialog(false)
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        console.error(error)
        setSnackbar({
          open: true,
          message: error.data.message,
          severity: 'error'
        })
      })
  }
  const handleCleanBloque = () => {
    axios
      .put(
        `${API_URL}/api/clean-bloque/${selectedBloque.bloque}`,
        { registrado_por: loggedUser.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        }
      )
      .then((response) => {
        obtenerCasilleros()
        setOpenDialog(false)
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        console.log(error)
        setOpenDialog(false)
        setSnackbar({
          open: true,
          message: error.data.message,
          severity: 'error'
        })
      })
  }
  const handleDeleteBloque = () => {
    axios
      .delete(`${API_URL}/api/casillero-bloque/${selectedBloque.bloque}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((response) => {
        obtenerCasilleros()
        setOpenDialog(false)
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
      })
      .catch((error) => {
        console.log(error)
        setOpenDialog(false)
        setSnackbar({
          open: true,
          message: error.data.message,
          severity: 'error'
        })
      })
  }
  const dialogActionsRender = () => {
    if (dialogType.type === 'crear') {
      return (
        <>
          <Button onClick={() => handleCreateBloque(true)} color="primary">
            Horizontal
          </Button>
          <Button onClick={() => handleCreateBloque(false)} color="secondary">
            Vertical
          </Button>
        </>
      )
    } else if (dialogType.type == 'limpiar') {
      return (
        <Button onClick={handleCleanBloque} color="primary">
          Limpiar
        </Button>
      )
    } else if (dialogType.type == 'eliminar') {
      return (
        <Button onClick={handleDeleteBloque} color="primary">
          Eliminar
        </Button>
      )
    }
    return null
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
          Bloques y Ocupación
        </Typography>
        <IconButton
          aria-label="agregar"
          onClick={() => handleOpenDialog('crear')}
          sx={{
            backgroundColor: 'green',
            color: 'white',
            '&:hover': { backgroundColor: 'darkgreen' },
            borderRadius: '50%',
            width: '50px',
            height: '50px'
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Bloque</TableCell>
              <TableCell>Casilleros</TableCell>
              <TableCell>Ocupados</TableCell>
              <TableCell>Libres</TableCell>
              <TableCell>% Ocupación</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {casilleros.map((bloque, index) => (
              <TableRow key={bloque.bloque}>
                <TableCell>{++index}</TableCell>
                <TableCell>{bloque.bloque}</TableCell>
                <TableCell>{bloque.casilleros}</TableCell>
                <TableCell>{bloque.ocupados}</TableCell>
                <TableCell>{bloque.libres}</TableCell>
                <TableCell>{bloque.ocupacion}</TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog('limpiar', bloque)}
                    sx={{
                      fontSize: 10,
                      fontWeight: 'bold',
                      paddingRight: 1,
                      paddingLeft: 1
                    }}
                  >
                    <CleaningServicesIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDialog('eliminar', bloque)}
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
      <Dialog open={openDialog} onClose={handleCancelDialog}>
        <DialogTitle>{dialogType.title}</DialogTitle>
        <DialogContent>
          <Typography>{dialogType.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialog} color="error">
            Cancelar
          </Button>
          {dialogActionsRender()}
        </DialogActions>
      </Dialog>
    </div>
  )
}
