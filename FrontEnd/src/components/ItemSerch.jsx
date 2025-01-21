import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  MenuItem,
  Box,
  IconButton,
  Modal,
  Typography,
  Divider,
  Button,
  Stack,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export function ItemSearch() {
  const categories = ["Snacks", "Comida", "Electrónica", "Juegos"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "", // Ensure this is an empty string by default
    image: null,
  });

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewProduct({
      name: "",
      price: "",
      category: "", // Reset category to an empty string
      image: null,
    });
  };

  const handleSaveProduct = () => {
    console.log("Producto Guardado:", newProduct);
    handleModalClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "flex-start",
        padding: 1,
      }}
    >
      <Box className="search-container">
        <TextField
          id="category"
          select
          label="Categoría"
          variant="outlined"
          color="success"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderWidth: 3,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "-1px -1px 2px #fff",
            },
            width: "15vw",
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
          value={newProduct.category} // Bind the category value to the state
          onChange={handleInputChange}
          name="category" // Set the correct name for input change
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          id="search"
          label="Búsqueda"
          variant="outlined"
          color="success"
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderWidth: 3,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "-1px -1px 2px #fff",
            },
            width: "15vw",
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" aria-label="buscar">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          aria-label="agregar"
          onClick={handleModalOpen}
          sx={{
            backgroundColor: "green",
            color: "white",
            "&:hover": { backgroundColor: "darkgreen" },
            borderRadius: "50%",
            width: "50px",
            height: "50px",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography id="modal-title" variant="h6" sx={{ color: "black" }}>
              Agregar Producto
            </Typography>
            <IconButton onClick={handleModalClose}>
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
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Costo"
              variant="outlined"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Categoría"
              variant="outlined"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              select
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
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
                  setNewProduct({
                    ...newProduct,
                    image: e.target.files[0],
                  });
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
              {newProduct.image
                ? newProduct.image.name
                : "Sin archivo seleccionado"}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
  );
}
