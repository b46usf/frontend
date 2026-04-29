import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const fallbackData = [
  { name: 'Sen', nilai: 72 },
  { name: 'Sel', nilai: 78 },
  { name: 'Rab', nilai: 74 },
  { name: 'Kam', nilai: 86 },
  { name: 'Jum', nilai: 90 },
  { name: 'Sab', nilai: 84 },
];

export default function PerformanceLineChart({ data = fallbackData }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 10, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey="nilai" stroke="#155EEF" strokeWidth={4} dot={{ r: 4, fill: '#F5B942' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
