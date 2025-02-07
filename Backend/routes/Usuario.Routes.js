const UsuarioController = require('../controllers/Usuario.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')
const VerificarRol = require('../middlewares/RolVerifier.Middleware')
module.exports = (app) => {
  app.post('/api/usuario', VerificarToken, VerificarToken, UsuarioController.createUsuario)
  app.get('/api/usuarios', VerificarToken, VerificarToken, UsuarioController.getUsuarios)
  app.get('/api/usuario/:id', VerificarToken, UsuarioController.getUsuarioById)
  app.put('/api/usuario/:id', VerificarToken, UsuarioController.updateUsuario)
  app.delete('/api/usuario/:id', VerificarToken, VerificarRol, UsuarioController.deleteUsuario)
}
