import React, { useState } from 'react';
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
  TextField,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const miembros = [
  {
    nombre: 'Stalin',
    turnos: [
      { dia: 'lunes', hora: '07:00 AM' },
      { dia: 'miercoles', hora: '09:00 AM' }
    ]
  },
  {
    nombre: 'María',
    turnos: [
      { dia: 'martes', hora: '08:00 AM' },
      { dia: 'jueves', hora: '10:00 AM' }
    ]
  },
];

const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const horas = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'];

export function AdministracionHorario() {
  const [isOpen, setOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState({});
  const [horaLlegada, setHoraLlegada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');

  const handleOpen = (dia, hora, persona) => {
    setSelectedTurno({ dia, hora, persona });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleRegistrarAsistencia = () => {
    console.log('Asistencia registrada', { ...selectedTurno, horaLlegada, horaSalida });
    handleClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'horaLlegada') {
      setHoraLlegada(value);
    } else {
      setHoraSalida(value);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className="table-horario">
          <TableHead sx={{ '& th': { padding: "5px 20px" } }}>
            <TableRow>
              <TableCell>Hora</TableCell>
              {diasSemana.map((dia) => (
                <TableCell key={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {horas.map((hora) => (
              <TableRow key={hora} sx={{ '& td': { padding: "0px 20px" } }}>
                <TableCell>{hora}</TableCell>
                {diasSemana.map((dia) => (
                  <TableCell key={dia}>
                    {miembros.map((miembro) => (
                      miembro.turnos.some(
                        (turno) => turno.dia === dia && turno.hora === hora
                      ) && (
                        <Button
                          key={miembro.nombre}
                          onClick={() => handleOpen(dia, hora, miembro.nombre)}
                        >
                          {miembro.nombre}
                        </Button>
                      )
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            borderRadius: 2,
          }}
        >
          {/* Botón de cierre (X) */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography id="modal-title" variant="h6" color='primary' >
              Asistencia
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            id="modal-description"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
              {selectedTurno.persona}, {selectedTurno.dia} {selectedTurno.hora}
            </Typography>
            <TextField
              label="Hora de Llegada"
              variant="outlined"
              type="time"
              name="horaLlegada"
              value={horaLlegada}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Hora de Salida"
              variant="outlined"
              type="time"
              name="horaSalida"
              value={horaSalida}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
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
  );
}
