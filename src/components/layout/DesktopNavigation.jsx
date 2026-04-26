export default function DesktopNavigation({ items, active, onChange }) {
  return (
    <aside className="desktop-nav">
      <div className="desktop-nav-brand">
        <span className="desktop-nav-mark">ES</span>
        <div className="desktop-nav-copy">
          <p>EduSense AI</p>
          <h2>Learning OS</h2>
        </div>
      </div>

      <div className="desktop-nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`desktop-nav-item ${isActive ? 'is-active' : ''}`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon className="desktop-nav-icon" />
              <span className="desktop-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
