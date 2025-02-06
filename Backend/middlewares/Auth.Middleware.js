const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET
const VerificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó un token.' })
  }
  const token = authHeader.split(' ')[1] // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido.' })
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado.' })
    }
    req.user = user // Adjunta los datos del usuario al request
    next()
  })
}
module.exports = VerificarToken
