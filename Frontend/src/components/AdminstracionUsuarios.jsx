/* eslint-disable react-hooks/exhaustive-deps */
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
  Modal,
  TextField,
  Typography,
  Box,
  IconButton,
  Divider,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function AdminstracionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: ''
  })
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    usuario: '',
    contrasena: '',
    rol: false
  })

  const token = localStorage.getItem('token')

  const obtenerUsuarios = () => {
    axios
      .get(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => setUsuarios(response.data.usuarios))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const handleOpenModal = (type, user = null) => {
    setModalType(type)
    setSelectedUser(user)
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        usuario: user.usuario,
        rol: user.rol === 'administrador'
      })
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        usuario: '',
        contrasena: '',
        rol: false
      })
    }
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedUser(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSaveUser = () => {
    if (modalType === 'edit') {
      axios
        .put(`${API_URL}/api/usuario/${selectedUser.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setSnackbar({
            open: true,
            message: response.data.message,
            severity: 'success'
          })
          obtenerUsuarios()
          handleCloseModal()
        })
        .catch((error) => {
          console.error(error)
          setSnackbar({
            open: true,
            message: error.data.message,
            severity: 'error'
          })
        })
    } else {
      axios
        .post(`${API_URL}/api/usuario`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setSnackbar({
            open: true,
            message: response.data.message,
            severity: 'success'
          })
          obtenerUsuarios()
          handleCloseModal()
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
  }

  const handleDeleteUser = (id) => {
    axios
      .delete(`${API_URL}/api/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success'
        })
        setUsuarios(usuarios.filter((user) => user.id !== id))
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
          Usuarios
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
          <AddIcon sx={{ padding: 0 }} />
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{++index}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.apellido}</TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>{user.usuario}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenModal('edit', user)}
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
                    onClick={() => handleDeleteUser(user.id)}
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
              {modalType === 'edit' ? 'Editar Usuario' : 'Crear Usuario'}
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
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              error={!formData.nombre}
              helperText={!formData.nombre ? 'Este campo es obligatorio' : ''}
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              required
              error={!formData.apellido}
              helperText={!formData.apellido ? 'Este campo es obligatorio' : ''}
            />
            <TextField
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              required
              error={!formData.correo}
              helperText={!formData.correo ? 'Este campo es obligatorio' : ''}
            />
            <TextField
              label="Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              required
              error={!formData.usuario}
              helperText={!formData.usuario ? 'Este campo es obligatorio' : ''}
            />
            {modalType === 'create' && (
              <TextField
                label="Contraseña"
                name="contrasena"
                type="password"
                value={formData.contrasena}
                onChange={handleInputChange}
                required
                error={!formData.contrasena}
                helperText={
                  !formData.contrasena ? 'Este campo es obligatorio' : ''
                }
              />
            )}
            <TextField
              select
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              required
              error={formData.rol === ''}
              helperText={
                formData.rol === '' ? 'Este campo es obligatorio' : ''
              }
            >
              <MenuItem value={false}>Normal</MenuItem>
              <MenuItem value={true}>Administrador</MenuItem>
            </TextField>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="error" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveUser}
            >
              {modalType === 'edit' ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
