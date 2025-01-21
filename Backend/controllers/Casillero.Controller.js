const sequelize = require('../config/db.config');

exports.createCasillero = async (req, res) => {
  let { modo } = req.body;
  console.log(sequelize);
  // Si no se proporciona 'modo', se asigna el valor por defecto 'true'
  if (typeof modo === 'undefined') {
    modo = true;
  }

  try {
    // Se ejecuta la consulta para crear el bloque y los casilleros
    const result = await sequelize.query(
      'SELECT * FROM private.crear_bloque_y_casilleros(:modo)', // Consulta SQL
      {
        replacements: { modo }, // Parametrización de la consulta
        type: sequelize.QueryTypes.SELECT // Especificando que la consulta es de tipo SELECT
      }
    );

    // Si no se obtiene resultado, devolver un error
    if (!result || result.length === 0) {
      return res.status(400).json({ message: 'No se pudo crear el bloque.' });
    }

    // Si todo va bien, responde con mensaje de éxito
    res.status(200).json({ message: 'Bloque de casilleros creado con éxito.' });
  } catch (error) {
    // Manejo de errores con mensaje adecuado
    console.error(error);
    res.status(500).json({ message: 'Error al crear bloque.', error: error.message });
  }
};
