import carSrc from '../assets/car.svg'

export type ParkingSpot = {
  id: number
  label?: string
  ocupado: boolean
}

type Props = {
  spot: ParkingSpot
  onToggle: (id: number) => void
}

export default function ParkingSpotButton({ spot, onToggle: _onToggle }: Props) {
  const stateClass = spot.ocupado ? 'spot--occupied' : 'spot--free'
  return (
    <div className={`spot ${stateClass} card`} title={`Plaza ${spot.label ?? spot.id} — ${spot.ocupado ? 'Ocupada' : 'Libre'}`}>
      <img src={carSrc} alt="auto" style={{ width: 44, height: 28, objectFit: 'contain', marginBottom: 8 }} />
      <div className="label">Plaza {spot.label ?? spot.id}</div>
      <div className="status">{spot.ocupado ? 'Ocupado' : 'Libre'}</div>
    </div>
  )
}
