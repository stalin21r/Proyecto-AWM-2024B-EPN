import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import noImage from '../assets/noImage.png';
import {
  TextField,
  MenuItem,
  Box,
  IconButton,
  Modal,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

export function Productos({ categorias, productos, totalPages, onActualizarProductos }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [updatedProduct, setUpdatedProduct] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    imagen: null,
    imagenActual: '', // Nueva propiedad para la imagen actual
  });

  useEffect(() => {
    if (selectedProduct) {
      setUpdatedProduct({
        nombre: selectedProduct.nombre,
        precio: selectedProduct.precio,
        categoria: selectedProduct.categoria,
        imagen: null, // Puedes configurar la imagen aquí si es necesario
        imagenActual: selectedProduct.imagen, // Guardar la imagen actual del producto
      });
    }
  }, [selectedProduct]);

  const openModal = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleInputChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedProduct({
        ...updatedProduct,
        imagen: file, // Guardar el archivo seleccionado
      });
    }
  };

  const handleSaveUpdatedProduct = () => {
    if (!updatedProduct.nombre || !updatedProduct.precio || !updatedProduct.categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", updatedProduct.nombre);
    formData.append("precio", updatedProduct.precio);
    formData.append("categoria", updatedProduct.categoria);
    if (updatedProduct.imagen) {
      formData.append("imagen", updatedProduct.imagen);
    }

    axios
      .put(`http://localhost:3000/api/producto/${selectedProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then(() => {
        alert("Producto actualizado correctamente.");
        onActualizarProductos();
        closeModal();
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
        alert("No se pudo actualizar el producto. Intente más tarde.");
      });
  };

  const handleDeleteProduct = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      axios
        .delete(`http://localhost:3000/api/producto/${selectedProduct.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then(() => {
          alert("Producto eliminado correctamente.");
          onActualizarProductos();
          closeModal();
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          alert("No se pudo eliminar el producto. Intente más tarde.");
        });
    }
  };

  return (
    <div className="product-editor-container">
      <div className="products-grid">
        {productos.map((producto) => (
          <button
            key={producto.id}
            className="product"
            data-nombre={producto.nombre}
            data-precio={producto.precio}
            data-imagen={producto.imagen}
            onClick={() => openModal(producto)}
          >
            <img src={producto.imagen ? producto.imagen : noImage} alt={producto.nombre} />
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
              color: 'white',
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
              gap: 2,
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
              <input
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: 'gray',
              }}
            >
              {updatedProduct.imagen ? updatedProduct.imagen.name : 'Sin archivo seleccionado'}
            </Typography>

            {/* Mostrar la imagen actual del producto */}
            {updatedProduct.imagenActual && !updatedProduct.imagen && (
              <Box
                component="img"
                src={updatedProduct.imagenActual}
                alt="Imagen Actual"
                sx={{
                  maxWidth: '150px',
                  alignSelf: 'center',                  
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
                  alignSelf: 'center',                  
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
              onClick={handleDeleteProduct}
              sx={{ marginLeft: 2 }}
            >
              Eliminar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveUpdatedProduct}>
              Guardar
            </Button>
            
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
