const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.SERVER_PORT || 3000
require('./config/db.config')
app.use(cors(), express.json(), express.urlencoded({ extended: true })) // Middleware
require('./routes/Usuario.Routes')(app)
require('./routes/Turno.Routes')(app)
require('./routes/Asistencia.Routes')(app)
require('./routes/ProductoCategoria.Routes')(app)
require('./routes/Producto.Routes')(app)
require('./routes/Auth.Routes')(app)
require('./routes/Casillero.Routes')(app)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
