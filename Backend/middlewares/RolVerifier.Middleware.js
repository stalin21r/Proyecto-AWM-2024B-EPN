const VerificarRol = (req, res, next) => {
  if (req.user && req.user.rol === true) {
    next()
  } else {
    res.status(403).json({ message: 'Acceso denegado' })
  }
}
module.exports = VerificarRol
