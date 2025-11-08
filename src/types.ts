export type ParkingSpot = {
  id: number;
  label?: string;
  ocupado: boolean;
};

export type MetricPoint = {
  hora: string;
  ocupacion: number;
};
