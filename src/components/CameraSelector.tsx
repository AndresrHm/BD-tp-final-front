
type Props = {
  cameras: string[]
  selected: string
  onSelect: (cam: string) => void
}

export default function CameraSelector({ cameras, selected, onSelect }: Props) {
  return (
    <div className="camera-selector">
      {cameras.map((cam) => (
        <button
          key={cam}
          onClick={() => onSelect(cam)}
          className={`camera-btn ${selected === cam ? 'active' : ''}`}
          aria-pressed={selected === cam}
        >
          {cam.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
