import type { ParkingSpot, MetricPoint } from '../types'

// Simulamos el esquema del backend (SQLAlchemy) internamente y exponemos
// al frontend la forma que espera. Esto facilita integrar con el backend real
// sin cambiar la UI.

type BackendParkingSpot = {
  id: number;
  slot_number: number;
  row: number;
  spot_status: string; // e.g. 'occupied' | 'free'
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Datos mock en formato backend
const backendMock: Record<string, BackendParkingSpot[]> = {
  cam1: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, slot_number: i + 1, row: 1, spot_status: i % 3 === 0 ? 'occupied' : 'free' })),
  cam2: Array.from({ length: 6 }, (_, i) => ({ id: 11 + i, slot_number: i + 1, row: 2, spot_status: i % 4 === 0 ? 'occupied' : 'free' })),
  cam3: Array.from({ length: 10 }, (_, i) => ({ id: 21 + i, slot_number: i + 1, row: 3, spot_status: i % 2 === 0 ? 'occupied' : 'free' })),
}

function toFrontend(b: BackendParkingSpot): ParkingSpot {
  return {
    id: b.id,
    label: `R${b.row}-S${b.slot_number}`,
    ocupado: b.spot_status === 'occupied',
  }
}

export async function getParkingStatus(camera: string): Promise<ParkingSpot[]> {
  await sleep(150)
  const data = backendMock[camera] ?? []
  // Convertimos al formato que usa el frontend
  return data.map(toFrontend)
}

export async function toggleSpot(id: number): Promise<void> {
  await sleep(80)
  for (const cam of Object.keys(backendMock)) {
    const found = backendMock[cam].find((s) => s.id === id)
    if (found) {
      found.spot_status = found.spot_status === 'occupied' ? 'free' : 'occupied'
      return
    }
  }
  throw new Error(`Plaza con id=${id} no encontrada en mocks`)
}

// Esto para "Métricas"
export async function getMetrics(): Promise<MetricPoint[]> {
  await sleep(120)
  // Genera 12 puntos horarios (por ejemplo últimas 12 horas) con valores mock
  const now = new Date()
  const points: MetricPoint[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = d.getHours().toString().padStart(2, '0') + ':00'
    const ocupacion = 20 + ((d.getHours() * 37) % 60)
    points.push({ hora: hour, ocupacion })
  }
  return points
}

const API_URL = 'http://localhost:8000/analytics';

// Helper para manejar errores de fetch
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// 1. Porcentaje de ocupación por imagen (cámara)
export async function getOccupancyPct(imageName: string): Promise<number> {
  // El backend retorna { "image": "...", "occupancy_pct": 0.5 }
  const data = await fetchAPI<{ occupancy_pct: number }>(`/occupancy/${imageName}`);
  return data.occupancy_pct;
}

// 2. Plazas más usadas (Top Spots)
export async function getTopSpots(): Promise<any[]> {
  const data = await fetchAPI<{ top_spots: any[] }>('/top_spots');
  return data.top_spots;
}

// 3. Fila más usada
export async function getTopRow(): Promise<string | number> {
  const data = await fetchAPI<{ row: string | number }>('/top_row');
  return data.row;
}

// 4. Uso excesivo actual (coches que llevan mucho tiempo)
export async function getCurrentExcessive(): Promise<string | number> {
  const data = await fetchAPI<{ spot: string | number }>('/current_excessive');
  return data.spot;
}

// 5. Hora pico histórica
export async function getPeakHour(): Promise<string> {
  const data = await fetchAPI<{ hour: string }>('/peak_hour');
  return data.hour;
}

// 6. Hora menos concurrida histórica
export async function getLeastBusyHour(): Promise<string> {
  const data = await fetchAPI<{ hour: string }>('/least_busy_hour');
  return data.hour;
}