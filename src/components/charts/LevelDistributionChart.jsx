import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function LevelDistributionChart({ data = [] }) {
  const hasData = data.some((entry) => Number(entry.value || 0) > 0);

  if (!hasData) {
    return (
      <div className="grid h-full min-h-40 place-items-center px-4 text-center">
        <p className="text-[12px] font-bold text-slate-500">Belum ada distribusi level.</p>
      </div>
    );
  }

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
