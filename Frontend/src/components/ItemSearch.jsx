/* eslint-disable react/prop-types */
import { useState } from 'react'
import {
  TextField,
  InputAdornment,
  MenuItem,
  Box,
  IconButton,
  Modal,
  Typography,
  Divider,
  Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function ItemSearch({
  categorias,
  setCategoria,
  setPattern,
  onActualizarProductos,
  setSnackbar
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    imagen: null,
    preview: null
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchPattern, setSearchPattern] = useState('')

  const handleModalOpen = () => setIsModalOpen(true)

  const handleModalClose = () => {
    setIsModalOpen(false)
    setNewProduct({
      nombre: '',
      precio: '',
      categoria: '',
      imagen: null,
      preview: null
    })
  }

  const handleSaveProduct = () => {
    if (!newProduct.nombre || !newProduct.precio || !newProduct.categoria) {
      setSnackbar({
        open: true,
        message: 'Todos los campos son obligatorios.',
        severity: 'warning'
      })
      return
    }
    const formData = new FormData()
    formData.append('nombre', newProduct.nombre)
    formData.append('precio', newProduct.precio)
    formData.append('categoria', newProduct.categoria)
    if (newProduct.imagen) {
      formData.append('imagen', newProduct.imagen)
    }
    axios
      .post(`${API_URL}/api/producto`, formData, {
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
      })
      .catch((error) => {
        console.error('Error al guardar el producto:', error)
        setSnackbar({
          open: true,
          message: 'No se pudo guardar el producto. Intente más tarde.',
          severity: 'error'
        })
      })

    handleModalClose()
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setSelectedCategory(value)
    setCategoria(value)
    setPattern(searchPattern)
  }

  const handleSearchPatternChange = (e) => {
    setSearchPattern(e.target.value)
  }

  const handleSearch = () => {
    setPattern(searchPattern)
  }

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewProduct({
        ...newProduct,
        imagen: file,
        preview: URL.createObjectURL(file) // Genera la vista previa
      })
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'flex-start',
        padding: 1
      }}
    >
      <Box
        className="search-container"
        sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}
      >
        {/* Campo de categoría */}
        <TextField
          id="categoria"
          select
          label="Categoría"
          variant="outlined"
          value={selectedCategory}
          onChange={handleCategoryChange}
          name="categoria"
          color="success"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderWidth: 3
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline, &.MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                {
                  borderWidth: 3
                },
              '&.MuiInputBase-root:not(.Mui-focused) .MuiOutlinedInput-notchedOutline':
                {
                  borderWidth: selectedCategory ? 3 : 1
                }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textShadow: '-1px -1px 2px #fff'
            },
            '& .MuiInputLabel-root:not(.Mui-focused)': {
              fontSize: selectedCategory ? '1.5rem' : '1rem',
              fontWeight: selectedCategory ? 'bold' : 'normal',
              textShadow: selectedCategory ? '-1px -1px 2px #fff' : 'none'
            },
            width: '15vw',
            backgroundColor: '#fff',
            borderRadius: 1
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.categoria}
            </MenuItem>
          ))}
        </TextField>

        {/* Campo de búsqueda */}
        <TextField
          id="search"
          label="Búsqueda"
          variant="outlined"
          color="success"
          fullWidth
          value={searchPattern}
          onChange={handleSearchPatternChange}
          name="searchPattern"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderWidth: 3
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline, &.MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                {
                  borderWidth: 3
                },
              '&.MuiInputBase-root:not(.Mui-focused) .MuiOutlinedInput-notchedOutline':
                {
                  borderWidth: searchPattern ? 3 : 1
                }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textShadow: '-1px -1px 2px #fff'
            },
            '& .MuiInputLabel-root:not(.Mui-focused)': {
              fontSize: searchPattern ? '1.5rem' : '1rem',
              fontWeight: searchPattern ? 'bold' : 'normal',
              textShadow: searchPattern ? '-1px -1px 2px #fff' : 'none'
            },
            width: '15vw',
            backgroundColor: '#fff',
            borderRadius: 1
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label="buscar"
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Botón de agregar */}
        <IconButton
          aria-label="agregar"
          onClick={handleModalOpen}
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

      {/* Modal para agregar producto */}
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
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
              Agregar Producto
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            id="modal-description"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Nombre del Producto"
              variant="outlined"
              name="nombre"
              value={newProduct.nombre}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Costo"
              variant="outlined"
              name="precio"
              value={newProduct.precio}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Categoría"
              variant="outlined"
              name="categoria"
              value={newProduct.categoria}
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
              <input
                type="file"
                accept=".jpeg,.png,.webp,.jpg"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Typography
              variant="body2"
              sx={{ fontStyle: 'italic', color: 'gray' }}
            >
              {newProduct.imagen
                ? newProduct.imagen.name
                : 'Sin archivo seleccionado'}
            </Typography>
            {newProduct.preview && (
              <Box
                component="img"
                src={newProduct.preview}
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
            <Button variant="outlined" color="error" onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveProduct}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}
