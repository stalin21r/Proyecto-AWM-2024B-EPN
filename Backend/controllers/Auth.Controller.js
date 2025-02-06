require('dotenv').config()
const sequelize = require('../config/db.config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error('JWT_SECRET no está definido en el archivo .env')
  process.exit(1)
}
exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body
  if (!usuario || !contrasena) {
    return res
      .status(400)
      .json({ message: 'usuario y contraseña son requeridos.' })
  }
  try {
    const result = await sequelize.query(
      'SELECT * FROM private.login_usuario(:usuario)',
      { replacements: { usuario }, type: sequelize.QueryTypes.SELECT }
    )
    if (!result[0]) {
      return res.status(400).json({ message: 'Usuario no encontrado.' })
    }
    const user = result[0]
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' })
    }
    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol
      },
      JWT_SECRET,
      { expiresIn: '3h', algorithm: 'HS256' }
    )
    res.status(200).json({ message: 'Inicio de sesión exitoso.', token })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al iniciar sesión.', error: error.message })
  }
}
