const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const CasilleroBloque = require('./CasilleroBloque.Model')
const Casillero = sequelize.define(
  'Casillero',
  {
    bloque: {
      type: DataTypes.INTEGER,
      references: {
        model: CasilleroBloque,
        key: 'id'
      },
      allowNull: false,
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
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9\-+()\s]*$/
      }
    },
    registrado_por: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'casilleros',
    schema: 'private',
    timestamps: false
  }
)
// Define the association
Casillero.belongsTo(CasilleroBloque, {
  foreignKey: 'bloque',
  targetKey: 'id'
})
module.exports = Casillero
