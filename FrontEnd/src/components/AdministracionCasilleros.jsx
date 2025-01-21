import React, { useState } from "react";
import { Casillero } from "./Casillero";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function AdministracionCasilleros() {
  const [selectedCasillero, setSelectedCasillero] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });

  const casilleros = [
    {
      letra: "A",
      numero: "1",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "2",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "3",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "4",
      nombre: "Stalin García",
      correo: "rony.garcia01@epn.edu.ec",
      telefono: "0987654321",
      isArrended: true,
    },
    {
      letra: "A",
      numero: "5",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "6",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "7",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "8",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "9",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "10",
      nombre: "Patricio Flor",
      correo: "patricio.flor@epn.edu.ec",
      telefono: "0987654321",
      isArrended: true,
    },
    {
      letra: "A",
      numero: "11",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "12",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "13",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "14",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "15",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "16",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "17",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "18",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "19",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
    {
      letra: "A",
      numero: "20",
      nombre: "",
      correo: "",
      telefono: "",
      isArrended: false,
    },
  ];

  const openModal = (casillero) => {
    setSelectedCasillero(casillero);
    setFormData({
      nombre: casillero.nombre || "",
      correo: casillero.correo || "",
      telefono: casillero.telefono || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCasillero(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Lógica para guardar los datos
    console.log("Guardar datos", formData);
    closeModal();
  };

  const handleDelete = () => {
    // Lógica para eliminar el casillero
    console.log("Eliminar casillero", selectedCasillero);
    closeModal();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="casilleros-container">
        <header className="letra-bloque">
          <h1>A</h1>
        </header>
        <section className="bloque-casillero-container">
          <div className="bloque-casillero">
            {casilleros.map((casillero) => (
              <Casillero
                key={casillero.numero}
                numero={casillero.numero}
                isArrended={casillero.isArrended}
                onClick={() => openModal(casillero)}
              />
            ))}
          </div>
        </section>
      </div>
      <Stack spacing={2} className="paginator">
        <Pagination
          count={10}
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
            },
          }}
        />
      </Stack>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-title" variant="h6" color={selectedCasillero?.isArrended ? "primary" : "success"}>
              {selectedCasillero?.isArrended
                ? "Información del Casillero"
                : "Casillero Disponible"}
            </Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            id="modal-description"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Número"
              value={selectedCasillero?.numero}
              disabled
            />
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
            />
            <TextField
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
            />
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {selectedCasillero?.isArrended && (
              <Button variant="contained" color="error" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleSave}>
              {selectedCasillero?.isArrended ? "Actualizar" : "Guardar"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeModal}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
