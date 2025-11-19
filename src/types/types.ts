export interface ParkingSpot {
  id: number;
  label: string;
  ocupado: boolean;
}

export interface MetricPoint {
  hora: string;
  ocupacion: number;
}

// Nuevas interfaces para las respuestas de Analytics
export interface AnalyticsResponse {
  occupancy_pct?: number;
  top_spots?: any[]; // Ajustar según la estructura exacta de tu 'result'
  row?: string | number;
  spot?: string | number;
  hour?: string;
}

export interface DashboardMetrics {
  occupancyPct: number;
  topRow: string | number;
  peakHour: string;
  leastBusyHour: string;
  currentExcessive: string | number | null;
}