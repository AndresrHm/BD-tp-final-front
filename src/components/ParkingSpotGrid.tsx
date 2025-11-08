type ParkingSpot = {
  id: number;
  ocupado: boolean;
  label?: string;
};
import ParkingSpotButton from "./ParkingSpotButton";

type Props = {
  spots: ParkingSpot[];
  onToggle: (id: number) => void;
  columns?: number;
};

export default function ParkingSpotGrid({ spots, onToggle, columns: _columns = 4 }: Props) {
  return (
    <div className="parking-grid">
      {spots.map((s) => (
        <ParkingSpotButton key={s.id} spot={s} onToggle={onToggle} />
      ))}
    </div>
  );
}
