import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

export interface ParkingSpot {
  id: number | string;
  ocupado: boolean;
  label: string;
  row: number;
  slot_number: number;
}

export interface ParkingSpotButtonProps {
  spot: ParkingSpot;
  onToggle?: (id: number | string) => void;
}

export interface ParkingLiveViewProps {
  cameraName: string;
}

export interface VisualizerGridProps {
  spots: ParkingSpot[];
  mode: 'grid' | 'rows' | 'street';
}

//  * COMPONENTE: Botón con Estilos Tailwind
const ParkingSpotButton = ({ spot, onToggle }: ParkingSpotButtonProps) => {
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

export default function ParkingLiveView({ cameraName }: ParkingLiveViewProps) {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
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
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpots();
    const interval = setInterval(fetchSpots, 5000);
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
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 capitalize ${viewMode === mode
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
function VisualizerGrid({ spots, mode }: VisualizerGridProps) {

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


  // 2. ROWS
  if (mode === 'rows') {
    const rows = spots.reduce((acc, spot) => {
      const r = spot.row || 1;
      if (!acc[r]) acc[r] = [];
      acc[r].push(spot);
      return acc;
    }, {});
    const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));
    
    return (
      <div className="space-y-6">
        {sortedRows.map(rowNum => (
          <div key={rowNum} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4 border-b border-slate-100 pb-2">
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Fila {rowNum}</span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {rows[rowNum].map(spot => (
                <div key={spot.id} className="w-[150px] max-w-[150px] flex-shrink-0">
                  <ParkingSpotButton spot={spot} onToggle={undefined} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * LÓGICA VISUAL ACTUALIZADA
   */

  // Agrupar por filas
  const rows = spots.reduce((acc, spot) => {
    const r = spot.row || 1;
    if (!acc[r]) acc[r] = [];
    acc[r].push(spot);
    return acc;
  }, {});

  // Ordenar filas numéricamente
  const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

  // MODO STREET / PASILLO REFACTORIZADO
  if (mode === 'street') {
    // 1. Crear Pares: [[1,2], [3,4], ...]
    const rowPairs = [];
    for (let i = 0; i < sortedRows.length; i += 2) {
      const bottomRow = sortedRows[i];     // Ej: Fila 1
      const topRow = sortedRows[i + 1];    // Ej: Fila 2 (si existe)
      rowPairs.push({ bottom: bottomRow, top: topRow });
    }

    return (
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border-4 border-slate-700 w-full min-h-[600px] flex flex-col justify-end relative overflow-hidden">

        {/* Fondo decorativo de asfalto */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* CONTENEDOR PRINCIPAL
            flex-col-reverse: Hace que el primer par (Fila 1-2) se renderice ABAJO 
            y los siguientes ARRIBA. Cumpliendo "de abajo hacia arriba".
            gap-24: Es el PASILLO (calle ancha) entre bloques de filas.
        */}
        <div className="flex flex-col-reverse gap-24 relative z-10 w-full h-full justify-start overflow-y-auto">

          {rowPairs.map((pair, idx) => (
            <div key={idx} className="relative w-full">

              {/* BLOQUE DE PARES (Ej: Fila 2 arriba, Fila 1 abajo) */}
              <div className="flex flex-col w-full bg-slate-900/50 rounded-lg border border-slate-600/30 p-2">

                {/* FILA SUPERIOR DEL PAR (Ej: Fila 2) */}
                {/* Se renderiza primero visualmente dentro del bloque */}
                {pair.top && (
                  <div className="flex justify-center gap-2 w-full mb-1">
                    {rows[pair.top].map(spot => (
                      <div key={spot.id} className="flex-1 min-w-0"> {/* flex-1 hace el "zoom automático" */}
                        <ParkingSpotButton spot={spot} />
                      </div>
                    ))}
                  </div>
                )}

                {/* LÍNEA DIVISORIA FINA (Espalda con espalda) */}
                {pair.top && pair.bottom && (
                  <div className="h-0 border-t-2 border-dashed border-slate-500 w-full my-1 opacity-50 relative">
                    {/* Etiqueta pequeña de separación */}
                    <span className="absolute right-0 -top-2 text-[10px] text-slate-500 bg-slate-800 px-1">Muro</span>
                  </div>
                )}

                {/* FILA INFERIOR DEL PAR (Ej: Fila 1) */}
                <div className="flex justify-center gap-2 w-full mt-1">
                  {rows[pair.bottom].map(spot => (
                    <div key={spot.id} className="flex-1 min-w-0">
                      <ParkingSpotButton spot={spot} />
                    </div>
                  ))}
                </div>

              </div>

              {/* DECORACIÓN DE PASILLO (Solo visual, aparece 'encima' del gap) */}
              {/* Esta etiqueta flota en el espacio creado por el gap-24 del padre */}
              <div className="absolute -top-16 left-0 w-full flex items-center justify-center pointer-events-none">
                <div className="h-8 w-full border-x border-yellow-500/20 flex items-center justify-center">
                  <span className="text-yellow-500/40 font-bold tracking-[1em] text-xs uppercase">Pasillo de Circulación</span>
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Entrada (Decoración visual abajo del todo) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
      </div>
    );
  }


  return null;
}