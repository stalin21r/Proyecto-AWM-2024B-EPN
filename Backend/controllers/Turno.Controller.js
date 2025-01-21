const sequelize = require('../config/db.config');
const Turno = require('../models/Turno.Model');

//  Crear Turno
exports.createTurno = async (req, res) => {
  try {
    const turno = await Turno.create(req.body);
    res.status(201).json({ message: 'Turno creado correctamente.', turno });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al crear el turno.', error: error.message });
  }
};

// Obtener todos los turnos
exports.getTurnos = async (req, res) => {
  try {
    const turnos = await sequelize.query(
      'SELECT * FROM public.vista_turnos', 
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (turnos.length === 0) {
      return res
        .status(404)
        .json({ message: 'No se encontraron turnos.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Turnos obtenidos correctamente.', turnos });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener turnos.', error: error.message });
  }
};

// Obtener Turno por ID
exports.getTurnoById = async (req, res) => {
  const { id } = req.params;
  try {
    const turno = await sequelize.query(
      'SELECT * FROM public.vista_turnos WHERE id = :id',
      { replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
    );
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado.', error: '404 Not Found' });
    }
    res.status(200).json({ message: 'Turno obtenido correctamente.', turno });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener el turno.', error: error.message });
  }
};

// Actualizar Turno
exports.updateTurno = async (req, res) => {
  const { id } = req.params;
  const { usuario, dia, hora_llegada, hora_salida } = req.body;
  try {
    const turno = await Turno.update(
      { usuario, dia, hora_llegada, hora_salida }, 
      { where: { id }}
    );
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado.', error: '404 Not Found' });
    }
    res
      .status(200)
      .json({ message: 'Turno actualizado correctamente.', turno });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el turno.', error: error.message });
  }
};

// Eliminar Turno
exports.deleteTurno = async (req, res) => {
  const { id } = req.params;
  try {
    const turno = await Turno.destroy({
      where: { id },
    });
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado.', error: '404 Not Found' });
    }
    res.status(200).json({ message: 'Turno eliminado correctamente.', turno });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar el turno.', error: error.message });
  }
};
