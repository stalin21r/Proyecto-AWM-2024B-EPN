const { Sequelize } = require('sequelize')
require('dotenv').config()
const sequelizeConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: true
}
if (process.env.DB_SSL === 'true') {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeConfig
)
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión con postgresql db establecida!!')
  })
  .catch((err) => {
    console.error('Error al conectar con la db:', err)
  })
module.exports = sequelize
