const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Usuario = require('./Usuario.Model');

const Turno = sequelize.define(
  'Turno',
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
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      }
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    }
  },
  {
    tableName: 'turnos',
    schema: 'private',
    timestamps: false
  }
);

module.exports = Turno;  