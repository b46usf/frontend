import { FiAward } from 'react-icons/fi';

export default function BadgeCard({ title, subtitle }) {
  return (
    <article className="badge-card flex items-center gap-3 rounded-[18px] p-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[15px] bg-gold/20 text-gold">
        <FiAward className="text-[18px]" />
      </div>
      <div className="min-w-0">
        <h3 className="break-words text-[13px] font-black leading-5">{title}</h3>
        <p className="break-words text-[11px] font-bold leading-4 text-slate-500">{subtitle}</p>
      </div>
    </article>
  );
}
