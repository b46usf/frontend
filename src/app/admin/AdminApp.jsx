import { useMemo, useState } from 'react';
import { FiBarChart2, FiBookOpen, FiBriefcase, FiCheckCircle, FiDatabase, FiHome, FiKey, FiRefreshCw, FiSettings, FiShield, FiUploadCloud, FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import AppShell from '../../components/layout/AppShell.jsx';
import SearchBar from '../../components/layout/SearchBar.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ProgressCard from '../../components/cards/ProgressCard.jsx';
import AIInsightCard from '../../components/cards/AIInsightCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import LevelDistributionChart from '../../components/charts/LevelDistributionChart.jsx';
import ProfileSummaryCard from '../../components/cards/ProfileSummaryCard.jsx';
import ProfileStatusPanel from '../../components/cards/ProfileStatusPanel.jsx';
import { RoleActionGrid, RoleListCard, RoleSectionCard } from '../../components/cards/RoleCards.jsx';
import ThemePreference from '../../components/layout/ThemePreference.jsx';
import { useUserStore } from '../../store/userStore.js';
import { api } from '../../services/api.js';
import { normalizeLevelDistribution } from '../../services/adapters.js';
import { showToast } from '../../utils/alerts.js';

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
  const [className, setClassName] = useState('XII IPA 1');
  const [gradeLevel, setGradeLevel] = useState('XII');
  const [subjectName, setSubjectName] = useState('Kimia');
  const [subjectCode, setSubjectCode] = useState('KIM');
  const [isSaving, setIsSaving] = useState(false);
  const dashboardBundle = useUserStore((state) => state.dashboards.admin);
  const user = useUserStore((state) => state.user);
  const setDashboard = useUserStore((state) => state.setDashboard);
  const classes = dashboardBundle?.classes || [];
  const subjects = dashboardBundle?.subjects || [];
  const teachers = dashboardBundle?.teachers || [];
  const students = dashboardBundle?.students || [];
  const analytics = dashboardBundle?.analytics || {};
  const leaderboard = dashboardBundle?.leaderboard || [];
  const counts = analytics.counts || {};
  const studentCount = Number(counts.total_students || students.length || 812);
  const teacherCount = Number(counts.total_teachers || teachers.length || 48);
  const classCount = classes.length || 26;
  const subjectCount = subjects.length || 14;
  const averageScore = Math.round(Number(counts.average_quiz_score || 82));
  const levelDistribution = useMemo(() => normalizeLevelDistribution(students), [students]);

  const refreshDashboard = async () => {
    const nextDashboard = await api.getAdminDashboard();
    setDashboard('admin', nextDashboard);
  };

  const createClass = async () => {
    setIsSaving(true);

    try {
      await api.createClass({
        name: className,
        gradeLevel,
        academicYear: '2025/2026',
      });
      await refreshDashboard();
      showToast({ title: 'Kelas berhasil dibuat' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal membuat kelas' });
    } finally {
      setIsSaving(false);
    }
  };

  const createSubject = async () => {
    setIsSaving(true);

    try {
      await api.createSubject({
        name: subjectName,
        code: `${subjectCode}-${Date.now().toString().slice(-4)}`,
        description: `${subjectName} demo dari panel admin.`,
      });
      await refreshDashboard();
      showToast({ title: 'Mapel berhasil dibuat' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal membuat mapel' });
    } finally {
      setIsSaving(false);
    }
  };

  const importDemoStudent = async () => {
    try {
      await api.importUsers([
        {
          name: 'Siswa Import Demo',
          email: `import-${Date.now()}@edusense.ai`,
          password: 'demo12345',
          role: 'student',
          classId: classes[0]?.id,
        },
      ]);
      await refreshDashboard();
      showToast({ title: 'Akun siswa berhasil diimpor' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal impor akun' });
    }
  };

  const resetFirstStudentPassword = async () => {
    const target = students[0];

    if (!target?.user_id) {
      showToast({ icon: 'warning', title: 'Belum ada siswa untuk reset sandi' });
      return;
    }

    try {
      await api.resetUserPassword(target.user_id, 'demo12345');
      showToast({ title: `Sandi ${target.name} direset ke demo12345` });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal reset sandi' });
    }
  };

  const verifyFirstTeacher = async () => {
    const target = teachers[0];

    if (!target?.user_id) {
      showToast({ icon: 'warning', title: 'Belum ada guru untuk diverifikasi' });
      return;
    }

    try {
      await api.verifyUser(target.user_id);
      await refreshDashboard();
      showToast({ title: `${target.name} sudah aktif` });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal verifikasi guru' });
    }
  };

  const accountActionsWithHandlers = accountActions.map((action) => {
    if (action.title === 'Impor Akun Siswa') return { ...action, onClick: importDemoStudent };
    if (action.title === 'Verifikasi Guru') return { ...action, onClick: verifyFirstTeacher };
    if (action.title === 'Atur Ulang Sandi') return { ...action, onClick: resetFirstStudentPassword };
    return { ...action, onClick: () => showToast({ icon: 'info', title: `${action.title} memakai role aktif dari backend` }) };
  });

  const screens = {
    dashboard: (
      <>
        <section className="role-summary-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Operasional Sekolah</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Data aktif 99%</h2>
              <p className="mt-1 text-[12px] font-bold text-slate-500">{studentCount} siswa, {teacherCount} guru, dan {subjectCount} mapel siap dikelola.</p>
            </div>
            <div className="role-summary-icon grid h-12 w-12 shrink-0 place-items-center rounded-[17px]">
              <FiDatabase className="text-[20px]" />
            </div>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={FiUsers} label="Siswa" value={studentCount} helper="akun aktif" tone="royal" />
          <StatCard icon={FiUser} label="Guru" value={teacherCount} helper="terverifikasi" tone="success" />
          <StatCard icon={FiBriefcase} label="Kelas" value={classCount} helper="tahun ajaran" tone="gold" />
          <StatCard icon={FiDatabase} label="Mapel" value={subjectCount} helper="kurikulum" tone="warning" />
        </div>
        <AIInsightCard text={`Rata-rata kuis sekolah berada di ${averageScore}. Pantau kelas dengan risiko belajar tertinggi dari panel guru.`} action="Kirim pengingat" />
        <ProgressCard title="Aktivasi Akun Kelas X" value={Math.min(99, Math.max(64, Math.round((studentCount / Math.max(studentCount, 1)) * 99)))} target={90} caption="Akun siswa baru yang sudah aktif" />
        <ChartCard title="Ringkasan Tingkat" subtitle="Distribusi seluruh sekolah">
          <LevelDistributionChart data={levelDistribution} />
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
        <RoleActionGrid actions={accountActionsWithHandlers} />
        {[
          ['Akun siswa aktif', studentCount],
          ['Guru terverifikasi', teacherCount],
          ['Top leaderboard', leaderboard[0]?.name || '-'],
        ].map(([item, value]) => (
          <RoleListCard
            key={item}
            title={item}
            subtitle="Pantauan otomatis sistem sekolah"
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{value}</span>}
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
          trailing={<span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">{classCount} Kelas</span>}
        />
        <section className="role-section-card rounded-[18px] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-[14px] px-3 py-2 text-[12px] font-bold outline-none" value={className} onChange={(event) => setClassName(event.target.value)} placeholder="Nama kelas" />
            <input className="rounded-[14px] px-3 py-2 text-[12px] font-bold outline-none" value={gradeLevel} onChange={(event) => setGradeLevel(event.target.value)} placeholder="Tingkat" />
          </div>
          <button type="button" disabled={isSaving} onClick={createClass} className="mt-2 flex h-10 w-full items-center justify-center rounded-[14px] bg-gold px-3 text-[12px] font-black text-navy disabled:opacity-60">
            Tambah Kelas
          </button>
        </section>
        {(classes.length ? classes : ['X IPA', 'XI IPA', 'XII IPA', 'X IPS']).map((item, index) => {
          const title = item.name || item;
          const subtitle = item.student_count !== undefined
            ? `${item.student_count} siswa - wali ${item.homeroom_teacher_name || 'belum diatur'}`
            : `${5 + index} rombel - wali kelas aktif`;

          return (
          <RoleListCard
            key={title}
            eyebrow="Tingkat"
            title={title}
            titleClassName="text-[15px]"
            subtitle={subtitle}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{item.student_count ?? 5 + index}</span>}
          />
          );
        })}
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
        <section className="role-section-card rounded-[18px] p-3">
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-[14px] px-3 py-2 text-[12px] font-bold outline-none" value={subjectName} onChange={(event) => setSubjectName(event.target.value)} placeholder="Nama mapel" />
            <input className="rounded-[14px] px-3 py-2 text-[12px] font-bold uppercase outline-none" value={subjectCode} onChange={(event) => setSubjectCode(event.target.value.toUpperCase())} placeholder="Kode" />
          </div>
          <button type="button" disabled={isSaving} onClick={createSubject} className="mt-2 flex h-10 w-full items-center justify-center rounded-[14px] bg-gold px-3 text-[12px] font-black text-navy disabled:opacity-60">
            Tambah Mapel
          </button>
        </section>
        {(subjects.length ? subjects : ['Matematika', 'Fisika', 'Biologi', 'Bahasa Inggris', 'Kimia']).map((item) => {
          const title = item.name || item;

          return (
          <RoleListCard
            key={title}
            title={title}
            subtitle={item.material_count !== undefined ? `${item.material_count} materi - ${item.quiz_count} kuis` : 'Silabus dan guru pengampu aktif'}
            leading={
              <span className="role-action-icon grid h-9 w-9 shrink-0 place-items-center rounded-[14px]">
                <FiBookOpen className="text-[16px]" />
              </span>
            }
            trailing={<FiSettings className="shrink-0 text-[18px] text-royal" />}
          />
          );
        })}
      </>
    ),
    profile: (
      <div className="profile-layout-grid">
        <ProfileSummaryCard
          eyebrow="Profil Admin"
          avatar={user.avatar || 'AS'}
          name={user.name || 'Admin Sekolah'}
          subtitle={`Operator EduSense AI - ${user.school || 'SMA Nusantara'}`}
          metrics={profileMetrics}
        />
        <ProfileStatusPanel
          eyebrow="Kontrol Sekolah"
          title="Kesehatan sistem"
          description="Status operasional akun, data sekolah, dan sinkronisasi platform."
          items={[
            { label: 'Sinkronisasi', value: '99% stabil', helper: 'server sekolah', icon: FiDatabase, tone: 'success' },
            { label: 'Akses Peran', value: '3 role aktif', helper: 'admin, guru, siswa', icon: FiShield, tone: 'royal' },
            { label: 'Akun Baru', value: '24 minggu ini', helper: '6 menunggu verifikasi', icon: FiUserCheck, tone: 'gold' },
          ]}
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
      </div>
    ),
  };

  return (
    <AppShell title="Panel Sekolah" subtitle="Admin Sekolah" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout}>
      {screens[activeTab]}
    </AppShell>
  );
}
