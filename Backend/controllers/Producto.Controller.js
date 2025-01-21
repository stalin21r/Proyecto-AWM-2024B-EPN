const sharp = require('sharp');
const Producto = require('../models/Producto.Model');

// Crear Producto
exports.createProducto = async (req, res) => {
  const { nombre, precio, categoria } = req.body;
  const imagen = req.file;

  try {
    let imagenBuffer = null;  // Inicializamos la imagen como null
    let imagenFlag = false;   // Flag para saber si hay imagen

    // Si se envía una imagen, la procesamos
    if (imagen) {
      const formatosPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/jpg'
      ];

      if (!formatosPermitidos.includes(imagen.mimetype)) {
        return res
          .status(400)
          .json({ message: 'Formato de imagen no permitido.' });
      }

      // Procesar y comprimir la imagen
      imagenBuffer = await sharp(imagen.buffer)
        .resize(200, 200, { fit: 'contain' })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();

      imagenFlag = true;  // Cambiamos el flag si hay imagen
    }

    // Crear el producto en la base de datos
    const producto = await Producto.create({
      nombre,
      precio,
      categoria,
      imagen: imagenBuffer ? Buffer.from(imagenBuffer) : null
    });

    // Modificamos la respuesta para devolver true o false
    res.status(201).json({
      message: 'Producto registrado correctamente.',
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        imagen: imagenFlag
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el producto.',
      error: error.message
    });
  }
};


// Obtener todos los Productos
exports.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();

    if (!productos.length) {
      return res.status(404).json({ message: 'No hay productos disponibles.' });
    }

    const productosConImagenes = productos.map((producto) => {
      let imagenDescomprimida = null;
      if (producto.imagen) {
        imagenDescomprimida = `data:image/webp;base64,${producto.imagen.toString('base64')}`;
      }

      return {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        imagen: imagenDescomprimida
      };
    });

    res.status(200).json(productosConImagenes);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener los productos.', 
      error: error.message 
    });
  }
};

// Obtener Producto por ID
exports.getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    let imagenDescomprimida = null;
    if (producto.imagen) {
      imagenDescomprimida = `data:image/webp;base64,${producto.imagen.toString('base64')}`;
    }

    res.status(200).json({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      imagen: imagenDescomprimida
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener el producto.', 
      error: error.message 
    });
  }
};

// Actualizar Producto por ID
exports.updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria } = req.body;
  const imagen = req.file;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    let imagenBase64 = producto.imagen;

    if (imagen) {
      const imagenComprimida = await sharp(imagen.buffer)
        .resize(300, 300, { fit: 'contain' })
        .toFormat('webp')
        .webp({ quality: 80 })
        .toBuffer();

      imagenBase64 = Buffer.from(imagenComprimida);
    }

    await producto.update({
      nombre,
      precio,
      categoria,
      imagen: imagenBase64
    });
    
    producto.imagen = imagen ? 'imagen cambiada' : 'imagen no cambiada';

    res.status(200).json({
      message: 'Producto actualizado correctamente.',
      producto
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar el producto.', 
      error: error.message 
    });
  }
};

// Eliminar Producto
exports.deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    await producto.destroy();

    res.status(200).json({
      message: 'Producto eliminado correctamente.',
      producto
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar el producto.', 
      error: error.message 
    });
  }
};
