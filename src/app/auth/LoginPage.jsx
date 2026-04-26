import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiBookOpen, FiClipboard, FiLock, FiMail, FiShield, FiTrendingUp, FiUserCheck, FiUsers } from 'react-icons/fi';
import { authenticate } from '../../services/authService.js';
import { useUserStore } from '../../store/userStore.js';
import { showToast } from '../../utils/alerts.js';

const roles = [
  { id: 'student', label: 'Siswa', helper: 'Belajar adaptif, kuis AI, dan progres pribadi.', caption: 'Belajar', badge: 'Kuis AI', icon: FiBookOpen, tone: 'student' },
  { id: 'teacher', label: 'Guru', helper: 'Pantau kelas, tugas, risiko siswa, dan penilaian.', caption: 'Kelas', badge: 'Analitik', icon: FiClipboard, tone: 'teacher' },
  { id: 'admin', label: 'Admin', helper: 'Kelola akun, kelas, mapel, dan sinkronisasi data.', caption: 'Data', badge: 'Sekolah', icon: FiShield, tone: 'admin' },
];

export default function LoginPage() {
  const login = useUserStore((state) => state.login);
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('student');
  const selectedRole = roles.find((item) => item.id === role) || roles[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await authenticate({ role });

    if (response.ok) {
      login(role);
      showToast({ title: `${mode === 'login' ? 'Masuk' : 'Pendaftaran'} berhasil` });
    }
  };

  return (
    <main className="auth-root sm:flex sm:justify-center">
      <section className="auth-screen relative min-h-screen w-full overflow-hidden px-4 py-4 sm:max-w-[430px]">
        <div className="relative z-10 flex min-h-[calc(100vh-2rem)] flex-col justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
            <div className="flex items-center justify-between">
              <p className="auth-eyebrow text-[12px] font-black uppercase tracking-[0.24em]">EduSense AI</p>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-200">
                Seluler
              </span>
            </div>
            <h1 className="mt-4 max-w-[19rem] text-[30px] font-black leading-[1.08] tracking-normal text-white sm:text-4xl">
              Beranda belajar yang lebih cerdas.
            </h1>
            <p className="mt-3 max-w-[22rem] text-[13px] font-semibold leading-6 text-slate-200">
              Pembelajaran adaptif, kuis otomatis, kemajuan siswa, dan analitik sekolah dalam satu aplikasi.
            </p>
          </motion.div>

            <div className="grid grid-cols-3 gap-2">
              {[
                [FiTrendingUp, 'Adaptif'],
                [FiBarChart2, 'Progres'],
                [FiUsers, 'Multi Peran'],
              ].map(([Icon, label]) => (
                <div key={label} className="auth-shell-card rounded-[18px] px-2 py-3 text-center backdrop-blur">
                  <Icon className="mx-auto text-lg text-gold" />
                <p className="mt-2 text-[11px] font-black text-slate-100">{label}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-panel rounded-[24px] p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="auth-panel-kicker text-[11px] font-black uppercase tracking-[0.16em]">
                  {mode === 'login' ? 'Masuk akun' : 'Pendaftaran'}
                </p>
                <h2 className="mt-1 text-xl font-black tracking-normal">
                  {mode === 'login' ? 'Akses beranda' : 'Buat akun baru'}
                </h2>
              </div>
              <span className="rounded-full bg-gold/18 px-3 py-1 text-[11px] font-black text-gold">Demo</span>
            </div>
            <p className="auth-panel-copy mt-1 text-xs font-semibold leading-5">
              Pilih peran, lalu masuk menggunakan akun sekolah.
            </p>

            <div className="auth-segment mt-4 grid grid-cols-2 rounded-[18px] p-1">
              {['login', 'register'].map((item) => {
                const active = mode === item;
                const label = item === 'login' ? 'Masuk' : 'Daftar';

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-[14px] px-3 py-2.5 text-sm font-black transition ${active ? 'auth-segment-active' : 'auth-segment-idle'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="auth-role-section mt-4 rounded-[20px] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="auth-role-kicker text-[10px] font-black uppercase leading-3 tracking-[0.16em]">Pilih Peran</p>
                  <h3 className="mt-1 text-[13px] font-black leading-4">Akses sesuai kebutuhan</h3>
                </div>
                <span className="auth-role-badge shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black leading-3">
                  {selectedRole.badge}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {roles.map((item) => {
                  const Icon = item.icon;
                  const active = role === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`auth-role auth-role-${item.tone} rounded-[18px] px-2 py-3 text-center transition ${active ? 'auth-role-active' : ''}`}
                    >
                      <span className="auth-role-icon mx-auto grid h-9 w-9 place-items-center rounded-2xl">
                        <Icon className="text-lg" />
                      </span>
                      <span className="auth-role-label mt-2 block text-[12px] font-black leading-4">{item.label}</span>
                      <span className="auth-role-caption mt-0.5 block text-[10px] font-bold leading-3">{item.caption}</span>
                    </button>
                  );
                })}
              </div>

              <p className="auth-role-detail mt-3 rounded-[16px] px-3 py-2 text-[11px] font-bold leading-4">
                {selectedRole.helper}
              </p>
            </div>

            {mode === 'register' && (
              <label className="auth-field mt-3 flex h-12 items-center gap-3 rounded-[18px] px-3.5">
                <FiUserCheck className="shrink-0 text-royal" />
                <span className="sr-only">Nama lengkap</span>
                <input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Nama lengkap" />
              </label>
            )}
            <label className="auth-field mt-3 flex h-12 items-center gap-3 rounded-[18px] px-3.5">
              <FiMail className="shrink-0 text-royal" />
              <span className="sr-only">Email sekolah</span>
              <input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Email sekolah" defaultValue="demo@edusense.ai" />
            </label>
            <label className="auth-field mt-2.5 flex h-12 items-center gap-3 rounded-[18px] px-3.5">
              <FiLock className="shrink-0 text-royal" />
              <span className="sr-only">Password</span>
              <input className="w-full bg-transparent text-sm font-bold outline-none" placeholder="Password" type="password" defaultValue="demo12345" />
            </label>
            <button type="submit" className="auth-primary mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] px-4 text-sm font-black transition active:scale-[0.99]">
              {mode === 'login' ? 'Masuk Beranda' : 'Buat Akun'}
              <FiArrowRight />
            </button>
            <p className="auth-footnote mt-3 text-center text-[11px] font-bold">
              Data demo siap digunakan untuk semua peran.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
