import { useState } from 'react';
import { FiBarChart2, FiBookOpen, FiBriefcase, FiCheckCircle, FiDatabase, FiHome, FiKey, FiLogOut, FiRefreshCw, FiSettings, FiShield, FiUploadCloud, FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import AppShell from '../../components/layout/AppShell.jsx';
import SearchBar from '../../components/layout/SearchBar.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ProgressCard from '../../components/cards/ProgressCard.jsx';
import AIInsightCard from '../../components/cards/AIInsightCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import LevelDistributionChart from '../../components/charts/LevelDistributionChart.jsx';
import ProfileSummaryCard from '../../components/cards/ProfileSummaryCard.jsx';
import { RoleActionGrid, RoleListCard, RoleSectionCard } from '../../components/cards/RoleCards.jsx';
import ThemePreference from '../../components/layout/ThemePreference.jsx';

const navItems = [
  { id: 'dashboard', label: 'Beranda', icon: FiHome },
  { id: 'accounts', label: 'Akun', icon: FiUsers },
  { id: 'classes', label: 'Kelas', icon: FiBriefcase },
  { id: 'subjects', label: 'Mapel', icon: FiBookOpen },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

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

export default function AdminApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        <RoleSectionCard
          eyebrow="Akun Sekolah"
          title="Manajemen pengguna"
          description="Kelola siswa, guru, peran, dan akses masuk."
          trailing={<FiUsers className="shrink-0 text-[20px] text-royal" />}
        />
        <RoleActionGrid actions={accountActions} />
        {['Akun baru minggu ini', 'Menunggu verifikasi', 'Masuk gagal terakhir'].map((item, index) => (
          <RoleListCard
            key={item}
            title={item}
            subtitle="Pantauan otomatis sistem sekolah"
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{index === 1 ? '6' : index === 2 ? '2' : '24'}</span>}
          />
        ))}
      </>
    ),
    classes: (
      <>
        <RoleSectionCard
          eyebrow="Kelas"
          title="Rombel aktif"
          description="Pantau wali kelas dan jumlah rombel."
          trailing={<span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">26 Kelas</span>}
        />
        {['X IPA', 'XI IPA', 'XII IPA', 'X IPS'].map((item, index) => (
          <RoleListCard
            key={item}
            eyebrow="Tingkat"
            title={item}
            titleClassName="text-[15px]"
            subtitle={`${5 + index} rombel - wali kelas aktif`}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{5 + index}</span>}
          />
        ))}
      </>
    ),
    subjects: (
      <>
        <SearchBar placeholder="Cari mata pelajaran" />
        <RoleSectionCard
          eyebrow="Mata Pelajaran"
          title="Kurikulum aktif"
          description="Atur mapel, guru pengampu, dan status."
          trailing={<FiBookOpen className="shrink-0 text-[20px] text-royal" />}
        />
        {['Matematika', 'Fisika', 'Biologi', 'Bahasa Inggris', 'Kimia'].map((item) => (
          <RoleListCard
            key={item}
            title={item}
            subtitle="Silabus dan guru pengampu aktif"
            leading={
              <span className="role-action-icon grid h-9 w-9 shrink-0 place-items-center rounded-[14px]">
                <FiBookOpen className="text-[16px]" />
              </span>
            }
            trailing={<FiSettings className="shrink-0 text-[18px] text-royal" />}
          />
        ))}
      </>
    ),
    profile: (
      <>
        <ProfileSummaryCard
          eyebrow="Profil Admin"
          avatar="AS"
          name="Admin Sekolah"
          subtitle="Operator EduSense AI - SMA Nusantara"
          metrics={profileMetrics}
        />
        <StatCard icon={FiBarChart2} label="Data Tersinkron" value="99%" helper="server sekolah" tone="success" />
        <RoleListCard
          title="Sinkronisasi"
          subtitle="Terakhir hari ini pukul 08.30"
          leading={
            <span className="role-action-icon grid h-9 w-9 shrink-0 place-items-center rounded-[14px]">
              <FiRefreshCw className="text-[16px]" />
            </span>
          }
          trailing={<FiCheckCircle className="shrink-0 text-[18px] text-success" />}
        />
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
