const { DataTypes } = require('sequelize')
const sequelize = require('../config/db.config')
const CasilleroBloque = sequelize.define(
  'CasilleroBloque',
  {
    letra: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'bloque',
    schema: 'private',
    timestamps: false
  }
)
module.exports = CasilleroBloque
