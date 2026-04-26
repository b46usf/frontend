export default function BottomNavigation({ items, active, onChange }) {
  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-2.5 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-16px_40px_rgba(7,26,47,0.12)] backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`bottom-nav-item flex h-[52px] flex-col items-center justify-center rounded-[16px] text-[10px] font-bold transition ${isActive ? 'is-active' : ''}`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="mb-1 text-[18px]" />
              <span className="max-w-full text-center leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
