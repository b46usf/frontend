import { FiArrowRight, FiAward, FiBookOpen, FiCheckCircle, FiClock, FiCpu, FiEdit3, FiFlag, FiMapPin, FiZap } from 'react-icons/fi';
import MiniMetricGrid from '../cards/MiniMetricGrid.jsx';

export default function LearningPathCard({ level, subject, progress, lessons = 12 }) {
  const steps = ['Dasar', 'Menengah', 'Lanjutan'];
  const activeIndex = Math.max(0, steps.indexOf(level));
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));
  const mapNodes = [
    { label: 'Start', icon: FiMapPin },
    { label: 'Materi Dasar', icon: FiBookOpen },
    { label: 'Latihan 1', icon: FiEdit3 },
    { label: 'Kuis Adaptif', icon: FiZap },
    { label: 'Materi Lanjutan', icon: FiBookOpen },
    { label: 'Challenge', icon: FiFlag },
    { label: 'Mastery Badge', icon: FiAward },
  ];
  const activeNode = Math.min(mapNodes.length - 1, Math.floor(safeProgress / (100 / mapNodes.length)));
  const metrics = [
    { label: 'Selesai', value: `${safeProgress}%`, icon: FiCheckCircle, tone: 'success' },
    { label: 'Materi', value: lessons, icon: FiClock, tone: 'royal' },
    { label: 'Adaptif', value: 'AI', icon: FiCpu, tone: 'gold' },
  ];

  return (
    <article className="learn-path-card rounded-[20px] p-3.5">
      <div className="flex items-center gap-3">
        <div className="learn-path-main-icon grid h-10 w-10 shrink-0 place-items-center rounded-[15px]">
          <FiBookOpen className="text-[17px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="learn-path-kicker text-[10px] font-black uppercase tracking-[0.16em]">Predictive Learning Path</p>
          <h3 className="break-words text-[15px] font-black leading-5">{subject} {level}</h3>
        </div>
        <span className="learn-path-level shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black leading-3">
          Lv {activeIndex + 1}/3
        </span>
        <button className="learn-path-action grid h-9 w-9 shrink-0 place-items-center rounded-[14px]" type="button" title="Detail jalur belajar">
          <FiArrowRight className="text-[17px]" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px] font-black">
        {steps.map((item, index) => (
          <span key={item} className={`learn-step rounded-[13px] px-2 py-2 ${index < activeIndex ? 'is-done' : ''} ${item === level ? 'is-active' : ''}`}>
            {item}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="learn-path-progress-label text-[11px] font-black leading-4">Progress jalur</span>
        <span className="learn-path-progress-value text-[11px] font-black leading-4">{safeProgress}%</span>
      </div>
      <div className="learn-path-track mt-1.5">
        <span style={{ width: `${safeProgress}%` }} />
      </div>

      <div className="learn-map mt-3 rounded-[18px] p-3">
        <div className="grid grid-cols-7 items-start gap-1">
          {mapNodes.map((node, index) => {
            const Icon = node.icon;
            const done = index < activeNode;
            const active = index === activeNode;

            return (
              <div key={node.label} className={`learn-map-node ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
                <span className="learn-map-dot mx-auto grid h-8 w-8 place-items-center rounded-full">
                  <Icon className="text-[14px]" />
                </span>
                <span className="mt-1 block break-words text-center text-[9px] font-black leading-3">{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <MiniMetricGrid metrics={metrics} variant="learningPath" />

      <div className="learn-path-next mt-3 rounded-[15px] px-3 py-2">
        <p className="text-[10px] font-black uppercase leading-3 tracking-[0.14em]">Langkah berikutnya</p>
        <p className="mt-1 break-words text-[12px] font-bold leading-4">Selesaikan 2 materi lagi, lalu ambil Challenge untuk membuka Mastery Badge.</p>
      </div>
    </article>
  );
}
