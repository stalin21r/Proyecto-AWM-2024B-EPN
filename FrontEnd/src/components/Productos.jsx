import React, { useState } from "react";
import panchitos from "../assets/panchitos.png";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Modal, Box, Typography, Button, TextField, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function Productos() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = {
    id: 1,
    name: "Panchitos",
    price: "0.50",
    image: panchitos,
  };

  const products = () => {
    let result = [];
    for (let i = 1; i <= 10; i++) {
      result.push(
        <button
          key={i}
          className="product"
          data-name={product.name}
          data-price={product.price}
          data-image={product.image}
          onClick={() => openModal(product)}
        >
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Costo: ${product.price}</p>
        </button>
      );
    }
    return result;
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="product-editor-container">
      <div className="products-grid">{products()}</div>

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
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography id="modal-title" variant="h6" sx={{color: "black"}}>
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
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Nombre del Producto"
              variant="outlined"
              value={selectedProduct?.name || ""}
              fullWidth
            />
            <TextField
              label="Costo"
              variant="outlined"
              value={selectedProduct?.price || ""}
              fullWidth
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ justifyContent: "flex-start" }}
            >
              Seleccionar archivo
              <input
                type="file"
                hidden
                onChange={(e) => {
                  console.log(e.target.files[0]);
                }}
              />
            </Button>
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "gray",
              }}
            >
              Sin archivos seleccionados
            </Typography>
            <img
              src={selectedProduct?.image || ""}
              alt="Producto"
              style={{ maxWidth: "150px", alignSelf: "center", marginTop: "10px" }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                console.log("Eliminar producto");
              }}
            >
              Eliminar
            </Button>
            <Button variant="contained" color="primary" onClick={closeModal}>
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
