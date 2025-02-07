const ProductoCategoriaController = require('../controllers/ProductoCategoria.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')
module.exports = (app) => {
  app.post('/api/producto-categoria', VerificarToken, VerificarToken, ProductoCategoriaController.createProductoCategoria)
  app.get('/api/producto-categorias', ProductoCategoriaController.getProductosCategorias)
  app.get('/api/producto-categoria/:id', ProductoCategoriaController.getProductoCategoriaById)
  app.put('/api/producto-categoria/:id', VerificarToken, VerificarToken, ProductoCategoriaController.updateProductoCategoria)
  app.delete('/api/producto-categoria/:id', VerificarToken, VerificarToken, ProductoCategoriaController.deleteProductoCategoria)
}
