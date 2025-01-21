const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Casillero = sequelize.define('Casillero', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bloque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bloques', // nombre de la tabla referenciada
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ocupado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  propietario: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'casilleros', // nombre de la tabla en la base de datos
  schema: 'private', // nombre del esquema en la base de datos
  timestamps: false // si no hay columnas de marca de tiempo como createdAt y updatedAt
});

module.exports = Casillero;
