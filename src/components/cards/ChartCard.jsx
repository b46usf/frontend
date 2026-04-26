export default function ChartCard({ title, subtitle, children }) {
  return (
    <article className="chart-card rounded-[20px] p-3.5">
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-[14px] font-black leading-5">{title}</h3>
          <p className="break-words text-[11px] font-bold leading-4 text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="h-44">{children}</div>
    </article>
  );
}
