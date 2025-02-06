const { Sequelize } = require('sequelize')
const Usuario = require('../models/Usuario.Model')
const bcrypt = require('bcrypt')
// Crear usuario
module.exports.createUsuario = async (req, res) => {
  const { nombre, apellido, correo, contrasena, usuario, rol } = req.body
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10)
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contrasena: hashedPassword,
      usuario,
      rol
    })
    res.status(201).json({ nuevoUsuario, message: 'Usuario creado con éxito' })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al crear usuario', error: error.message })
  }
}
// Obtener usuarios
module.exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: [
        'id',
        'nombre',
        'apellido',
        'correo',
        'usuario',
        [
          Sequelize.literal(
            "CASE WHEN rol = true THEN 'administrador' ELSE 'normal' END"
          ),
          'rol'
        ]
      ]
    })
    if (usuarios.length === 0) {
      return res.status(404).json({
        message: 'No hay usuarios para mostrar',
        error: '404 Not Found'
      })
    }
    res.status(200).json({ usuarios, message: 'Usuarios obtenidos con éxito' })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al obtener usuarios', error: error.message })
  }
}
// Obtener usuario por id
module.exports.getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' })
    }
    console.log(bcrypt.compare('12345', usuario.contrasena))
    res.status(200).json({ usuario, message: 'Usuario obtenido con éxito' })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al obtener usuario', error: error.message })
  }
}
module.exports.updateUsuario = async (req, res) => {
  const { id } = req.params
  const {
    nombre,
    apellido,
    correo,
    contrasena,
    usuario,
    rol,
    anteriorContrasena
  } = req.body

  if (!nombre || !apellido || !correo || !usuario) {
    return res.status(400).json({
      message: 'Campos requeridos no ingresados.'
    })
  }

  try {
    // Obtener el usuario actual
    const usuarioActual = await Usuario.findOne({ where: { id } })
    if (!usuarioActual) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' })
    }

    // Validar si el nombre de usuario ya está en uso
    if (usuario && usuario !== usuarioActual.usuario) {
      const usuarioExistente = await Usuario.findOne({ where: { usuario } })
      if (usuarioExistente && usuarioExistente.id !== id) {
        return res.status(400).json({
          message: 'El nombre de usuario ya existe',
          error: 'Bad Request'
        })
      }
    }

    // Validar si el correo ya está en uso
    if (correo && correo !== usuarioActual.correo) {
      const correoExistente = await Usuario.findOne({ where: { correo } })
      if (correoExistente && correoExistente.id !== id) {
        return res.status(400).json({
          message: 'El correo electrónico ya está en uso',
          error: 'Bad Request'
        })
      }
    }

    const camposActualizacion = {
      nombre,
      apellido,
      correo,
      usuario
    }

    // Agregar solo los campos presentes en el cuerpo de la solicitud
    if (rol) camposActualizacion.rol = rol

    // Validar y actualizar la contraseña si se proporciona
    if (contrasena) {
      if (!anteriorContrasena) {
        return res.status(400).json({
          message:
            'Se requiere la contraseña anterior para actualizar la contraseña'
        })
      }

      // Verificar que la contraseña anterior sea correcta
      const contrasenaValida = await bcrypt.compare(
        anteriorContrasena,
        usuarioActual.contrasena
      )
      if (!contrasenaValida) {
        return res.status(401).json({
          message: 'La contraseña anterior es incorrecta',
          error: 'Unauthorized'
        })
      }

      // Hashear la nueva contraseña y agregarla a los campos a actualizar
      const hashedPassword = await bcrypt.hash(contrasena, 10)
      camposActualizacion.contrasena = hashedPassword
    }

    // Actualizar el usuario
    const [filasActualizadas] = await Usuario.update(camposActualizacion, {
      where: { id }
    })
    if (!filasActualizadas) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' })
    }

    res.status(200).json({
      message: 'Usuario actualizado con éxito',
      camposActualizacion
    })
  } catch (error) {
    // Manejo de errores en la base de datos o validaciones
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'El nombre de usuario o correo electrónico ya existe',
        error: 'Bad Request'
      })
    }

    res
      .status(400)
      .json({ message: 'Error al actualizar usuario', error: error.message })
  }
}
// Eliminar usuario por id
module.exports.deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.destroy({ where: { id } })
    if (!usuario) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' })
    }
    res.status(200).json({ message: 'Usuario eliminado con éxito' })
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al eliminar usuario', error: error.message })
  }
}
