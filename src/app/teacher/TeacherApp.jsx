import { useCallback, useMemo, useState } from 'react';
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
import EmptyState from '../../components/ai/EmptyState.jsx';
import InfiniteScrollSentinel from '../../components/loading/InfiniteScrollSentinel.jsx';
import LazyLoadSkeleton from '../../components/loading/LazyLoadSkeleton.jsx';
import { useInfiniteCollection } from '../../hooks/useInfiniteCollection.js';
import { useUserStore } from '../../store/userStore.js';
import { api } from '../../services/api.js';
import { normalizeLevelDistribution, normalizeTrendSeries } from '../../services/adapters.js';
import { showToast } from '../../utils/alerts.js';

const navItems = [
  { id: 'dashboard', label: 'Beranda', icon: FiHome },
  { id: 'classes', label: 'Kelas', icon: FiUsers },
  { id: 'tasks', label: 'Tugas', icon: FiClipboard },
  { id: 'analytics', label: 'Analitik', icon: FiBarChart2 },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

const STUDENT_PAGE_SIZE = 10;
const ATTEMPT_PAGE_SIZE = 8;

export default function TeacherApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const dashboardBundle = useUserStore((state) => state.dashboards.teacher);
  const user = useUserStore((state) => state.user);
  const classes = dashboardBundle?.classes || [];
  const riskStudents = dashboardBundle?.riskStudents || [];
  const analytics = dashboardBundle?.analytics || {};
  const dashboardStudents = dashboardBundle?.students || [];
  const dashboardAttempts = dashboardBundle?.attempts || [];
  const fetchStudentPage = useCallback(
    ({ page, limit }) => api.listStudents({ page, limit }, { withMeta: true }),
    [],
  );
  const fetchAttemptPage = useCallback(
    ({ page, limit }) => api.listAttempts({ page, limit }, { withMeta: true }),
    [],
  );
  const studentCollection = useInfiniteCollection({
    fetchPage: fetchStudentPage,
    initialItems: dashboardStudents,
    pageSize: STUDENT_PAGE_SIZE,
    resetKey: 'teacher-students',
  });
  const attemptCollection = useInfiniteCollection({
    fetchPage: fetchAttemptPage,
    initialItems: dashboardAttempts,
    pageSize: ATTEMPT_PAGE_SIZE,
    resetKey: 'teacher-attempts',
  });
  const students = studentCollection.items;
  const attempts = attemptCollection.items;
  const recommendations = dashboardBundle?.recommendations || [];
  const materials = dashboardBundle?.materials || [];
  const averageScore = Math.round(Number(analytics.average_quiz_score || 0));
  const activeClassCount = classes.length;
  const studentCount = Number(analytics.total_students || students.length || 0);
  const riskCount = riskStudents.filter((student) => student.tone !== 'safe').length;
  const activityCount = attempts.length;
  const classEngagement = Math.round(Number(analytics.average_progress_percent || 0));
  const primaryClassName = classes[0]?.class_name || classes[0]?.name || user.className || 'kelas aktif';
  const teacherSubjectLabel = user.specialization || user.className || 'Pengajar';
  const averageAccuracy = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_rate || 0), 0) / attempts.length)
    : 0;
  const averageTimeMinutes = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + Number(attempt.time_spent_seconds || 0), 0) / attempts.length / 60)
    : 0;
  const levelDistribution = useMemo(() => normalizeLevelDistribution(students), [students]);
  const performanceData = useMemo(
    () => normalizeTrendSeries(attempts.slice(0, 6).reverse().map((attempt) => ({ ...attempt, submitted_at: attempt.submitted_at || attempt.started_at }))),
    [attempts],
  );
  const taskActions = [
    { title: 'Buat Kuis', helper: materials.length ? `${materials.length} materi tersedia` : 'Butuh materi backend', icon: FiPlusCircle },
    { title: 'Bank Soal', helper: `${attempts.length} attempt tersimpan`, icon: FiFileText },
    { title: 'Tinjau Esai', helper: `${attempts.filter((attempt) => String(attempt.quiz_title || '').toLowerCase().includes('esai')).length} esai terdeteksi`, icon: FiEdit3 },
    { title: 'Hasil Otomatis', helper: 'Penilaian dari backend', icon: FiCheckCircle },
  ];
  const profileMetrics = [
    { label: 'Kelas', value: activeClassCount, helper: 'aktif', icon: FiBook, tone: 'royal' },
    { label: 'Siswa', value: studentCount, helper: `${riskCount} prioritas`, icon: FiUsers, tone: 'success' },
    { label: 'Rata', value: averageScore, helper: 'kelas aktif', icon: FiActivity, tone: 'gold' },
  ];
  const trendMetrics = [
    { label: 'Rata-rata', value: averageScore, helper: 'kelas aktif', icon: FiTrendingDown, tone: 'royal' },
    { label: 'Akurasi', value: `${averageAccuracy}%`, helper: 'attempt terbaru', icon: FiActivity, tone: 'success' },
    { label: 'Waktu', value: `${averageTimeMinutes}m`, helper: 'rata-rata', icon: FiClipboard, tone: 'gold' },
    { label: 'Percobaan', value: activityCount, helper: 'data attempt', icon: FiCheckCircle, tone: 'royal' },
    { label: 'Konsisten', value: `${classEngagement}%`, helper: 'kelas aktif', icon: FiUsers, tone: 'success' },
    { label: 'Risiko', value: riskCount, helper: 'prioritas', icon: FiAlertTriangle, tone: 'gold' },
  ];

  const refreshDashboard = async () => {
    const nextDashboard = await api.getTeacherDashboard();
    useUserStore.getState().setDashboard('teacher', nextDashboard);
  };

  const sendIntervention = async (student) => {
    if (!student?.id) {
      showToast({ icon: 'info', title: `Arahan untuk ${student.name} disiapkan` });
      return;
    }

    try {
      await api.sendIntervention(student.id, student.intervention || student.reason);
      showToast({ title: `Arahan untuk ${student.name} tersimpan` });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal menyimpan arahan' });
    }
  };

  const createQuickQuiz = async () => {
    const material = materials[0];

    if (!material?.subjectId) {
      showToast({ icon: 'warning', title: 'Materi belum tersedia untuk membuat kuis' });
      return;
    }

    try {
      await api.createQuiz({
        subjectId: material.subjectId,
        materialId: material.id,
        title: `Kuis Cepat ${material.subjectName} ${Date.now().toString().slice(-4)}`,
        quizType: 'practice',
        level: material.level || 'basic',
        durationMinutes: 10,
        questions: [
          {
            questionText: `Apa konsep utama dari ${material.title}?`,
            questionType: 'essay',
            correctAnswer: material.content || material.title,
            keywords: material.title,
            point: 10,
            difficulty: 'medium',
          },
        ],
      });
      await refreshDashboard();
      showToast({ title: 'Kuis cepat berhasil dibuat' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal membuat kuis' });
    }
  };

  const taskActionsWithHandlers = taskActions.map((action) =>
    action.title === 'Buat Kuis'
      ? { ...action, onClick: createQuickQuiz }
      : { ...action, onClick: () => showToast({ icon: 'info', title: `${action.title} memakai data backend tersinkron` }) },
  );

  const screens = {
    dashboard: (
      <>
        <section className="role-summary-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Fokus Hari Ini</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Pantau kelas aktif</h2>
              <p className="mt-1 text-[12px] font-bold text-slate-500">{riskCount} siswa perlu intervensi dan {attempts.length} attempt terbaru siap direview.</p>
            </div>
            <div className="role-summary-icon grid h-12 w-12 shrink-0 place-items-center rounded-[17px]">
              <FiAlertTriangle className="text-[20px]" />
            </div>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={FiUsers} label="Total Siswa" value={studentCount} helper={`${activeClassCount} kelas aktif`} tone="royal" />
          <StatCard icon={FiActivity} label="Rata-rata" value={averageScore} helper="kelas aktif" tone="success" />
          <StatCard icon={FiTrendingDown} label="Risiko" value={riskCount} helper="perlu intervensi" tone="danger" />
          <StatCard icon={FiBook} label="Aktivitas" value={activityCount} helper="attempt tersimpan" tone="gold" />
        </div>
        <AIInsightCard text={recommendations[0]?.reason || 'Belum ada rekomendasi AI baru dari backend.'} action="Buka intervensi" />
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
        <ProgressCard title={`Keterlibatan ${primaryClassName}`} value={classEngagement} target={85} caption="Aktif minimal 4 hari minggu ini" />
        <RiskStudentPanel students={riskStudents} onSendIntervention={sendIntervention} />
        <ChartCard title="Aktivitas Terbaru" subtitle="Nilai penilaian otomatis">
          <PerformanceLineChart data={performanceData.length ? performanceData : undefined} />
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
          trailing={<span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">{activeClassCount} Kelas</span>}
        />
        {classes.length === 0 && <EmptyState title="Belum ada kelas" message="Data kelas akan tampil setelah guru terhubung ke rombel." />}
        {classes.map((item) => {
          const className = item.class_name || item.name;
          const totalStudents = Number(item.total_students || 0);
          const score = Math.round(Number(item.average_total_score || 0));

          return (
          <RoleListCard
            key={className}
            eyebrow="Kelas"
            title={className}
            titleClassName="text-[15px]"
            subtitle={`${totalStudents} siswa - rata-rata ${score}`}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">{score}</span>}
          />
          );
        })}
        <div className="role-section-card rounded-[18px] p-3">
          <h3 className="text-[14px] font-black leading-5">Detail Siswa</h3>
          <div className="mt-3 grid gap-2">
            {studentCollection.isLoadingInitial && <LazyLoadSkeleton count={4} />}
            {!studentCollection.isLoadingInitial && students.length === 0 && <EmptyState title="Belum ada siswa" message="Daftar siswa akan tampil setelah data kelas tersedia." />}
            {!studentCollection.isLoadingInitial && students.map((student) => (
              <div key={student.id || student.user_id || student.name} className="role-row flex items-center justify-between gap-3 rounded-[15px] p-2.5">
                <span className="break-words text-[12px] font-black leading-4">{student.name}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${student.risk_status === 'danger' ? 'role-pill-danger' : 'role-pill-success'}`}>
                  {student.risk_status === 'danger' ? 'Risiko' : student.risk_status || 'Stabil'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <InfiniteScrollSentinel
          error={studentCollection.error}
          hasNextPage={studentCollection.hasNextPage}
          isLoading={studentCollection.isLoadingMore}
          onRetry={studentCollection.loadMore}
          sentinelRef={studentCollection.sentinelRef}
        />
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
        <RoleActionGrid actions={taskActionsWithHandlers} />
        {attemptCollection.isLoadingInitial && <LazyLoadSkeleton count={4} />}
        {!attemptCollection.isLoadingInitial && attempts.length === 0 && <EmptyState title="Belum ada attempt" message="Hasil penilaian akan tampil setelah siswa mengirim kuis." />}
        {!attemptCollection.isLoadingInitial && attempts.map((attempt, index) => (
          <RoleListCard
            key={attempt.id || `${attempt.quiz_title}-${index}`}
            title={attempt.quiz_title || 'Kuis'}
            subtitle={`${attempt.student_name || 'Siswa'} - otomatis dinilai`}
            trailing={<span className="role-pill rounded-full px-3 py-1 text-[11px] font-black">Aktif</span>}
          />
        ))}
        <InfiniteScrollSentinel
          error={attemptCollection.error}
          hasNextPage={attemptCollection.hasNextPage}
          isLoading={attemptCollection.isLoadingMore}
          onRetry={attemptCollection.loadMore}
          sentinelRef={attemptCollection.sentinelRef}
        />
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
          <LevelDistributionChart data={levelDistribution} />
        </ChartCard>
        <PerformanceTrendPanel role="teacher" title="Kinerja kelas dan engagement" metrics={trendMetrics} />
        <RiskStudentPanel students={riskStudents} onSendIntervention={sendIntervention} />
        <BadgeCard title="Rekomendasi AI" subtitle={`${recommendations.length} rekomendasi aktif dari backend`} />
        <BadgeCard title="Keterlibatan" subtitle={`${classEngagement}% rata-rata progres belajar`} />
        <BadgeCard title="Aktivitas Kuis" subtitle={`${activityCount} attempt tersimpan`} />
      </>
    ),
    profile: (
      <div className="profile-layout-grid">
        <ProfileSummaryCard
          eyebrow="Profil Guru"
          avatar={user.avatar}
          name={user.name || 'Guru'}
          subtitle={`${teacherSubjectLabel} - ${user.school || 'Sekolah'}`}
          metrics={profileMetrics}
        />
        <ProfileStatusPanel
          eyebrow="Fokus Mengajar"
          title="Operasional kelas"
          description="Ringkasan beban kelas dan tindak lanjut yang perlu dipantau."
          items={[
            { label: 'Kelas Prioritas', value: riskStudents[0]?.className || '-', helper: `${riskCount} siswa risiko`, icon: FiUsers, tone: 'danger' },
            { label: 'Tugas Aktif', value: `${activityCount} penilaian`, helper: 'attempt backend', icon: FiClipboard, tone: 'royal' },
            { label: 'Materi', value: `${materials.length} tersedia`, helper: 'untuk kuis adaptif', icon: FiTrendingDown, tone: 'gold' },
          ]}
        />
        <ProgressCard title="Kinerja Kelas" value={averageScore} target={88} caption="Rata-rata nilai kelas aktif" />
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
