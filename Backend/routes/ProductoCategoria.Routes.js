const ProductoCtegoriaController = require('../controllers/ProductoCategoria.Controller');
const VerificarToken = require('../middlewares/Auth.Middleware');
module.exports = (app) => {
  app.post('/api/producto-categoria', VerificarToken, ProductoCtegoriaController.createProductoCategoria);
  app.get('/api/producto-categorias', VerificarToken, ProductoCtegoriaController.getProductosCategorias);
  app.get('/api/producto-categoria/:id', VerificarToken, ProductoCtegoriaController.getProductoCategoriaById);
  app.put('/api/producto-categoria/:id', VerificarToken, ProductoCtegoriaController.updateProductoCategoria);
  app.delete('/api/producto-categoria/:id', VerificarToken, ProductoCtegoriaController.deleteProductoCategoria);
};