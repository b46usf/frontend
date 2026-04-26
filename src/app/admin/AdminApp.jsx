import { useState } from 'react';
import { FiBarChart2, FiBookOpen, FiBriefcase, FiCheckCircle, FiDatabase, FiHome, FiKey, FiLogOut, FiRefreshCw, FiSettings, FiShield, FiUploadCloud, FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import AppShell from '../../components/layout/AppShell.jsx';
import SearchBar from '../../components/layout/SearchBar.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ProgressCard from '../../components/cards/ProgressCard.jsx';
import AIInsightCard from '../../components/cards/AIInsightCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import LevelDistributionChart from '../../components/charts/LevelDistributionChart.jsx';
import BadgeCard from '../../components/cards/BadgeCard.jsx';
import ThemePreference from '../../components/layout/ThemePreference.jsx';

const navItems = [
  { id: 'dashboard', label: 'Beranda', icon: FiHome },
  { id: 'accounts', label: 'Akun', icon: FiUsers },
  { id: 'classes', label: 'Kelas', icon: FiBriefcase },
  { id: 'subjects', label: 'Mapel', icon: FiBookOpen },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

export default function AdminApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const accountActions = [
    { title: 'Impor Akun Siswa', helper: 'CSV / sinkron data', icon: FiUploadCloud },
    { title: 'Verifikasi Guru', helper: '48 akun aktif', icon: FiUserCheck },
    { title: 'Atur Ulang Sandi', helper: 'Massal atau manual', icon: FiKey },
    { title: 'Kelola Peran', helper: 'Admin, guru, siswa', icon: FiShield },
  ];
  const profileMetrics = [
    { label: 'Siswa', value: '812', helper: 'akun aktif', icon: FiUsers, tone: 'royal' },
    { label: 'Guru', value: '48', helper: 'terverifikasi', icon: FiUserCheck, tone: 'success' },
    { label: 'Kelas', value: '26', helper: 'tahun ajaran', icon: FiBriefcase, tone: 'gold' },
  ];

  const screens = {
    dashboard: (
      <>
        <section className="role-summary-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Operasional Sekolah</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Data aktif 99%</h2>
              <p className="mt-1 text-[12px] font-bold text-slate-500">Akun, kelas, dan mapel siap dikelola.</p>
            </div>
            <div className="role-summary-icon grid h-12 w-12 shrink-0 place-items-center rounded-[17px]">
              <FiDatabase className="text-[20px]" />
            </div>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={FiUsers} label="Siswa" value="812" helper="akun aktif" tone="royal" />
          <StatCard icon={FiUser} label="Guru" value="48" helper="terverifikasi" tone="success" />
          <StatCard icon={FiBriefcase} label="Kelas" value="26" helper="tahun ajaran" tone="gold" />
          <StatCard icon={FiDatabase} label="Mapel" value="14" helper="kurikulum" tone="warning" />
        </div>
        <AIInsightCard text="Aktivasi akun kelas X masih 64%. Kirim pengingat orientasi untuk wali kelas dan siswa baru." action="Kirim pengingat" />
        <ProgressCard title="Aktivasi Akun Kelas X" value={64} target={90} caption="Akun siswa baru yang sudah aktif" />
        <ChartCard title="Ringkasan Tingkat" subtitle="Distribusi seluruh sekolah">
          <LevelDistributionChart />
        </ChartCard>
      </>
    ),
    accounts: (
      <>
        <SearchBar placeholder="Cari guru atau siswa" />
        <section className="role-section-card flex items-center justify-between gap-3 rounded-[18px] p-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Akun Sekolah</p>
            <h2 className="text-[15px] font-black leading-5">Manajemen pengguna</h2>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kelola siswa, guru, peran, dan akses masuk.</p>
          </div>
          <FiUsers className="shrink-0 text-[20px] text-royal" />
        </section>
        <div className="grid grid-cols-2 gap-2.5">
          {accountActions.map((item) => {
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
        {['Akun baru minggu ini', 'Menunggu verifikasi', 'Masuk gagal terakhir'].map((item, index) => (
          <div key={item} className="role-list-card flex items-center justify-between gap-3 rounded-[18px] p-3">
            <div className="min-w-0">
              <h3 className="break-words text-[13px] font-black leading-5">{item}</h3>
              <p className="break-words text-[11px] font-bold leading-4 text-slate-500">Pantauan otomatis sistem sekolah</p>
            </div>
            <span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{index === 1 ? '6' : index === 2 ? '2' : '24'}</span>
          </div>
        ))}
      </>
    ),
    classes: (
      <>
        <section className="role-section-card flex items-center justify-between gap-3 rounded-[18px] p-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Kelas</p>
            <h2 className="text-[15px] font-black leading-5">Rombel aktif</h2>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">Pantau wali kelas dan jumlah rombel.</p>
          </div>
          <span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">26 Kelas</span>
        </section>
        {['X IPA', 'XI IPA', 'XII IPA', 'X IPS'].map((item, index) => (
          <div key={item} className="role-list-card flex items-center justify-between gap-3 rounded-[18px] p-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-royal">Tingkat</p>
              <h3 className="break-words text-[15px] font-black leading-5">{item}</h3>
              <p className="break-words text-[11px] font-bold leading-4 text-slate-500">{5 + index} rombel - wali kelas aktif</p>
            </div>
            <span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{5 + index}</span>
          </div>
        ))}
      </>
    ),
    subjects: (
      <>
        <SearchBar placeholder="Cari mata pelajaran" />
        <section className="role-section-card flex items-center justify-between gap-3 rounded-[18px] p-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Mata Pelajaran</p>
            <h2 className="text-[15px] font-black leading-5">Kurikulum aktif</h2>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">Atur mapel, guru pengampu, dan status.</p>
          </div>
          <FiBookOpen className="shrink-0 text-[20px] text-royal" />
        </section>
        {['Matematika', 'Fisika', 'Biologi', 'Bahasa Inggris', 'Kimia'].map((item) => (
          <div key={item} className="role-list-card flex items-center justify-between gap-3 rounded-[18px] p-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="role-action-icon grid h-9 w-9 shrink-0 place-items-center rounded-[14px]">
                <FiBookOpen className="text-[16px]" />
              </span>
              <div className="min-w-0">
                <h3 className="break-words text-[13px] font-black leading-5">{item}</h3>
                <p className="break-words text-[11px] font-bold leading-4 text-slate-500">Silabus dan guru pengampu aktif</p>
              </div>
            </div>
            <FiSettings className="shrink-0 text-[18px] text-royal" />
          </div>
        ))}
      </>
    ),
    profile: (
      <>
        <section className="profile-card rounded-[20px] p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[19px] bg-royal text-[17px] font-black text-white">AS</div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Profil Admin</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Admin Sekolah</h2>
              <p className="break-words text-[12px] font-bold leading-4 text-slate-500">Operator EduSense AI - SMA Nusantara</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {profileMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div key={metric.label} className={`profile-mini-card profile-mini-${metric.tone} rounded-[14px] px-2 py-2`}>
                  <span className="profile-mini-icon mx-auto grid h-7 w-7 place-items-center rounded-[11px]">
                    <Icon className="text-[14px]" />
                  </span>
                  <strong className="profile-mini-value">{metric.value}</strong>
                  <span className="profile-mini-label">{metric.label}</span>
                  <small className="profile-mini-helper">{metric.helper}</small>
                </div>
              );
            })}
          </div>
        </section>
        <StatCard icon={FiBarChart2} label="Data Tersinkron" value="99%" helper="server sekolah" tone="success" />
        <div className="role-list-card flex items-center justify-between gap-3 rounded-[18px] p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="role-action-icon grid h-9 w-9 shrink-0 place-items-center rounded-[14px]">
              <FiRefreshCw className="text-[16px]" />
            </span>
            <div className="min-w-0">
              <h3 className="break-words text-[13px] font-black leading-5">Sinkronisasi</h3>
              <p className="break-words text-[11px] font-bold leading-4 text-slate-500">Terakhir hari ini pukul 08.30</p>
            </div>
          </div>
          <FiCheckCircle className="shrink-0 text-[18px] text-success" />
        </div>
        <ThemePreference />
        <button onClick={onLogout} className="student-danger-btn flex h-12 w-full items-center justify-center rounded-[18px] px-4 text-[13px] font-black text-white" type="button">
          <FiLogOut className="mr-2" />
          Keluar
        </button>
      </>
    ),
  };

  return (
    <AppShell title="Panel Sekolah" subtitle="Admin Sekolah" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
      {screens[activeTab]}
    </AppShell>
  );
}
