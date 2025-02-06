/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { Typography, Box } from '@mui/material'
import casillero from '../assets/locker.png'
import logo from '../assets/aeie-logo.png'
const API_URL = 'http://localhost:3000'
//const API_URL = 'https://95dcnbjt-3000.use2.devtunnels.ms'

export function LandingCasillero() {
  const [letras, setLetras] = useState([])
  const [casilleros, setCasilleros] = useState([])
  const [selectedLetra, setSelectedLetra] = useState('A')
  const [page, setPage] = useState(1) // Página actual
  const [totalPages, setTotalPages] = useState(1) // Total de páginas

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

  const handlePageChange = (event, value) => {
    setPage(value)
    setSelectedLetra(letras[value - 1])
  }

  function Casillero({ numero, isArrended }) {
    const className = `casillero ${isArrended ? 'red' : 'green'}`
    return (
      <div className={className}>
        <img src={casillero} alt="casillero" />
        <span>{numero}</span>
      </div>
    )
  }

  return (
    <div className="content" style={{ margin: '20px' }}>
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
          <header className="letra-bloque letra-bloque-landing">
            <h1>{selectedLetra}</h1>
            <img className="logo" src={logo} alt="aeie" />
          </header>
          <section className="bloque-casillero-container">
            <div className="bloque-casillero">
              {casilleros.map((casillero) => (
                <Casillero
                  key={casillero.id}
                  numero={casillero.numero}
                  isArrended={casillero.ocupado}
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
      </div>
    </div>
  )
}
