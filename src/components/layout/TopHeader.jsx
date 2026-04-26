import { FiBell, FiLogOut } from 'react-icons/fi';
import { useUserStore } from '../../store/userStore.js';

export default function TopHeader({ title, subtitle, onLogout }) {
  const user = useUserStore((state) => state.user);

  return (
    <header className="glass-dark rounded-[20px] p-3 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gold">{subtitle}</p>
          <h1 className="mt-1 break-words text-[20px] font-black leading-6 tracking-normal">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-[14px] bg-white/10 text-white transition hover:bg-white/15" type="button" title="Notifikasi">
            <FiBell className="text-[15px]" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-[14px] bg-white/10 text-white transition hover:bg-white/15" type="button" title="Keluar" onClick={onLogout}>
            <FiLogOut className="text-[15px]" />
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-[14px] bg-gold text-[12px] font-black text-navy">{user.avatar}</div>
        </div>
      </div>
    </header>
  );
}
