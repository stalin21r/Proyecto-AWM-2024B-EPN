import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  TextField,
  MenuItem,
  Box,
  Pagination,
  Stack,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import noImage from '../assets/noImage.png'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function LandingProducto() {
  const [productos, setProductos] = useState([])
  const [categoria, setCategoria] = useState(null)
  const [pattern, setPattern] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [page, setPage] = useState(1)
  const productosPorPagina = 10

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
      })
  }, [])

  // Cargar productos cuando cambia la categoría o el patrón
  useEffect(() => {
    cargarProductos()
  }, [categoria, pattern])

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
      })
  }

  const handleCategoryChange = (e) => {
    setCategoria(e.target.value)
  }

  const handleSearchPatternChange = (e) => {
    setPattern(e.target.value)
  }

  const handleSearch = () => {
    cargarProductos()
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const inicio = (page - 1) * productosPorPagina
  const fin = inicio + productosPorPagina
  const productosPaginados = productos.slice(inicio, fin)

  return (
    <div className="content" style={{ margin: '20px' }}>
      <Typography variant="h3" color="#fff" gutterBottom>
        Tienda
      </Typography>
      {/* Filtros de búsqueda */}
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
          sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}
          className="item-search-movil"
        >
          {/* Campo de categoría */}
          <TextField
            id="categoria"
            select
            label="Categoría"
            variant="outlined"
            value={categoria || ''}
            onChange={handleCategoryChange}
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
                    borderWidth: categoria ? 3 : 1
                  }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textShadow: '-1px -1px 2px #fff'
              },
              '& .MuiInputLabel-root:not(.Mui-focused)': {
                fontSize: categoria ? '1.5rem' : '1rem',
                fontWeight: categoria ? 'bold' : 'normal',
                textShadow: categoria ? '-1px -1px 2px #fff' : 'none'
              },
              width: '200px',
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
            value={pattern || ''}
            onChange={handleSearchPatternChange}
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
                    borderWidth: pattern ? 3 : 1
                  }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textShadow: '-1px -1px 2px #fff'
              },
              '& .MuiInputLabel-root:not(.Mui-focused)': {
                fontSize: pattern ? '1.5rem' : '1rem',
                fontWeight: pattern ? 'bold' : 'normal',
                textShadow: pattern ? '-1px -1px 2px #fff' : 'none'
              },
              width: '200px',
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
        </Box>
      </Box>

      {/* Lista de productos */}
      <div className="product-editor-container" style={{ maxHeight: '650px' }}>
        <div className="products-grid">
          {productosPaginados.map((producto) => (
            <div key={producto.id} className="product">
              <img
                src={producto.imagen ? producto.imagen : noImage}
                alt={producto.nombre}
              />
              <h3>{producto.nombre}</h3>
              <p>Costo: ${producto.precio}</p>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <Stack spacing={2} className="paginator">
          <Pagination
            count={Math.ceil(productos.length / productosPorPagina)}
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
      </div>
    </div>
  )
}
