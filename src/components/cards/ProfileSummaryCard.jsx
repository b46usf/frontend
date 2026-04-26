import MiniMetricGrid from './MiniMetricGrid.jsx';

export default function ProfileSummaryCard({ eyebrow, name, subtitle, avatar, metrics }) {
  return (
    <section className="profile-card rounded-[20px] p-3.5">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[19px] bg-royal text-[17px] font-black text-white">{avatar}</div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
          <h2 className="mt-1 break-words text-[17px] font-black leading-6">{name}</h2>
          <p className="break-words text-[12px] font-bold leading-4 text-slate-500">{subtitle}</p>
        </div>
      </div>
      <MiniMetricGrid metrics={metrics} variant="profile" />
    </section>
  );
}
