import { useState } from 'react';
import { FiActivity, FiAlertTriangle, FiBarChart2, FiBook, FiCheckCircle, FiClipboard, FiEdit3, FiFileText, FiHome, FiPlusCircle, FiTrendingDown, FiUser, FiUsers } from 'react-icons/fi';
import AppShell from '../../components/layout/AppShell.jsx';
import SearchBar from '../../components/layout/SearchBar.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ProgressCard from '../../components/cards/ProgressCard.jsx';
import AIInsightCard from '../../components/cards/AIInsightCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import ProfileSummaryCard from '../../components/cards/ProfileSummaryCard.jsx';
import ProfileStatusPanel from '../../components/cards/ProfileStatusPanel.jsx';
import { RoleActionGrid, RoleListCard, RoleSectionCard } from '../../components/cards/RoleCards.jsx';
import PerformanceLineChart from '../../components/charts/PerformanceLineChart.jsx';
import LevelDistributionChart from '../../components/charts/LevelDistributionChart.jsx';
import BadgeCard from '../../components/cards/BadgeCard.jsx';
import PerformanceTrendPanel from '../../components/analytics/PerformanceTrendPanel.jsx';
import RiskStudentPanel from '../../components/teacher/RiskStudentPanel.jsx';
import ThemePreference from '../../components/layout/ThemePreference.jsx';

