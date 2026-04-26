const cx = (...classes) => classes.filter(Boolean).join(' ');

export function RoleActionGrid({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <button key={item.title} type="button" className="role-action-card rounded-[18px] p-3 text-left">
            <span className="role-action-icon grid h-9 w-9 place-items-center rounded-[14px]">
              <Icon className="text-[16px]" />
            </span>
            <span className="mt-3 block break-words text-[13px] font-black leading-5">{item.title}</span>
            <span className="block break-words text-[11px] font-bold leading-4 text-slate-500">{item.helper}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RoleSectionCard({ eyebrow, title, description, trailing, align = 'center', className = '' }) {
  const alignClass = align === 'start' ? 'items-start' : 'items-center';

  return (
    <section className={cx('role-section-card flex justify-between gap-3 rounded-[18px] p-3', alignClass, className)}>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
        <h2 className="text-[15px] font-black leading-5">{title}</h2>
        {description && <p className="mt-0.5 break-words text-[11px] font-bold leading-4 text-slate-500">{description}</p>}
      </div>
      {trailing}
    </section>
  );
}

export function RoleListCard({ eyebrow, title, subtitle, leading, trailing, titleClassName = 'text-[13px]', className = '' }) {
  return (
    <div className={cx('role-list-card flex items-center justify-between gap-3 rounded-[18px] p-3', className)}>
      <div className={leading ? 'flex min-w-0 items-center gap-3' : 'min-w-0'}>
        {leading}
        <div className="min-w-0">
          {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.14em] text-royal">{eyebrow}</p>}
          <h3 className={cx('break-words font-black leading-5', titleClassName)}>{title}</h3>
          {subtitle && <p className="break-words text-[11px] font-bold leading-4 text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {trailing}
    </div>
  );
}
