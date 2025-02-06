/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import noImage from '../assets/noImage.png'
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Modal,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function Productos({
  categorias,
  productos,
  totalPages,
  onActualizarProductos,
  setSnackbar
}) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [updatedProduct, setUpdatedProduct] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    imagen: null,
    imagenActual: '' // Nueva propiedad para la imagen actual
  })

  // Estado para controlar la visibilidad del Dialog de confirmación
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const productosPorPagina = 10
  const inicio = (page - 1) * productosPorPagina
  const fin = inicio + productosPorPagina
  const productosPaginados = productos.slice(inicio, fin)

  useEffect(() => {
    if (selectedProduct) {
      setUpdatedProduct({
        nombre: selectedProduct.nombre,
        precio: selectedProduct.precio,
        categoria: selectedProduct.categoria,
        imagen: null, // Puedes configurar la imagen aquí si es necesario
        imagenActual: selectedProduct.imagen // Guardar la imagen actual del producto
      })
    }
  }, [selectedProduct])

  const openModal = (producto) => {
    setSelectedProduct(producto)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleInputChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUpdatedProduct({
        ...updatedProduct,
        imagen: file // Guardar el archivo seleccionado
      })
    }
  }

  const handleSaveUpdatedProduct = () => {
    if (
      !updatedProduct.nombre ||
      !updatedProduct.precio ||
      !updatedProduct.categoria
    ) {
      setSnackbar({
        open: true,
        message: 'Todos los campos son obligatorios.',
        severity: 'error'
      })
      return
    }

    const formData = new FormData()
    formData.append('nombre', updatedProduct.nombre)
    formData.append('precio', updatedProduct.precio)
    formData.append('categoria', updatedProduct.categoria)
    if (updatedProduct.imagen) {
      formData.append('imagen', updatedProduct.imagen)
    }

    axios
      .put(`${API_URL}/api/producto/${selectedProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((res) => {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: 'success'
        })
        onActualizarProductos()
        closeModal()
      })
      .catch((error) => {
        console.error('Error al actualizar el producto:', error)
        setSnackbar({
          open: true,
          message: error.data.message,
          severity: 'error'
        })
      })
  }

  const handleDeleteProduct = () => {
    axios
      .delete(`${API_URL}/api/producto/${selectedProduct.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
      .then((res) => {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: 'success'
        })
        onActualizarProductos()
        closeModal()
        setOpenConfirmDialog(false) // Cerrar el diálogo de confirmación
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error)
        setSnackbar({
          open: true,
          message: error.data.message,
          severity: 'error'
        })
      })
  }

  const handleCancelDelete = () => {
    setOpenConfirmDialog(false) // Cerrar el diálogo de confirmación si el usuario cancela
  }

  return (
    <div className="product-editor-container">
      <div className="products-grid">
        {productosPaginados.map((producto) => (
          <button
            key={producto.id}
            className="product"
            data-nombre={producto.nombre}
            data-precio={producto.precio}
            data-imagen={producto.imagen}
            onClick={() => openModal(producto)}
          >
            <img
              src={producto.imagen ? producto.imagen : noImage}
              alt={producto.nombre}
            />
            <h3>{producto.nombre}</h3>
            <p>Costo: ${producto.precio}</p>
          </button>
        ))}
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

      {/* Modal para editar producto */}
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
            width: 500,
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
            <Typography id="modal-title" variant="h6" sx={{ color: 'black' }}>
              Editar Producto
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
              label="Nombre del Producto"
              variant="outlined"
              name="nombre"
              value={updatedProduct.nombre}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Costo"
              variant="outlined"
              name="precio"
              value={updatedProduct.precio}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Categoría"
              variant="outlined"
              name="categoria"
              value={updatedProduct.categoria}
              onChange={handleInputChange}
              select
              fullWidth
            >
              {categorias.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoria}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Seleccionar archivo
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: 'gray'
              }}
            >
              {updatedProduct.imagen
                ? updatedProduct.imagen.name
                : 'Sin archivo seleccionado'}
            </Typography>

            {/* Mostrar la imagen actual del producto */}
            {updatedProduct.imagenActual && !updatedProduct.imagen && (
              <Box
                component="img"
                src={updatedProduct.imagenActual}
                alt="Imagen Actual"
                sx={{
                  maxWidth: '150px',
                  alignSelf: 'center'
                }}
              />
            )}

            {/* Mostrar la nueva imagen seleccionada */}
            {updatedProduct.imagen && (
              <Box
                component="img"
                src={URL.createObjectURL(updatedProduct.imagen)}
                alt="Vista previa"
                sx={{
                  maxWidth: '150px',
                  alignSelf: 'center'
                }}
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" color="error" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenConfirmDialog(true)} // Abre el dialog de confirmación
              sx={{ marginLeft: 2 }}
            >
              Eliminar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveUpdatedProduct}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este producto?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteProduct} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
