const CasilleroController = require('../controllers/Casillero.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')

module.exports = (app) => {
  app.post('/api/casillero', CasilleroController.createCasillero)
}            