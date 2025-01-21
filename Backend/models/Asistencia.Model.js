const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Usuario = require('./Usuario.Model');

const Asistencia = sequelize.define(
  'Asistencia',
  {
    usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: Usuario,
        key: 'id'
      },
      allowNull: false,
      onDelete: 'CASCADE',
    },
    dia: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    hora_llegada: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: false
    }
  },
  {
    tableName: 'asistencia',
    schema: 'private',
    timestamps: false
  }
);

module.exports = Asistencia;  