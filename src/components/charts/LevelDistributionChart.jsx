import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const fallbackData = [
  { name: 'Dasar', value: 28, color: '#F59E0B' },
  { name: 'Menengah', value: 46, color: '#155EEF' },
  { name: 'Lanjutan', value: 26, color: '#22C55E' },
];

export default function LevelDistributionChart({ data = fallbackData }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={4}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
