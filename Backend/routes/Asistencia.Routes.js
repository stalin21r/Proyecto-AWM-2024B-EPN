const AsistenciaController = require('../controllers/Asistencia.Controller')
const VerificarToken = require('../middlewares/Auth.Middleware')
const verificarRol = require('../middlewares/RolVerifier.Middleware')
module.exports = (app) => {
  app.post('/api/asistencia', VerificarToken, AsistenciaController.createAsistencia)
  app.get('/api/asistencias', VerificarToken, AsistenciaController.getAsistencias)
  app.get('/api/asistencia/:id', VerificarToken, AsistenciaController.getAsistenciaById)
  app.put('/api/asistencia/:id', VerificarToken, AsistenciaController.updateAsistencia)
  app.delete('/api/asistencia/:id', VerificarToken, verificarRol, AsistenciaController.deleteAsistencia)
}
