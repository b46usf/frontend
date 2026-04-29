import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PerformanceLineChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="grid h-full min-h-40 place-items-center px-4 text-center">
        <p className="text-[12px] font-bold text-slate-500">Belum ada data tren performa.</p>
      </div>
    );
  }

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
