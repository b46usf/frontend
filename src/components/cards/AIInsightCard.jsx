import { FiZap } from 'react-icons/fi';

export default function AIInsightCard({ text, action = 'Lihat rekomendasi' }) {
  return (
    <article className="ai-card rounded-[20px] p-3.5">
      <div className="flex items-start gap-3">
        <div className="ai-icon-chip grid h-8 w-8 shrink-0 place-items-center rounded-[13px]">
          <FiZap className="text-[15px]" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gold">Wawasan AI</p>
          <p className="ai-card-copy mt-1.5 text-[12px] font-bold leading-5">{text}</p>
          <button className="mt-2.5 rounded-[14px] bg-royal px-3.5 py-2 text-[11px] font-black text-white shadow-[0_10px_24px_rgba(21,94,239,0.24)]" type="button">
            {action}
          </button>
        </div>
      </div>
    </article>
  );
}
