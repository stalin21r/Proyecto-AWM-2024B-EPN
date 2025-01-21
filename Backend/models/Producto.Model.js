const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const ProductoCategoria = require('./ProductoCategoria.Model');

const Producto = sequelize.define(
  'Producto',
  {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    categoria: {
      type: DataTypes.INTEGER,
      references: {
        model: ProductoCategoria,
        key: 'id'
      },
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    imagen: {
      type:DataTypes.BLOB('long'),
      allowNull: true
    }
  },
  {
    tableName: 'productos',
    schema: 'private',
    timestamps: false
  }
);

module.exports = Producto;