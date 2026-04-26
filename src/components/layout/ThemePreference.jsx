import { FiMoon, FiSun } from 'react-icons/fi';
import { useUserStore } from '../../store/userStore.js';

const options = [
  { id: 'light', label: 'Terang', icon: FiSun },
  { id: 'dark', label: 'Gelap', icon: FiMoon },
];

export default function ThemePreference() {
  const { theme, setTheme } = useUserStore();

  return (
    <section className="theme-card rounded-[18px] p-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-royal">Tema</p>
          <h3 className="mt-0.5 break-words text-[14px] font-black leading-5">Tampilan Aplikasi</h3>
        </div>
        <div className="theme-segment grid shrink-0 grid-cols-2 rounded-[15px] p-1">
          {options.map((option) => {
            const Icon = option.icon;
            const active = theme === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                className={`flex h-9 items-center justify-center gap-1.5 rounded-[12px] px-2.5 text-[11px] font-black transition ${active ? 'theme-segment-active' : 'theme-segment-idle'}`}
              >
                <Icon />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
