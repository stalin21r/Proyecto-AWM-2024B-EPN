const { Sequelize } = require('sequelize');
require('dotenv').config();
const fs = require('fs');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión con postgresql db establecida!!');
  })
  .catch((err) => {
    console.error('Error al conectar con la db:', err);
  });

  module.exports = sequelize;