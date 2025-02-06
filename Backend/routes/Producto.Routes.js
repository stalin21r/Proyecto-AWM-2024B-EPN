const ProductoController = require('../controllers/Producto.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
module.exports = (app) => {
  app.post('/api/producto', VerificarToken, upload.single('imagen'), ProductoController.createProducto)
  app.get('/api/productos', ProductoController.getAllProductos)
  app.get('/api/producto/:id', ProductoController.getProductoById)
  app.put('/api/producto/:id', VerificarToken, upload.single('imagen'), ProductoController.updateProducto)
  app.delete('/api/producto/:id', VerificarToken, ProductoController.deleteProducto)
}
