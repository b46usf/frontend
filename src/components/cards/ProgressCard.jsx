const clampPercent = (number) => Math.min(100, Math.max(0, Number(number) || 0));

export default function ProgressCard({ title, value, caption, target = 100 }) {
  const progress = clampPercent(value);
  const targetValue = clampPercent(target);
  const remaining = Math.max(targetValue - progress, 0);
  const status = progress >= targetValue ? 'Target tercapai' : `${remaining}% lagi`;

  return (
    <article className="progress-card rounded-[18px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-[14px] font-black leading-5">{title}</h3>
          <p className="progress-caption mt-0.5 break-words text-[12px] font-semibold leading-4">{caption}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="progress-value block text-[22px] font-black leading-7">{progress}%</span>
          <span className="progress-status block text-[10px] font-black leading-3">{status}</span>
        </div>
      </div>

      <dl className="progress-metrics mt-3 grid grid-cols-3 gap-2">
        <div>
          <dt>Saat ini</dt>
          <dd>{progress}%</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{targetValue}%</dd>
        </div>
        <div>
          <dt>Sisa</dt>
          <dd>{remaining}%</dd>
        </div>
      </dl>

      <div className="progress-track mt-3">
        <span className="progress-fill" style={{ width: `${progress}%` }} />
        {targetValue > 0 && targetValue < 100 && <span className="progress-target-marker" style={{ left: `${targetValue}%` }} />}
      </div>

      <div className="progress-scale mt-1.5 flex items-center justify-between text-[10px] font-black leading-3">
        <span>0%</span>
        <span>Target {targetValue}%</span>
        <span>100%</span>
      </div>
    </article>
  );
}
