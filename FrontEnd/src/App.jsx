import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Administracion } from "./components/Administracion";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Importa el componente de protección

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige a /login si la ruta raíz es visitada */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/administracion/*"
          element={
            <ProtectedRoute>
              <Administracion />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
