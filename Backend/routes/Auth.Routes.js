const AuthController = require('../controllers/Auth.Controller');

module.exports = (app) => {
  app.post('/api/login', AuthController.login);
}