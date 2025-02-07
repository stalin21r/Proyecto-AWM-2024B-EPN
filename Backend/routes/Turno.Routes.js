const TurnoController = require('../controllers/Turno.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')
module.exports = (app) => {
  app.post('/api/turno', VerificarToken, TurnoController.createTurno)
  app.get('/api/turnos', VerificarToken, TurnoController.getTurnos)
  app.get('/api/turno/:id', VerificarToken, TurnoController.getTurnoById)
  app.put('/api/turno/:id', VerificarToken, TurnoController.updateTurno)
  app.delete('/api/turno/:id', VerificarToken, VerificarToken, TurnoController.deleteTurno)
}
