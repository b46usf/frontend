export default function ProfileStatusPanel({ eyebrow = 'Ringkasan', title, description, items }) {
  return (
    <section className="profile-status-card rounded-[20px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
          <h3 className="mt-1 break-words text-[15px] font-black leading-5">{title}</h3>
          {description && <p className="mt-1 break-words text-[11px] font-bold leading-4 text-slate-500">{description}</p>}
        </div>
      </div>

      <div className="profile-status-list mt-3 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const tone = item.tone || 'royal';

          return (
            <article key={item.label} className={`profile-status-row profile-status-${tone} rounded-[15px] p-2.5`}>
              <span className="profile-status-icon grid h-9 w-9 shrink-0 place-items-center rounded-[13px]">
                <Icon className="text-[16px]" />
              </span>
              <div className="min-w-0">
                <p className="break-words text-[10px] font-black uppercase leading-3 tracking-[0.12em]">{item.label}</p>
                <strong className="mt-1 block break-words text-[13px] font-black leading-5">{item.value}</strong>
                {item.helper && <span className="block break-words text-[10px] font-bold leading-3">{item.helper}</span>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
