import logo from '../assets/aeie-logo.png'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { AdministracionInicio } from './AdministracionInicio'
import { AdministracionTienda } from './AdministracionTienda'
import { AdministracionCasilleros } from './AdministracionCasilleros'
import { AdministracionHorario } from './AdministracionHorario'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminstracionUsuarios } from './AdminstracionUsuarios'
import { AdministracionTurnos } from './AdministracionTurnos'
import { Asistencias } from './Asistencias'
import { AdministrarBloquesCasilleros } from './AdministrarBloquesCasilleros'
import { Usuario } from './Usuario'

export function Administracion() {
  return (
    <div className="App">
      <div className="container">
        <Sidebar />
        <main className="content">
          <img className="logo" src={logo} alt="aeie" />
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/administracion/inicio" replace />}
            />
            <Route
              path="/inicio"
              element={
                <ProtectedRoute>
                  <AdministracionInicio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tienda"
              element={
                <ProtectedRoute>
                  <AdministracionTienda />
                </ProtectedRoute>
              }
            />
            <Route
              path="/casilleros"
              element={
                <ProtectedRoute>
                  <AdministracionCasilleros />
                </ProtectedRoute>
              }
            />
            <Route
              path="/casilleros/bloques"
              element={
                <ProtectedRoute>
                  <AdministrarBloquesCasilleros />
                </ProtectedRoute>
              }
            />
            <Route
              path="/turnos-y-asistencia"
              element={
                <ProtectedRoute>
                  <AdministracionHorario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute requiredRole={true}>
                  <AdminstracionUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuario"
              element={
                <ProtectedRoute>
                  <Usuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/turnos-y-asistencia/administrar"
              element={
                <ProtectedRoute requiredRole={true}>
                  <AdministracionTurnos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/turnos-y-asistencia/mis-asistencias"
              element={
                <ProtectedRoute>
                  <Asistencias />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}