const navItems = [
  { id: 'dashboard', label: 'Beranda', icon: FiHome },
  { id: 'classes', label: 'Kelas', icon: FiUsers },
  { id: 'tasks', label: 'Tugas', icon: FiClipboard },
  { id: 'analytics', label: 'Analitik', icon: FiBarChart2 },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

const studentRows = ['Alya Prameswari', 'Raka Putra', 'Nadia Zahra', 'Dimas Akbar'];

const taskActions = [
  { title: 'Buat Kuis', helper: 'Generator soal adaptif', icon: FiPlusCircle },
  { title: 'Bank Soal', helper: '128 soal siap pakai', icon: FiFileText },
  { title: 'Tinjau Esai', helper: '12 jawaban menunggu', icon: FiEdit3 },
  { title: 'Hasil Otomatis', helper: 'Penilaian terbaru', icon: FiCheckCircle },
];

const profileMetrics = [
  { label: 'Kelas', value: '4', helper: 'aktif', icon: FiBook, tone: 'royal' },
  { label: 'Siswa', value: '128', helper: '7 prioritas', icon: FiUsers, tone: 'success' },
  { label: 'Rata', value: '82', helper: 'kelas XI', icon: FiActivity, tone: 'gold' },
];

export default function TeacherApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const screens = {
    dashboard: (
      <>
        <section className="role-summary-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Fokus Hari Ini</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Pantau kelas XI</h2>
              <p className="mt-1 text-[12px] font-bold text-slate-500">7 siswa perlu intervensi dan 3 tugas siap direview.</p>
            </div>
            <div className="role-summary-icon grid h-12 w-12 shrink-0 place-items-center rounded-[17px]">
              <FiAlertTriangle className="text-[20px]" />
            </div>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={FiUsers} label="Total Siswa" value="128" helper="4 kelas aktif" tone="royal" />
          <StatCard icon={FiActivity} label="Rata-rata" value="82" helper="kelas XI" tone="success" />
          <StatCard icon={FiTrendingDown} label="Risiko" value="7" helper="perlu intervensi" tone="danger" />
          <StatCard icon={FiBook} label="Aktivitas" value="342" helper="minggu ini" tone="gold" />
        </div>
        <AIInsightCard text="AI menemukan kesenjangan belajar terbesar pada topik persamaan linear. Jadwalkan remedial singkat untuk 7 siswa." action="Buka intervensi" />
        <RoleSectionCard
          eyebrow="Automated Assessment"
          title="Data kuis siswa tersimpan"
          description="PG memakai exact match, esai memakai keyword + similarity, lalu dihitung confidence score."
          align="start"
          trailing={
            <div className="role-summary-icon grid h-10 w-10 shrink-0 place-items-center rounded-[15px]">
              <FiClipboard className="text-[18px]" />
            </div>
          }
        />
        <ProgressCard title="Keterlibatan Kelas XI" value={76} target={85} caption="Aktif minimal 4 hari minggu ini" />
        <RiskStudentPanel />
        <ChartCard title="Aktivitas Terbaru" subtitle="Nilai penilaian otomatis">
          <PerformanceLineChart />
        </ChartCard>
      </>
    ),
    classes: (
      <>
        <SearchBar placeholder="Cari kelas atau siswa" />
        <RoleSectionCard
          eyebrow="Kelas Aktif"
          title="Monitoring siswa"
          description="Performa kelas dan daftar siswa prioritas."
          trailing={<span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">3 Kelas</span>}
        />
        {['XI IPA 1', 'XI IPA 2', 'X IPS 1'].map((className, index) => (
          <RoleListCard
            key={className}
            eyebrow="Kelas"
            title={className}
            titleClassName="text-[15px]"
            subtitle={`${32 + index * 3} siswa - rata-rata ${82 - index}`}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{82 - index}</span>}
          />
        ))}
        <div className="role-section-card rounded-[18px] p-3">
          <h3 className="text-[14px] font-black leading-5">Detail Siswa</h3>
          <div className="mt-3 grid gap-2">
            {studentRows.map((name, index) => (
              <div key={name} className="role-row flex items-center justify-between gap-3 rounded-[15px] p-2.5">
                <span className="break-words text-[12px] font-black leading-4">{name}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${index === 1 ? 'role-pill-danger' : 'role-pill-success'}`}>
                  {index === 1 ? 'Risiko' : 'Stabil'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
    tasks: (
      <>
        <RoleSectionCard
          eyebrow="Tugas & Kuis"
          title="Kelola penilaian"
          description="Buat, tinjau, dan pantau hasil otomatis."
          trailing={<FiClipboard className="shrink-0 text-[20px] text-royal" />}
        />
        <RoleActionGrid actions={taskActions} />
        {['Kuis Fungsi Linear', 'Esai Trigonometri', 'Remedial Pecahan'].map((item, index) => (
          <RoleListCard
            key={item}
            title={item}
            subtitle={`${18 + index * 7} jawaban - otomatis dinilai`}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">Aktif</span>}
          />
        ))}
      </>
    ),
    analytics: (
      <>
        <RoleSectionCard
          eyebrow="Analitik"
          title="Wawasan kelas"
          description="Tingkat, kesenjangan belajar, keterlibatan, dan penyelesaian."
          trailing={<FiBarChart2 className="shrink-0 text-[20px] text-royal" />}
        />
        <ChartCard title="Distribusi Tingkat Siswa" subtitle="Dasar, Menengah, Lanjutan">
          <LevelDistributionChart />
        </ChartCard>
        <PerformanceTrendPanel role="teacher" title="Kinerja kelas dan engagement" />
        <RiskStudentPanel />
        <BadgeCard title="Kesenjangan Belajar" subtitle="Persamaan linear, pecahan, dan trigonometri dasar" />
        <BadgeCard title="Keterlibatan" subtitle="76% siswa aktif minimal 4 hari minggu ini" />
        <BadgeCard title="Tingkat Penyelesaian" subtitle="89% tugas selesai tepat waktu" />
      </>
    ),
    profile: (
      <div className="profile-layout-grid">
        <ProfileSummaryCard
          eyebrow="Profil Guru"
          avatar="RW"
          name="Bu Rani Wijaya"
          subtitle="Matematika - SMA Nusantara"
          metrics={profileMetrics}
        />
        <ProfileStatusPanel
          eyebrow="Fokus Mengajar"
          title="Operasional kelas"
          description="Ringkasan beban kelas dan tindak lanjut yang perlu dipantau."
          items={[
            { label: 'Kelas Prioritas', value: 'XI IPA 2', helper: '7 siswa risiko', icon: FiUsers, tone: 'danger' },
            { label: 'Tugas Aktif', value: '3 penilaian', helper: '12 esai menunggu', icon: FiClipboard, tone: 'royal' },
            { label: 'Remedial', value: 'Persamaan Linear', helper: 'jadwal singkat disarankan', icon: FiTrendingDown, tone: 'gold' },
          ]}
        />
        <ProgressCard title="Kinerja Kelas" value={82} target={88} caption="Rata-rata nilai kelas aktif" />
        <ThemePreference />
      </div>
    ),
  };

  return (
    <AppShell title="Kelas Hari Ini" subtitle="Beranda Guru" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
      {screens[activeTab]}
    </AppShell>
  );
}
