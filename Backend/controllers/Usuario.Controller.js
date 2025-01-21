const { Sequelize } = require('sequelize');
const Usuario = require('../models/Usuario.Model');
const bcrypt = require('bcrypt');

//Crear usuario
module.exports.createUsuario = async (req, res) => {
  const { nombre, apellido, correo, contrasena, usuario, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contrasena: hashedPassword,
      usuario,
      rol,
    });
    res.status(201).json({ nuevoUsuario, message: 'Usuario creado con éxito' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al crear usuario', error: error.message });
  }
};

//Obtener usuarios
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
          'rol',
        ],
      ],
    });
    if (usuarios.length === 0) {
      return res
        .status(404)
        .json({
          message: 'No hay usuarios para mostrar',
          error: '404 Not Found',
        });
    }
    res.status(200).json({ usuarios, message: 'Usuarios obtenidos con éxito' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

//Obtener usuario por id
module.exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' });
    }
    console.log(bcrypt.compare('12345', usuario.contrasena));
    res.status(200).json({ usuario, message: 'Usuario obtenido con éxito' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al obtener usuario', error: error.message });
  }
};

//Actualizar usuario por id
module.exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, contrasena, usuario, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const usuarioActualizado = await Usuario.update(
      { nombre, apellido, correo, contrasena: hashedPassword, usuario, rol },
      { where: { id } }
    );
    if (!usuarioActualizado) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Usuario actualizado con éxito', usuarioActualizado });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

//Eliminar usuario por id
module.exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.destroy({ where: { id } });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado', error: '404 Not Found' });
    }
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
