import { FiActivity, FiClock, FiRepeat, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';

const defaultMetrics = {
  student: [
    { label: 'Rata-rata', value: '84', helper: '6 sesi', icon: FiTrendingUp, tone: 'royal' },
    { label: 'Akurasi', value: '86%', helper: 'stabil', icon: FiTarget, tone: 'success' },
    { label: 'Waktu', value: '09m', helper: 'per kuis', icon: FiClock, tone: 'gold' },
    { label: 'Percobaan', value: '12', helper: 'bulan ini', icon: FiRepeat, tone: 'royal' },
    { label: 'Konsisten', value: '78%', helper: '4 hari aktif', icon: FiActivity, tone: 'success' },
    { label: 'Engage', value: '82%', helper: 'tinggi', icon: FiZap, tone: 'gold' },
  ],
  teacher: [
    { label: 'Rata-rata', value: '82', helper: 'kelas XI', icon: FiTrendingUp, tone: 'royal' },
    { label: 'Akurasi', value: '79%', helper: 'kuis terbaru', icon: FiTarget, tone: 'success' },
    { label: 'Waktu', value: '11m', helper: 'median', icon: FiClock, tone: 'gold' },
    { label: 'Percobaan', value: '342', helper: 'minggu ini', icon: FiRepeat, tone: 'royal' },
    { label: 'Konsisten', value: '71%', helper: 'kelas aktif', icon: FiActivity, tone: 'success' },
    { label: 'Engage', value: '76%', helper: '4 hari aktif', icon: FiZap, tone: 'gold' },
  ],
};

export default function PerformanceTrendPanel({ role = 'student', title = 'Performance Trend' }) {
  const metrics = defaultMetrics[role] || defaultMetrics.student;

  return (
    <section className="trend-panel rounded-[20px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Dashboard Tren</p>
          <h3 className="mt-1 break-words text-[15px] font-black leading-5">{title}</h3>
        </div>
        <span className="trend-badge rounded-full px-2.5 py-1 text-[10px] font-black leading-3">6 metrik</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
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
