import React, { useEffect, useState } from 'react';

// URL de tu API real
const API_URL = 'http://localhost:8000'; 

/**
 * COMPONENTE: Botón con Estilos Tailwind
 */
const ParkingSpotButton = ({ spot, onToggle }) => {
  const isOccupied = spot.ocupado;

  // Clases base para la tarjeta
  const baseClasses = "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 border-2 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer min-h-[110px] w-full group";
  
  // Clases según estado (Rojo vs Verde)
  const statusClasses = isOccupied
    ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300" 
    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300";

  return (
    <div 
      onClick={() => onToggle && onToggle(spot.id)}
      className={`${baseClasses} ${statusClasses}`}
    >
      {/* Icono animado */}
      <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-200">
        {isOccupied ? '🚗' : '✅'}
      </div>
      
      <span className="font-extrabold text-lg tracking-tight">{spot.label}</span>
      
      <span className={`text-xs font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full ${isOccupied ? 'bg-red-200/50' : 'bg-emerald-200/50'}`}>
        {isOccupied ? 'Ocupado' : 'Libre'}
      </span>
    </div>
  );
};

export default function ParkingLiveView({ cameraName = "2" }) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('rows'); 

  const fetchSpots = async () => {
    try {
      const response = await fetch(`${API_URL}/cameras/${cameraName}/spots`);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      
      const formatedSpots = data.map(s => ({
        id: s.id,
        ocupado: s.spot_status === 'occupied' || s.ocupado === true, 
        label: s.label || `F${s.row}-P${s.slot_number}`,
        row: s.row || 1,
        slot_number: s.slot_number
      }));

      setSpots(formatedSpots);
      setError(null);
    } catch (err) {
      setError('Modo Offline: Backend no detectado.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpots();
    const interval = setInterval(fetchSpots, 2000); 
    return () => clearInterval(interval);
  }, [cameraName]);

  return (
    <div className="">
      {/* Header Moderno */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Monitor en Vivo</h2>
            <p className="text-xs text-slate-500 font-medium">Cámara: <span className="text-indigo-600 bg-indigo-50 px-1 rounded">{cameraName}</span></p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['grid', 'rows', 'street'].map((mode) => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 capitalize ${
                viewMode === mode 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              {mode === 'grid' ? 'Grilla' : mode === 'rows' ? 'Filas' : 'Pasillo'}
            </button>
          ))}
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg flex items-center gap-3 shadow-sm">
          <span className="text-amber-500 text-xl">⚠️</span>
          <span className="text-amber-800 font-medium text-sm">{error}</span>
        </div>
      )}

      {/* Visualizador */}
      {!loading && (
        <VisualizerGrid spots={spots} mode={viewMode} />
      )}
    </div>
  );
}

/**
 * LAYOUTS (Estilizados con Tailwind)
 */
function VisualizerGrid({ spots, mode }) {
  
  // 1. GRID
  if (mode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {spots.map(spot => (
          <ParkingSpotButton key={spot.id} spot={spot} onToggle={undefined} />
        ))}
      </div>
    );
  }

  const rows = spots.reduce((acc, spot) => {
    const r = spot.row || 1;
    if (!acc[r]) acc[r] = [];
    acc[r].push(spot);
    return acc;
  }, {});
  const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

  // 2. ROWS
  if (mode === 'rows') {
    return (
      <div className="space-y-6">
        {sortedRows.map(rowNum => (
          <div key={rowNum} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-2">
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Fila {rowNum}</span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            <div className="flex flex-wrap gap-4">
              {rows[rowNum].map(spot => (
                <div key={spot.id} className="flex-1 min-w-[130px] max-w-[160px]">
                   <ParkingSpotButton spot={spot} onToggle={undefined} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. STREET
  if (mode === 'street') {
    return (
      <div className="relative bg-slate-800 p-8 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] border-4 border-slate-700">
        {/* Calle Central */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
           <div className="h-full w-24 bg-slate-700/30 border-x-2 border-dashed border-yellow-400/40"></div>
        </div>

        <div className="flex justify-between gap-12 relative z-10 h-full">
          {/* Izquierda */}
          <div className="flex-1 flex flex-col gap-6 justify-center pr-8">
            {sortedRows.filter(r => r % 2 !== 0).map(r => (
               <div key={r} className="flex gap-3 justify-end">
                 {rows[r].map(spot => (
                   <div key={spot.id} className="w-32 transform hover:scale-105 transition-transform">
                     <ParkingSpotButton spot={spot} onToggle={undefined} />
                   </div>
                 ))}
               </div>
            ))}
          </div>

          {/* Derecha */}
          <div className="flex-1 flex flex-col gap-6 justify-center pl-8">
             {sortedRows.filter(r => r % 2 === 0).map(r => (
               <div key={r} className="flex gap-3 justify-start">
                 {rows[r].map(spot => (
                   <div key={spot.id} className="w-32 transform hover:scale-105 transition-transform">
                     <ParkingSpotButton spot={spot} onToggle={undefined} />
                   </div>
                 ))}
               </div>
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 text-center">
           <span className="bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded border border-yellow-400/20 text-xs font-bold uppercase tracking-[0.3em]">Zona de Tráfico</span>
        </div>
      </div>
    );
  }
  
  return null;
}