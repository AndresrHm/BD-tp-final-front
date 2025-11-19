export default function CameraSelector({ cameras, selected, onSelect }) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-xl inline-flex">
      {cameras.map((cam) => (
        <button
          key={cam}
          onClick={() => onSelect(cam)}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 capitalize ${
            selected === cam 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
          }`}
          aria-pressed={selected === cam}
        >
          CAM {cam.toUpperCase()}
        </button>
      ))}
    </div>
  );
}