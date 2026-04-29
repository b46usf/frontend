import { FiActivity, FiClock, FiRepeat, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';

export default function PerformanceTrendPanel({ role = 'student', title = 'Performance Trend', metrics: providedMetrics }) {
  const metrics = providedMetrics || [];

  return (
    <section className="trend-panel rounded-[20px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Dashboard Tren</p>
          <h3 className="mt-1 break-words text-[15px] font-black leading-5">{title}</h3>
        </div>
        <span className="trend-badge rounded-full px-2.5 py-1 text-[10px] font-black leading-3">{metrics.length} metrik</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {metrics.length === 0 && (
          <div className="col-span-2 rounded-[15px] p-3 text-center text-[12px] font-bold text-slate-500">
            Belum ada metrik performa.
          </div>
        )}
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article key={metric.label} className={`trend-metric trend-${metric.tone} rounded-[15px] p-2.5`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-words text-[10px] font-black uppercase leading-3 tracking-[0.12em]">{metric.label}</p>
                  <strong className="mt-1 block text-[17px] font-black leading-5">{metric.value}</strong>
                  <span className="mt-0.5 block text-[10px] font-bold leading-3">{metric.helper}</span>
                </div>
                <span className="trend-icon grid h-8 w-8 shrink-0 place-items-center rounded-[12px]">
                  <Icon className="text-[15px]" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
