import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type MetricPoint = {
  hora: string;
  ocupacion: number;
};

type Props = {
  data: MetricPoint[];
  height?: number;
};

export default function MetricsChart({ data, height = 300 }: Props) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="hora" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ocupacion" stroke="#4f46e5" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
