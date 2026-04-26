export default function StatCard({ icon: Icon, label, value, helper, tone = 'royal' }) {
  const safeTone = ['royal', 'gold', 'success', 'danger', 'warning'].includes(tone) ? tone : 'royal';

  return (
    <article className={`stat-card stat-tone-${safeTone} min-w-0 rounded-[18px] p-3`}>
      <div className="flex min-h-8 items-start justify-between gap-2">
        <span className="stat-icon-chip grid h-8 w-8 shrink-0 place-items-center rounded-[13px]">
          <Icon className="text-[15px]" />
        </span>
        <span className="stat-label-badge min-w-0 break-words rounded-full px-2 py-1 text-right text-[10px] font-black leading-3">
          {label}
        </span>
      </div>
      <p className="stat-value mt-3 min-w-0 break-words text-[19px] font-black leading-6">{value}</p>
      {helper && <p className="stat-helper mt-1 break-words text-[11px] font-bold leading-4">{helper}</p>}
    </article>
  );
}
