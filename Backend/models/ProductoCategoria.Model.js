const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ProductoCategoria = sequelize.define(
  'ProductoCategoria',
  {
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'productos_categorias',
    schema: 'private',
    timestamps: false
  }
);

module.exports = ProductoCategoria;