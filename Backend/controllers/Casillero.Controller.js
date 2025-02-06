/* eslint-disable camelcase */
const sequelize = require('../config/db.config')
const Casillero = require('../models/Casillero.Model')
const CasilleroBloque = require('../models/CasilleroBloque.Model')
// Crear un bloque de casilleros
exports.createCasillero = async (req, res) => {
  let { modo } = req.body
  console.log(sequelize)
  if (typeof modo === 'undefined') {
    modo = true
  }
  try {
    const result = await sequelize.query(
      'SELECT * FROM private.crear_bloque_y_casilleros(:modo)',
      {
        replacements: { modo },
        type: sequelize.QueryTypes.SELECT
      }
    )
    if (!result || result.length === 0) {
      return res.status(400).json({ message: 'No se pudo crear el bloque.' })
    }
    res.status(200).json({ message: 'Bloque de casilleros creado con éxito.' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error al crear bloque.', error: error.message })
  }
}
// Obtener Ocupancia de casilleros
exports.getOcupancia = async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT 
           b.letra AS "bloque",
           COUNT(c.id) AS "casilleros",
           SUM(CASE WHEN c.ocupado THEN 1 ELSE 0 END) AS "ocupados",
           SUM(CASE WHEN NOT c.ocupado THEN 1 ELSE 0 END) AS "libres",
           ROUND(100.0 * SUM(CASE WHEN c.ocupado THEN 1 ELSE 0 END) / COUNT(c.id), 2) AS "ocupacion"
       FROM 
           private.casilleros c
       INNER JOIN 
           private.bloque b ON c.bloque = b.id
       GROUP BY 
           b.letra
       ORDER BY 
           b.letra`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    )
    console.log(result)
    if (!result || result.length === 0) {
      return res
        .status(400)
        .json({ message: 'No hay bloques de casilleros.', bloques: [] })
    }
    res
      .status(200)
      .json({ message: 'Bloques obtenidos con éxito.', bloques: result })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener bloques.', error: error.message })
  }
}
// Obtener todos los casilleros
exports.getAllCasilleros = async (req, res) => {
  const { letra } = req.query
  try {
    const casilleros = await Casillero.findAll({
      include: [
        {
          model: CasilleroBloque,
          where: letra ? { letra } : undefined, // Filtro dinámico para la letra
          required: true
        }
      ],
      order: [['id', 'ASC']] // Asegura que los resultados estén ordenados por 'id' de la tabla 'Casillero'
    })
    if (casilleros.length === 0) {
      return res.status(404).json({
        message: 'No hay casilleros disponibles.',
        error: '404 Not Found'
      })
    }
    res.status(200).json({
      message: 'Casilleros obtenidos correctamente.',
      casilleros
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener casilleros',
      error: error.message
    })
  }
}
// Eliminar bloque de casilleros
exports.deleteBloque = async (req, res) => {
  const { letra } = req.params // Asumimos que la letra del bloque se pasa como parámetro en la URL
  try {
    // Buscar el bloque por la letra
    const bloque = await CasilleroBloque.findOne({ where: { letra } })
    if (!bloque) {
      return res.status(404).json({
        message: `Bloque con letra '${letra}' no encontrado.`
      })
    }
    // Eliminar el bloque
    await bloque.destroy()
    res.status(200).json({
      message: `Bloque '${letra}' y sus casilleros asociados fueron eliminados con éxito.`
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error al eliminar el bloque.',
      error: error.message
    })
  }
}

// Editar casillero
exports.registerCasillero = async (req, res) => {
  const { casillero } = req.query // IDs del bloque y del casillero
  const { propietario, correo, telefono, registrado_por } = req.body // Datos del propietario
  try {
    // Buscar el casillero por bloqueId y casilleroId
    const casilleroSeleccionado = await Casillero.findOne({
      where: {
        id: casillero
      }
    })
    // Verificar si el casillero existe
    if (!casilleroSeleccionado) {
      return res.status(404).json({
        message: 'Casillero no encontrado.'
      })
    }
    if (!propietario || !correo || !telefono) {
      return res.status(400).json({
        message:
          'debe enviar todos los parametros: propietario, correo y telefono.'
      })
    }
    // Determinar si es un registro nuevo o una actualización
    let message
    if (!casilleroSeleccionado.ocupado) {
      message = 'Registro exitoso. Casillero asignado correctamente.'
    } else {
      message = 'Actualización exitosa. Datos del casillero actualizados.'
    }
    // Actualizar los datos del casillero
    casilleroSeleccionado.ocupado = true
    casilleroSeleccionado.propietario = propietario
    casilleroSeleccionado.correo = correo
    casilleroSeleccionado.telefono = telefono
    casilleroSeleccionado.registrado_por = registrado_por
    // Guardar los cambios
    await casilleroSeleccionado.save()
    // Respuesta exitosa
    res.status(200).json({
      message,
      casilleroSeleccionado
    })
  } catch (error) {
    console.log(error.errors[0].validatorKey)
    let msg = ''
    if (error.errors[0].validatorKey === 'isEmail') {
      msg = 'Correo invalido!!'
    } else if (error.errors[0].validatorKey === 'is') {
      msg = 'Numero de teléfono invalido!!'
    }
    res.status(500).json({
      message: 'Error al registrar o actualizar el casillero. ' + msg,
      error: error.message
    })
  }
}
// Obtener todas las letras de los bloques
exports.getAllLetras = async (req, res) => {
  try {
    // Obtener solo las letras de la tabla 'CasilleroBloque'
    const bloques = await CasilleroBloque.findAll({
      attributes: ['letra'] // Solo seleccionamos la columna 'letra'
    })

    // Verificamos si hay resultados
    if (bloques.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron bloques.',
        error: '404 Not Found'
      })
    }
    // Responder con las letras de los bloques
    res.status(200).json({
      message: 'Letras de bloques obtenidas correctamente.',
      letras: bloques.map((bloque) => bloque.letra) // Extraemos solo las letras
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error al obtener las letras de los bloques',
      error: error.message
    })
  }
}
// Limpiar Casillero
exports.deleteCasillero = async (req, res) => {
  const { id } = req.params // Asumimos que el ID del casillero se pasa como parámetro en la URL
  const { registrado_por } = req.body
  try {
    // Buscar el casillero por ID
    const casillero = await Casillero.findOne({ where: { id } })

    if (!casillero) {
      return res.status(404).json({
        message: `Casillero con ID '${id}' no encontrado.`
      })
    }
    // Limpiar los datos del casillero
    casillero.ocupado = false
    casillero.propietario = null
    casillero.correo = null
    casillero.telefono = null
    casillero.registrado_por = registrado_por
    // Guardar los cambios
    await casillero.save()
    res.status(200).json({
      message: 'Casillero limpiado con éxito.'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error al limpiar el casillero.',
      error: error.message
    })
  }
}
// Limpiar Bloque
exports.cleanBloque = async (req, res) => {
  const { letra } = req.params // Asumimos que la letra del bloque se pasa como parámetro en la URL
  const { registrado_por } = req.body
  try {
    // Buscar todos los casilleros del bloque por letra
    const casilleros = await Casillero.findAll({
      include: [
        {
          model: CasilleroBloque,
          where: { letra },
          required: true
        }
      ]
    })

    if (casilleros.length === 0) {
      return res.status(404).json({
        message: `No se encontraron casilleros para el bloque con letra '${letra}'.`
      })
    }

    // Limpiar los datos de cada casillero
    for (const casillero of casilleros) {
      casillero.ocupado = false
      casillero.propietario = null
      casillero.correo = null
      casillero.telefono = null
      casillero.registrado_por = registrado_por
      await casillero.save()
    }

    res.status(200).json({
      message: `Todos los casilleros del bloque '${letra}' fueron limpiados con éxito.`
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error al limpiar los casilleros del bloque.',
      error: error.message
    })
  }
}
