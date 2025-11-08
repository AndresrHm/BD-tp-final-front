import type { ParkingSpot, MetricPoint } from "../types";

// Simulamos el esquema del backend (SQLAlchemy) internamente y exponemos
// al frontend la forma que espera. Esto facilita integrar con el backend real
// sin cambiar la UI.

type BackendParkingSpot = {
  id: number;
  slot_number: number;
  row: number;
  spot_status: string; // e.g. 'occupied' | 'free'
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Datos mock en formato backend
const backendMock: Record<string, BackendParkingSpot[]> = {
  cam1: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, slot_number: i + 1, row: 1, spot_status: i % 3 === 0 ? "occupied" : "free" })),
  cam2: Array.from({ length: 6 }, (_, i) => ({ id: 11 + i, slot_number: i + 1, row: 2, spot_status: i % 4 === 0 ? "occupied" : "free" })),
  cam3: Array.from({ length: 10 }, (_, i) => ({ id: 21 + i, slot_number: i + 1, row: 3, spot_status: i % 2 === 0 ? "occupied" : "free" })),
};

function toFrontend(b: BackendParkingSpot): ParkingSpot {
  return {
    id: b.id,
    label: `R${b.row}-S${b.slot_number}`,
    ocupado: b.spot_status === "occupied",
  };
}

export async function getParkingStatus(camera: string): Promise<ParkingSpot[]> {
  await sleep(150);
  const data = backendMock[camera] ?? [];
  // Convertimos al formato que usa el frontend
  return data.map(toFrontend);
}

export async function toggleSpot(id: number): Promise<void> {
  await sleep(80);
  for (const cam of Object.keys(backendMock)) {
    const found = backendMock[cam].find((s) => s.id === id);
    if (found) {
      found.spot_status = found.spot_status === "occupied" ? "free" : "occupied";
      return;
    }
  }
  throw new Error(`Plaza con id=${id} no encontrada en mocks`);
}

export async function getMetrics(): Promise<MetricPoint[]> {
  await sleep(120);
  // Genera 12 puntos horarios (por ejemplo últimas 12 horas) con valores mock
  const now = new Date();
  const points: MetricPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = d.getHours().toString().padStart(2, "0") + ":00";
    const ocupacion = 20 + ((d.getHours() * 37) % 60);
    points.push({ hora: hour, ocupacion });
  }
  return points;
}
