const ProductoCategoria = require('../models/ProductoCategoria.Model');

// Crear ProductoCategoria
exports.createProductoCategoria = async (req, res) => {
  try {
    const productoCategoria = await ProductoCategoria.create(req.body);
    res
      .status(201)
      .json({ message: 'Categoria creada correctamente.', productoCategoria });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear Categoria.', error: error.message });
  }
};

// Obtener todas las categorias
exports.getProductosCategorias = async (req, res) => {
  try {
    const productosCategorias = await ProductoCategoria.findAll();
    if (productosCategorias.length === 0) {
      return res
        .status(404)
        .json({
          message: 'No se encontraron categorias.',
          error: '404 Not Found',
        });
    }
    res
      .status(200)
      .json({
        message: 'Categorias obtenidas correctamente.',
        productosCategorias,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener categorias.', error: error.message });
  }
};

// Obtener Categoria por ID
exports.getProductoCategoriaById = async (req, res) => {
  const { id } = req.params;
  try {
    const productoCategoria = await ProductoCategoria.findByPk(id);
    if (!productoCategoria) {
      return res
        .status(404)
        .json({ message: 'Categoria no encontrada.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({
        message: 'Categoria obtenida correctamente.',
        productoCategoria,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al obtener la categoria.',
        error: error.message,
      });
  }
};

// Actualizar Categoria
exports.updateProductoCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await ProductoCategoria.update(req.body, {
      where: { id },
    });
    if (!categoria) {
      return res
        .status(404)
        .json({ message: 'Categoria no encontrada.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Categoria actualizada correctamente.', categoria });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al actualizar la categoria.',
        error: error.message,
      });
  }
};

// Eliminar Categoria
exports.deleteProductoCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await ProductoCategoria.destroy({
      where: { id },
    });
    if (!categoria) {
      return res
        .status(404)
        .json({ message: 'Categoria no encontrada.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Categoria eliminada correctamente.', categoria });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error al eliminar la categoria.',
        error: error.message,
      });
  }
};