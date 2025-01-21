const sequelize = require('../config/db.config');
const Asistencia = require('../models/Asistencia.Model');

//  Crear Asistencia
exports.createAsistencia = async (req, res) => {
  try {
    const asistencia = await Asistencia.create(req.body);
    res
      .status(201)
      .json({ message: 'Asistencia registrada correctamente.', asistencia });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear el asistencia.', error: error.message });
  }
};

// Obtener todas las asistencias
exports.getAsistencias = async (req, res) => {
  try {
    const asistencias = await sequelize.query(
      'SELECT id, nombre, apellido, dia, hora_llegada, hora_salida FROM public.vista_asistencias',
      { type: sequelize.QueryTypes.SELECT }
    );
    if (asistencias.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron asistencias.',
        error: '404 Not Found',
      });
    }
    res
      .status(200)
      .json({ message: 'Asistencias obtenidas correctamente.', asistencias });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener asistencias.', error: error.message });
  }
};

// Obtener Asistencia por ID
exports.getAsistenciaById = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await sequelize.query(
      'SELECT * FROM public.vista_asistencias WHERE id = :id',
      { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    );
    if (!asistencia) {
      return res
        .status(404)
        .json({ message: 'Asistencia no encontrada.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Asistencia obtenida correctamente.', asistencia });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el asistencia.',
      error: error.message,
    });
  }
};

// Obtener Asistencia por usuario (usando req.query)
exports.getAsistenciaByUsuario = async (req, res) => {
  const { usuario } = req.query; // <- Se cambia a req.query para capturar el query param
  try {
    if (!usuario) {
      return res.status(400).json({
        message: 'El parámetro usuario es requerido.',
      });
    }

    const asistencias = await sequelize.query(
      'SELECT id, nombre, apellido, dia, hora_llegada, hora_salida FROM public.vista_asistencias WHERE usuario = :usuario',
      {
        replacements: { usuario },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (asistencias.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron asistencias para este usuario.',
        error: '404 Not Found',
      });
    }

    res.status(200).json({
      message: 'Asistencia obtenida correctamente.',
      asistencias,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la asistencia.',
      error: error.message,
    });
  }
};

// Actualizar Asistencia
exports.updateAsistencia = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await Asistencia.update(req.body, {
      where: { id },
    });
    if (!asistencia) {
      return res
        .status(404)
        .json({ message: 'Asistencia no encontrada.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Asistencia actualizada correctamente.', asistencia });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el asistencia.',
      error: error.message,
    });
  }
};

// Eliminar Asistencia
exports.deleteAsistencia = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await Asistencia.destroy({
      where: { id },
    });
    if (!asistencia) {
      return res
        .status(404)
        .json({ message: 'Asistencia no encontrada.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Asistencia eliminada correctamente.', asistencia });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el asistencia.',
      error: error.message,
    });
  }
};
