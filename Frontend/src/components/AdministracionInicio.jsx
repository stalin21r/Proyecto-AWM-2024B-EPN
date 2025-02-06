import lobo from '../assets/Aeie-Lobo-Inicio.png'

export function AdministracionInicio() {
  return (
    <div className="inicio-container">
      <h1>
        <strong>Bienvenido a AEIE</strong>
      </h1>
      <p>
        Aquí puedes encontrar la tienda, los casilleros, el registro de
        asistencia y el horario de turnos
      </p>
      <img src={lobo} alt="AEIE" />
    </div>
  )
}
