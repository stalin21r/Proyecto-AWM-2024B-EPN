import { NavLink } from 'react-router-dom'; // Importa NavLink
import lobo from '../assets/lobo.png';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <img className="lobo-aeie" src={lobo} alt="aeie-lobo" />
      <NavLink to="/">
        <h2 className="titulo-sidebar">AEIE</h2>
      </NavLink>
      <nav className="menu">
        <NavLink 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} 
          to="/administracion/inicio"
        >
          Inicio
        </NavLink>
        <NavLink 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} 
          to="/administracion/tienda"
        >
          Tienda
        </NavLink>
        <NavLink 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} 
          to="/administracion/casilleros"
        >
          Casilleros
        </NavLink>
        <NavLink 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"} 
          to="/administracion/turnos-y-asistencia"
        >
          Turnos y Asistencia
        </NavLink>
      </nav>
    </aside>
  );
}
