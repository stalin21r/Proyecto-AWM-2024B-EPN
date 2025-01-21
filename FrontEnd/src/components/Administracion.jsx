import logo from "../assets/aeie-logo.png";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AdministracionInicio } from "./AdministracionInicio";
import { AdministracionTienda } from "./AdministracionTienda";
import { AdministracionCasilleros } from "./AdministracionCasilleros";
import { AdministracionHorario } from "./AdministracionHorario";

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
            <Route path="/inicio" element={<AdministracionInicio />} />
            <Route path="/tienda" element={<AdministracionTienda/>} />
            <Route path="/casilleros" element={<AdministracionCasilleros />} />
            <Route path="/turnos-y-asistencia" element={<AdministracionHorario />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}