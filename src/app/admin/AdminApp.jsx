import { useCallback, useMemo, useState } from 'react';
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
import EmptyState from '../../components/ai/EmptyState.jsx';
import InfiniteScrollSentinel from '../../components/loading/InfiniteScrollSentinel.jsx';
import LazyLoadSkeleton from '../../components/loading/LazyLoadSkeleton.jsx';
import { useInfiniteCollection } from '../../hooks/useInfiniteCollection.js';
import { useUserStore } from '../../store/userStore.js';
import { api } from '../../services/api.js';
import { normalizeLevelDistribution } from '../../services/adapters.js';
import { showConfirmDialog, showToast } from '../../utils/alerts.js';

const navItems = [
  { id: 'dashboard', label: 'Beranda', icon: FiHome },
  { id: 'accounts', label: 'Akun', icon: FiUsers },
  { id: 'classes', label: 'Kelas', icon: FiBriefcase },
  { id: 'subjects', label: 'Mapel', icon: FiBookOpen },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

const ADMIN_PAGE_SIZE = 8;
const ADMIN_STUDENT_PAGE_SIZE = 10;

const getCurrentAcademicYear = () => {
  const now = new Date();
  const startYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

  return `${startYear}/${startYear + 1}`;
};

const generateTemporaryPassword = () => {
  const random = globalThis.crypto?.getRandomValues
    ? globalThis.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
    : Date.now().toString(36);

  return `Edu-${random.slice(0, 8)}!`;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export default function AdminApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [homeroomTeacherId, setHomeroomTeacherId] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const dashboardBundle = useUserStore((state) => state.dashboards.admin);
  const user = useUserStore((state) => state.user);
  const setDashboard = useUserStore((state) => state.setDashboard);
  const dashboardClasses = dashboardBundle?.classes || [];
  const dashboardSubjects = dashboardBundle?.subjects || [];
  const dashboardTeachers = dashboardBundle?.teachers || [];
  const dashboardStudents = dashboardBundle?.students || [];
  const fetchClassPage = useCallback(
    ({ page, limit }) => api.listClasses({ page, limit }, { withMeta: true }),
    [],
  );
  const fetchSubjectPage = useCallback(
    ({ page, limit }) => api.listSubjects({ page, limit }, { withMeta: true }),
    [],
  );
  const fetchTeacherPage = useCallback(
    ({ page, limit }) => api.listTeachers({ page, limit }, { withMeta: true }),
    [],
  );
  const fetchStudentPage = useCallback(
    ({ page, limit }) => api.listStudents({ page, limit }, { withMeta: true }),
    [],
  );
  const classCollection = useInfiniteCollection({
    fetchPage: fetchClassPage,
    initialItems: dashboardClasses,
    pageSize: ADMIN_PAGE_SIZE,
    resetKey: 'admin-classes',
  });
  const subjectCollection = useInfiniteCollection({
    fetchPage: fetchSubjectPage,
    initialItems: dashboardSubjects,
    pageSize: ADMIN_PAGE_SIZE,
    resetKey: 'admin-subjects',
  });
  const teacherCollection = useInfiniteCollection({
    fetchPage: fetchTeacherPage,
    initialItems: dashboardTeachers,
    pageSize: ADMIN_PAGE_SIZE,
    resetKey: 'admin-teachers',
  });
  const studentCollection = useInfiniteCollection({
    fetchPage: fetchStudentPage,
    initialItems: dashboardStudents,
    pageSize: ADMIN_STUDENT_PAGE_SIZE,
    resetKey: 'admin-students',
  });
  const classes = classCollection.items;
  const subjects = subjectCollection.items;
  const teachers = teacherCollection.items;
  const students = studentCollection.items;
  const analytics = dashboardBundle?.analytics || {};
  const leaderboard = dashboardBundle?.leaderboard || [];
  const studentCount = Number(analytics.total_students || students.length || 0);
  const teacherCount = Number(analytics.total_teachers || teachers.length || 0);
  const classCount = classes.length;
  const subjectCount = subjects.length;
  const averageScore = Math.round(Number(analytics.average_quiz_score || 0));
  const completedMaterials = Number(analytics.completed_materials || 0);
  const totalProgressRecords = Number(analytics.total_progress_records || 0);
  const activationPercent = totalProgressRecords
    ? Math.round((completedMaterials / totalProgressRecords) * 100)
    : 0;
  const levelDistribution = useMemo(() => normalizeLevelDistribution(students), [students]);
  const pendingAccounts = useMemo(
    () => [
      ...teachers
        .filter((teacher) => teacher.status === 'inactive')
        .map((teacher) => ({ ...teacher, roleLabel: 'Guru' })),
      ...students
        .filter((student) => student.status === 'inactive')
        .map((student) => ({ ...student, roleLabel: 'Siswa' })),
    ],
    [students, teachers],
  );
  const accountActions = [
    { title: 'Impor Akun Siswa', helper: 'Input akun baru', icon: FiUploadCloud },
    { title: 'Verifikasi Akun', helper: `${pendingAccounts.length} menunggu`, icon: FiUserCheck },
    { title: 'Atur Ulang Sandi', helper: students.length ? 'Siswa pertama di daftar' : 'Belum ada siswa', icon: FiKey },
    { title: 'Kelola Peran', helper: `${teacherCount + studentCount} akun terdata`, icon: FiShield },
  ];
  const profileMetrics = [
    { label: 'Siswa', value: studentCount, helper: 'akun aktif', icon: FiUsers, tone: 'royal' },
    { label: 'Guru', value: teacherCount, helper: 'terverifikasi', icon: FiUserCheck, tone: 'success' },
    { label: 'Kelas', value: classCount, helper: 'tahun ajaran', icon: FiBriefcase, tone: 'gold' },
  ];
  const homeroomTeacherOptions = teachers.map((teacher) => ({
    id: teacher.id,
    label: `${teacher.name}${teacher.specialization ? ` - ${teacher.specialization}` : ''}`,
  }));

  const refreshDashboard = async () => {
    const nextDashboard = await api.getAdminDashboard();
    setDashboard('admin', nextDashboard);
  };

  const createClass = async () => {
    const nextName = className.trim();
    const nextGradeLevel = gradeLevel.trim();

    if (!nextName || !nextGradeLevel) {
      showToast({ icon: 'warning', title: 'Lengkapi nama kelas dan tingkat' });
      return;
    }

    setIsSaving(true);

    try {
      await api.createClass({
        name: nextName,
        gradeLevel: nextGradeLevel,
        academicYear: getCurrentAcademicYear(),
        homeroomTeacherId: homeroomTeacherId ? Number(homeroomTeacherId) : undefined,
      });
      await refreshDashboard();
      setClassName('');
      setGradeLevel('');
      setHomeroomTeacherId('');
      showToast({ title: 'Kelas berhasil dibuat' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal membuat kelas' });
    } finally {
      setIsSaving(false);
    }
  };

  const createSubject = async () => {
    const nextName = subjectName.trim();
    const nextCode = subjectCode.trim();

    if (!nextName || !nextCode) {
      showToast({ icon: 'warning', title: 'Lengkapi nama dan kode mapel' });
      return;
    }

    setIsSaving(true);

    try {
      await api.createSubject({
        name: nextName,
        code: nextCode,
        description: `Dibuat dari panel admin.`,
      });
      await refreshDashboard();
      setSubjectName('');
      setSubjectCode('');
      showToast({ title: 'Mapel berhasil dibuat' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal membuat mapel' });
    } finally {
      setIsSaving(false);
    }
  };

  const importStudent = async () => {
    if (!classes.length) {
      showToast({ icon: 'warning', title: 'Buat kelas terlebih dahulu sebelum impor siswa' });
      return;
    }

    const classOptions = classes
      .map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`)
      .join('');
    const result = await showConfirmDialog({
      title: 'Impor Akun Siswa',
      html: `
        <div class="grid gap-2 text-left">
          <input id="import-name" class="swal2-input" placeholder="Nama siswa" />
          <input id="import-student-number" class="swal2-input" placeholder="NIS siswa" />
          <input id="import-email" class="swal2-input" type="email" placeholder="Email siswa" />
          <input id="import-password" class="swal2-input" type="password" placeholder="Password sementara" />
          <select id="import-class" class="swal2-select">${classOptions}</select>
        </div>
      `,
      confirmButtonText: 'Impor',
      preConfirm: () => {
        const name = document.getElementById('import-name')?.value?.trim();
        const studentNumber = document.getElementById('import-student-number')?.value?.trim();
        const email = document.getElementById('import-email')?.value?.trim();
        const password = document.getElementById('import-password')?.value || '';
        const classId = Number(document.getElementById('import-class')?.value);

        if (!name || !studentNumber || !email || password.length < 8 || !classId) {
          return null;
        }

        return { name, studentNumber, email, password, classId };
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    if (!result.value) {
      showToast({ icon: 'warning', title: 'Lengkapi nama, NIS, email, kelas, dan password minimal 8 karakter' });
      return;
    }

    try {
      await api.importUsers([{ ...result.value, role: 'student' }]);
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
      const temporaryPassword = generateTemporaryPassword();
      await api.resetUserPassword(target.user_id, temporaryPassword);
      showToast({ title: `Sandi sementara ${target.name}: ${temporaryPassword}` });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal reset sandi' });
    }
  };

  const verifyFirstPendingAccount = async () => {
    const target = pendingAccounts[0];

    if (!target?.user_id) {
      showToast({ icon: 'warning', title: 'Belum ada akun menunggu konfirmasi' });
      return;
    }

    try {
      await api.verifyUser(target.user_id);
      await refreshDashboard();
      showToast({ title: `${target.roleLabel} ${target.name} sudah aktif` });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal verifikasi akun' });
    }
  };

  const accountActionsWithHandlers = accountActions.map((action) => {
    if (action.title === 'Impor Akun Siswa') return { ...action, onClick: importStudent };
    if (action.title === 'Verifikasi Akun') return { ...action, onClick: verifyFirstPendingAccount };
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
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Data sekolah aktif</h2>
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
        <ProgressCard title="Penyelesaian Materi" value={activationPercent} target={90} caption="Rasio progress completed dari backend" />
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
          ['Menunggu konfirmasi', pendingAccounts.length],
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
            <select className="col-span-2 rounded-[14px] px-3 py-2 text-[12px] font-bold outline-none" value={homeroomTeacherId} onChange={(event) => setHomeroomTeacherId(event.target.value)}>
              <option value="">Wali kelas belum diatur</option>
              {homeroomTeacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.label}</option>
              ))}
            </select>
          </div>
          <button type="button" disabled={isSaving} onClick={createClass} className="mt-2 flex h-10 w-full items-center justify-center rounded-[14px] bg-gold px-3 text-[12px] font-black text-navy disabled:opacity-60">
            Tambah Kelas
          </button>
        </section>
        {classCollection.isLoadingInitial && <LazyLoadSkeleton count={4} />}
        {!classCollection.isLoadingInitial && classes.length === 0 && <EmptyState title="Belum ada kelas" message="Kelas akan tampil setelah dibuat dari panel admin." />}
        {!classCollection.isLoadingInitial && classes.map((item) => {
          const title = item.name;
          const subtitle = `${item.student_count || 0} siswa - wali ${item.homeroom_teacher_name || 'belum diatur'}`;

          return (
          <RoleListCard
            key={title}
            eyebrow="Tingkat"
            title={title}
            titleClassName="text-[15px]"
            subtitle={subtitle}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{item.student_count || 0}</span>}
          />
          );
        })}
        <InfiniteScrollSentinel
          error={classCollection.error}
          hasNextPage={classCollection.hasNextPage}
          isLoading={classCollection.isLoadingMore}
          onRetry={classCollection.loadMore}
          sentinelRef={classCollection.sentinelRef}
        />
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
            <input className="rounded-[14px] px-3 py-2 text-[12px] font-bold outline-none" value={subjectCode} onChange={(event) => setSubjectCode(event.target.value)} placeholder="Kode" />
          </div>
          <button type="button" disabled={isSaving} onClick={createSubject} className="mt-2 flex h-10 w-full items-center justify-center rounded-[14px] bg-gold px-3 text-[12px] font-black text-navy disabled:opacity-60">
            Tambah Mapel
          </button>
        </section>
        {subjectCollection.isLoadingInitial && <LazyLoadSkeleton count={4} />}
        {!subjectCollection.isLoadingInitial && subjects.length === 0 && <EmptyState title="Belum ada mapel" message="Mata pelajaran akan tampil setelah dibuat dari panel admin." />}
        {!subjectCollection.isLoadingInitial && subjects.map((item) => {
          const title = item.name;

          return (
          <RoleListCard
            key={item.id || title}
            title={title}
            subtitle={`${item.material_count || 0} materi - ${item.quiz_count || 0} kuis`}
            leading={
              <span className="role-action-icon grid h-9 w-9 shrink-0 place-items-center rounded-[14px]">
                <FiBookOpen className="text-[16px]" />
              </span>
            }
            trailing={<FiSettings className="shrink-0 text-[18px] text-royal" />}
          />
          );
        })}
        <InfiniteScrollSentinel
          error={subjectCollection.error}
          hasNextPage={subjectCollection.hasNextPage}
          isLoading={subjectCollection.isLoadingMore}
          onRetry={subjectCollection.loadMore}
          sentinelRef={subjectCollection.sentinelRef}
        />
      </>
    ),
    profile: (
      <div className="profile-layout-grid">
        <ProfileSummaryCard
          eyebrow="Profil Admin"
          avatar={user.avatar}
          name={user.name || 'Admin'}
          subtitle={`Operator EduSense AI - ${user.school || 'Sekolah'}`}
          metrics={profileMetrics}
        />
        <ProfileStatusPanel
          eyebrow="Kontrol Sekolah"
          title="Kesehatan sistem"
          description="Status operasional akun, data sekolah, dan sinkronisasi platform."
          items={[
            { label: 'Sinkronisasi', value: `${activationPercent}%`, helper: 'progress materi', icon: FiDatabase, tone: 'success' },
            { label: 'Akses Peran', value: '3 role aktif', helper: 'admin, guru, siswa', icon: FiShield, tone: 'royal' },
            { label: 'Akun Terdata', value: `${teacherCount + studentCount}`, helper: 'guru dan siswa', icon: FiUserCheck, tone: 'gold' },
          ]}
        />
        <StatCard icon={FiBarChart2} label="Data Tersinkron" value={`${activationPercent}%`} helper="progress materi" tone="success" />
        <RoleListCard
          title="Sinkronisasi"
          subtitle={`${totalProgressRecords} progress record tercatat`}
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
