/* eslint-disable react/prop-types */
import casillero from '../assets/locker.png'

export function Casillero({ numero, isArrended, onClick }) {
  const className = `casillero ${isArrended ? 'red' : 'green'}`

  return (
    <button className={className} onClick={onClick}>
      <img src={casillero} alt="casillero" />
      <span>{numero}</span>
    </button>
  )
}
