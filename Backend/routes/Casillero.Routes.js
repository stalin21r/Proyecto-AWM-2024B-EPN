const CasilleroController = require('../controllers/Casillero.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')
const verificarRol = require('../middlewares/RolVerifier.Middleware')
module.exports = (app) => {
  app.post('/api/casillero', VerificarToken, CasilleroController.createCasillero)
  app.get('/api/casilleros', CasilleroController.getAllCasilleros)
  app.put('/api/casillero', VerificarToken, CasilleroController.registerCasillero)
  app.get('/api/casillero-bloques', CasilleroController.getAllLetras)
  app.put('/api/casillero/:id', VerificarToken, CasilleroController.deleteCasillero)
  app.get('/api/casilleros-ocupancia', VerificarToken, verificarRol, CasilleroController.getOcupancia)
  app.delete('/api/casillero-bloque/:letra', VerificarToken, verificarRol, CasilleroController.deleteBloque)
  app.put('/api/clean-bloque/:letra', VerificarToken, verificarRol, CasilleroController.cleanBloque)
}
