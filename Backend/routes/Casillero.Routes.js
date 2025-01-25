const CasilleroController = require('../controllers/Casillero.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')

module.exports = (app) => {
  app.post('/api/casillero', VerificarToken, CasilleroController.createCasillero)
  app.get('/api/casilleros', VerificarToken, CasilleroController.getAllCasilleros)
  app.put('/api/casillero', VerificarToken, CasilleroController.registerCasillero)
  app.get('/api/casillero-bloques', VerificarToken, CasilleroController.getAllLetras)
  app.put('/api/casillero/:id', VerificarToken, CasilleroController.deleteCasillero)
}            