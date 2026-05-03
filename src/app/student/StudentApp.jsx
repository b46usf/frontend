import { FiActivity, FiAward, FiBarChart2, FiBookOpen, FiCheckCircle, FiClock, FiGlobe, FiHome, FiPlay, FiTarget, FiTrendingUp, FiUser, FiZap } from 'react-icons/fi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import SearchBar from '../../components/layout/SearchBar.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ProgressCard from '../../components/cards/ProgressCard.jsx';
import AIInsightCard from '../../components/cards/AIInsightCard.jsx';
import MiniMetricGrid from '../../components/cards/MiniMetricGrid.jsx';
import ProfileSummaryCard from '../../components/cards/ProfileSummaryCard.jsx';
import ProfileStatusPanel from '../../components/cards/ProfileStatusPanel.jsx';
import LearningPathCard from '../../components/learning-path/LearningPathCard.jsx';
import QuizCard from '../../components/quiz/QuizCard.jsx';
import AIFeedbackCard from '../../components/quiz/AIFeedbackCard.jsx';
import BadgeCard from '../../components/cards/BadgeCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import PerformanceLineChart from '../../components/charts/PerformanceLineChart.jsx';
import DiagnosticTestCard from '../../components/diagnostic/DiagnosticTestCard.jsx';
import PerformanceTrendPanel from '../../components/analytics/PerformanceTrendPanel.jsx';
import ThemePreference from '../../components/layout/ThemePreference.jsx';
import EmptyState from '../../components/ai/EmptyState.jsx';
import InfiniteScrollSentinel from '../../components/loading/InfiniteScrollSentinel.jsx';
import LazyLoadSkeleton from '../../components/loading/LazyLoadSkeleton.jsx';
import { useInfiniteCollection } from '../../hooks/useInfiniteCollection.js';
import { useLearningStore } from '../../store/learningStore.js';
import { useQuizStore } from '../../store/quizStore.js';
import { useUserStore } from '../../store/userStore.js';
import { api } from '../../services/api.js';
import { normalizeTrendSeries } from '../../services/adapters.js';
import { getLearningLevel } from '../../utils/levelEngine.js';
import { showConfirmDialog, showToast } from '../../utils/alerts.js';

const navItems = [
  { id: 'home', label: 'Beranda', icon: FiHome },
  { id: 'learn', label: 'Belajar', icon: FiBookOpen },
  { id: 'quiz', label: 'Kuis', icon: FiZap },
  { id: 'progress', label: 'Kemajuan', icon: FiBarChart2 },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

const subjectMeta = {
  MATEMATIKA: { icon: FiTarget, tag: 'Logika' },
  FISIKA: { icon: FiZap, tag: 'Eksperimen' },
  BIOLOGI: { icon: FiActivity, tag: 'Konsep' },
  'BAHASA INGGRIS': { icon: FiGlobe, tag: 'Bahasa' },
  'BAHASA INDONESIA': { icon: FiBookOpen, tag: 'Literasi' },
  KIMIA: { icon: FiActivity, tag: 'Praktikum' },
  SEJARAH: { icon: FiClock, tag: 'Konteks' },
  INFORMATIKA: { icon: FiZap, tag: 'Teknologi' },
  DEFAULT: { icon: FiBookOpen, tag: 'Mapel' },
};

const getSubjectMeta = (subject) => subjectMeta[String(subject || '').trim().toUpperCase()] || subjectMeta.DEFAULT;
const MATERIAL_PAGE_SIZE = 8;
const QUIZ_PAGE_SIZE = 6;

export default function StudentApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [backendQuiz, setBackendQuiz] = useState(null);
  const [backendAssessment, setBackendAssessment] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const user = useUserStore((state) => state.user);
  const dashboardBundle = useUserStore((state) => state.dashboards.student);
  const setDashboard = useUserStore((state) => state.setDashboard);
  const learning = useLearningStore();
  const quiz = useQuizStore();
  const backendDashboard = dashboardBundle?.dashboard;
  const backendStudent = backendDashboard?.student;
  const backendProgressSummary = backendDashboard?.progress_summary;
  const backendPerformance = dashboardBundle?.performance;
  const backendDiagnostic = dashboardBundle?.diagnostic;
  const dashboardMaterials = dashboardBundle?.materials || [];
  const dashboardQuizzes = dashboardBundle?.quizzes || [];
  const fetchMaterialPage = useCallback(
    ({ page, limit }) => api.listMaterials({ page, limit }, { withMeta: true }),
    [],
  );
  const fetchQuizPage = useCallback(
    ({ page, limit }) => api.listQuizzes({ quizType: 'practice', page, limit }, { withMeta: true }),
    [],
  );
  const materialCollection = useInfiniteCollection({
    fetchPage: fetchMaterialPage,
    initialItems: dashboardMaterials,
    pageSize: MATERIAL_PAGE_SIZE,
    resetKey: 'student-materials',
  });
  const quizCollection = useInfiniteCollection({
    fetchPage: fetchQuizPage,
    initialItems: dashboardQuizzes,
    pageSize: QUIZ_PAGE_SIZE,
    resetKey: 'student-quizzes',
  });
  const backendMaterials = materialCollection.items;
  const backendQuizzes = quizCollection.items;
  const backendBadges = dashboardBundle?.badges?.length ? dashboardBundle.badges : backendDashboard?.badges;
  const backendRecommendations = dashboardBundle?.recommendations?.length
    ? dashboardBundle.recommendations
    : backendDashboard?.recommendations || [];
  const lastScore = backendAssessment?.score ?? Number(backendDashboard?.recent_attempts?.[0]?.score || 0);
  const levelStatus = getLearningLevel(lastScore);
  const subjectProgressMap = useMemo(() => {
    const grouped = (dashboardBundle?.progress || []).reduce((acc, item) => {
      if (!item.subjectName) return acc;

      acc[item.subjectName] = acc[item.subjectName] || [];
      acc[item.subjectName].push(Number(item.progressPercent || 0));
      return acc;
    }, {});

    return Object.fromEntries(
      Object.entries(grouped).map(([subject, values]) => [
        subject,
        Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
      ]),
    );
  }, [dashboardBundle?.progress]);
  const displaySubjects = useMemo(() => {
    const subjects = [...new Set(backendMaterials.map((material) => material.subjectName).filter(Boolean))];
    return subjects;
  }, [backendMaterials]);
  const hasBackendDiagnosticAttempt = (backendDashboard?.recent_attempts || []).some((attempt) =>
    String(attempt.quiz_title || '').toLowerCase().includes('diagnostik') ||
    String(attempt.quiz_title || '').toLowerCase().includes('diagnostic'),
  );
  const diagnostic = backendDiagnostic?.questions?.length
    ? {
        ...backendDiagnostic,
        answers: learning.diagnostic.answers,
        completed: learning.diagnostic.completed || hasBackendDiagnosticAttempt,
        result: learning.diagnostic.result,
      }
    : learning.diagnostic;
  const showDiagnostic = !diagnostic.completed && diagnostic.questions.length > 0;
  const diagnosticResult = learning.diagnostic.result;
  const activeQuizQuestions = backendQuiz?.questions?.length ? backendQuiz.questions : [];
  const activeQuizId = backendQuiz?.id;
  const quizQuestionCount = activeQuizQuestions.length;
  const quizAnsweredCount = Object.values(quiz.answers).filter((answer) => String(answer ?? '').trim().length > 0).length;
  const quizAnsweredPercent = quizQuestionCount > 0 ? (quizAnsweredCount / quizQuestionCount) * 100 : 0;
  const quizDurationSeconds = (backendQuiz?.durationMinutes || 0) * 60;
  const quizTimer = `${String(Math.floor(quizDurationSeconds / 60)).padStart(2, '0')}:${String(quizDurationSeconds % 60).padStart(2, '0')}`;
  const averageProgress = Math.round(Number(backendProgressSummary?.average_progress_percent || 0));
  const streakDays = Number(backendStudent?.streak_days || 0);
  const activeLevel = levelStatus.label;
  const performanceSeries = useMemo(
    () => normalizeTrendSeries(backendPerformance?.trend_series || []),
    [backendPerformance],
  );
  const displayBadges = backendBadges?.length ? backendBadges.map((badge) => badge.name) : [];
  const nextRecommendation = backendRecommendations[0];
  const nextMaterial = backendMaterials.find((material) => material.id === nextRecommendation?.material_id) || backendMaterials[0];
  const nextMaterialTitle = nextMaterial?.title || 'materi berikutnya';
  const studentTrendMetrics = [
    { label: 'Rata-rata', value: Math.round(Number(backendPerformance?.metrics?.average_score || 0)), helper: 'attempt aktif', icon: FiTrendingUp, tone: 'royal' },
    { label: 'Akurasi', value: `${Math.round(Number(backendPerformance?.metrics?.accuracy || 0))}%`, helper: 'backend', icon: FiTarget, tone: 'success' },
    { label: 'Waktu', value: `${Math.round(Number(backendPerformance?.metrics?.average_time_spent_seconds || 0) / 60)}m`, helper: 'per kuis', icon: FiClock, tone: 'gold' },
    { label: 'Percobaan', value: Number(backendPerformance?.metrics?.attempt_count || 0), helper: 'riwayat', icon: FiBookOpen, tone: 'royal' },
    { label: 'Konsisten', value: `${Math.round(Number(backendPerformance?.metrics?.consistency || 0))}%`, helper: 'stabilitas', icon: FiActivity, tone: 'success' },
    { label: 'Engage', value: `${Math.round(Number(backendPerformance?.metrics?.engagement || 0))}%`, helper: 'progress', icon: FiZap, tone: 'gold' },
  ];
  const quizMetrics = [
    { label: 'Soal', value: quizQuestionCount, helper: `${quizAnsweredCount}/${quizQuestionCount} terjawab`, icon: FiBookOpen, tone: 'royal' },
    { label: 'Akurasi', value: `${Math.round(Number(backendPerformance?.metrics?.accuracy || 0))}%`, helper: 'riwayat', icon: FiTarget, tone: 'success' },
    { label: 'Tingkat', value: `${levelStatus.score}/3`, helper: levelStatus.label, icon: FiAward, tone: 'gold' },
  ];
  const profileTarget = 80;
  const profileRemaining = Math.max(profileTarget - averageProgress, 0);
  const profileMetrics = [
    { label: 'Runtun', value: `${streakDays}h`, helper: 'hari aktif', icon: FiZap, tone: 'success' },
    { label: 'Skor', value: lastScore, helper: 'minggu ini', icon: FiAward, tone: 'royal' },
    { label: 'Target', value: `${averageProgress}%`, helper: profileRemaining > 0 ? `${profileRemaining}% lagi` : 'tercapai', icon: FiTarget, tone: 'gold' },
  ];

  useEffect(() => {
    if (!backendQuizzes.length || backendQuiz) return;

    const quizId = backendQuizzes[0].id;
    api.getQuiz(quizId)
      .then(setBackendQuiz)
      .catch(() => {});
  }, [backendQuiz, backendQuizzes]);

  const selectQuiz = async (quizId) => {
    if (!quizId || quizId === activeQuizId) return;

    quiz.resetQuiz();
    setBackendAssessment(null);

    try {
      const nextQuiz = await api.getQuiz(quizId);
      setBackendQuiz(nextQuiz);
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal membuka kuis' });
    }
  };

  useEffect(() => {
    if (!learning.selectedSubject && displaySubjects[0]) {
      learning.setSubject(displaySubjects[0]);
    }
  }, [displaySubjects, learning]);

  const refreshDashboard = async () => {
    const nextDashboard = await api.getStudentDashboard();
    setDashboard('student', nextDashboard);
  };

  const submitQuiz = async () => {
    if (!activeQuizId) {
      showToast({ icon: 'warning', title: 'Kuis backend belum tersedia' });
      return;
    }

    setIsSubmittingQuiz(true);

    try {
      const assessment = await api.submitQuiz({ quizId: activeQuizId, answers: quiz.answers, timeSpentSeconds: quizDurationSeconds });

      setBackendAssessment(assessment);
      learning.applyAssessmentResult(assessment);
      await refreshDashboard().catch(() => {});

      showConfirmDialog({
        title: `Nilai kamu ${assessment.score}`,
        html: `AI confidence ${assessment.confidence}%. ${assessment.recommendation}`,
        icon: assessment.score >= 70 ? 'success' : 'warning',
        confirmButtonText: 'Lihat feedback',
        showCancelButton: false,
      });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal mengirim kuis' });
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const completeDiagnostic = async () => {
    try {
      if (diagnostic.source === 'backend' && diagnostic.quizId) {
        const assessment = await api.submitDiagnostic({
          quizId: diagnostic.quizId,
          answers: diagnostic.answers,
          timeSpentSeconds: (diagnostic.durationMinutes || 20) * 60,
        });
        const result = learning.setDiagnosticResult({
          score: assessment.score,
          confidence: assessment.confidence,
          level: assessment.level,
        });

        await refreshDashboard().catch(() => {});
        setActiveTab('home');
        showToast({ title: `Level awal: ${result.localLevel}` });
        return;
      }

      showToast({ icon: 'warning', title: 'Tes diagnostik backend belum tersedia' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal mengirim diagnostik' });
    }
  };

  const completeLesson = async () => {
    const material = nextMaterial;

    if (!material?.id) {
      showToast({ icon: 'warning', title: 'Materi backend belum tersedia' });
      return;
    }

    setIsSavingLesson(true);

    try {
      await api.updateMaterialProgress(material.id, {
        status: 'completed',
        progressPercent: 100,
        timeSpentSeconds: Number(material.estimatedMinutes || 10) * 60,
      });
      learning.completeLesson();
      await refreshDashboard().catch(() => {});
      showToast({ title: 'Progres materi tersimpan ke backend' });
    } catch (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal menyimpan progres' });
    } finally {
      setIsSavingLesson(false);
    }
  };

  const latestAssessment = backendAssessment || dashboardBundle?.feedback;

  const screens = {
    home: (
      <>
        <SearchBar placeholder="Cari mapel atau materi" />
        {diagnosticResult && (
          <section className="student-summary-card rounded-[20px] p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">AI Diagnostic Result</p>
                <h2 className="mt-1 break-words text-[17px] font-black leading-6">{diagnosticResult.level}</h2>
                <p className="mt-1 text-[12px] font-bold text-slate-500">
                  {diagnosticResult.correct}/{diagnosticResult.total} benar - confidence {diagnosticResult.confidence}%
                </p>
              </div>
              <div className="summary-score grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-[16px] font-black">
                {diagnosticResult.levelScore}/3
              </div>
            </div>
          </section>
        )}
        <section className="student-summary-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Target Hari Ini</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">Selesaikan 2 materi</h2>
              <p className="mt-1 text-[12px] font-bold text-slate-500">
                Fokus pada {nextMaterialTitle} dan latihan cepat.
              </p>
            </div>
            <div className="summary-score grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-[16px] font-black">
              {averageProgress}%
            </div>
          </div>
        </section>
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard icon={FiTarget} label="Skor" value={lastScore} helper="minggu ini" tone="royal" />
          <StatCard icon={FiAward} label="Tingkat" value={levelStatus.score} helper={`${levelStatus.score}/3`} tone="gold" />
          <StatCard icon={FiZap} label="Runtun" value={`${streakDays}h`} helper="harian" tone="success" />
        </div>
        <AIInsightCard text={nextRecommendation?.reason || 'Belum ada rekomendasi AI baru dari backend.'} />
        <ProgressCard title="Kemajuan Belajar" value={averageProgress} target={80} caption="Target mingguan" />
      </>
    ),
    learn: (
      <>
        <SearchBar placeholder="Pilih mapel" />
        <div className="learn-section-card flex items-center justify-between gap-3 rounded-[18px] p-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Mapel Aktif</p>
            <h2 className="text-[15px] font-black leading-5">Pilih jalur belajar</h2>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">AI menyesuaikan tingkat dari hasil kuis terakhir.</p>
          </div>
          <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-[11px] font-black text-gold">{displaySubjects.length} Mapel</span>
        </div>
        {materialCollection.isLoadingInitial && <LazyLoadSkeleton count={4} variant="subject" />}
        {!materialCollection.isLoadingInitial && displaySubjects.length === 0 && <EmptyState title="Belum ada mapel" message="Materi backend akan tampil di sini setelah tersedia." />}
        {!materialCollection.isLoadingInitial && (
        <div className="grid grid-cols-2 gap-2.5">
          {displaySubjects.map((subject) => {
            const meta = getSubjectMeta(subject);
            const materialCount = backendMaterials.filter((material) => material.subjectName === subject).length;
            const progressPercent = subjectProgressMap[subject] || 0;
            const Icon = meta.icon;
            const active = learning.selectedSubject === subject;

            return (
              <button
                key={subject}
                type="button"
                onClick={() => learning.setSubject(subject)}
                className={`learn-subject-card rounded-[18px] p-3 text-left transition ${active ? 'is-active' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="learn-subject-icon grid h-9 w-9 place-items-center rounded-[14px]">
                    <Icon className="text-[16px]" />
                  </span>
                  <span className="learn-subject-pill rounded-full px-2 py-1 text-[10px] font-black">{progressPercent}%</span>
                </div>
                <h3 className="mt-3 break-words text-[14px] font-black leading-5">{subject}</h3>
                <p className="learn-subject-meta mt-0.5 break-words text-[11px] font-bold leading-4">{materialCount} materi - {meta.tag}</p>
                <div className="learn-subject-track mt-3 h-1.5 overflow-hidden rounded-full">
                  <span className="block h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
              </button>
            );
          })}
        </div>
        )}
        <InfiniteScrollSentinel
          error={materialCollection.error}
          hasNextPage={materialCollection.hasNextPage}
          isLoading={materialCollection.isLoadingMore}
          onRetry={materialCollection.loadMore}
          sentinelRef={materialCollection.sentinelRef}
          skeletonCount={2}
          skeletonVariant="subject"
        />
        <LearningPathCard subject={learning.selectedSubject} level={activeLevel} progress={averageProgress} lessons={backendMaterials.filter((material) => material.subjectName === learning.selectedSubject).length} />
        <button onClick={completeLesson} disabled={isSavingLesson} className="flex h-12 w-full items-center justify-center rounded-[18px] bg-gold px-4 text-[13px] font-black text-navy shadow-gold disabled:cursor-wait disabled:opacity-70" type="button">
          <FiPlay className="mr-2 inline" /> {isSavingLesson ? 'Menyimpan...' : `Mulai ${nextMaterialTitle}`}
        </button>
      </>
    ),
    quiz: (
      <>
        <section className="quiz-timer-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Kuis Adaptif</p>
              <h2 className="mt-1 text-[26px] font-black leading-8">{quizTimer}</h2>
              <p className="text-[12px] font-bold text-slate-500">{backendQuiz?.title || learning.selectedSubject} - Level {levelStatus.score}/3</p>
            </div>
            <div className="quiz-timer-icon grid h-12 w-12 place-items-center rounded-[18px]">
              <FiClock className="text-[20px]" />
            </div>
          </div>
          <div className="quiz-answer-summary mt-3 rounded-[15px] px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-black leading-4">Progres jawaban</span>
              <span className="text-[11px] font-black leading-4">{quizAnsweredCount}/{quizQuestionCount} soal</span>
            </div>
            <div className="quiz-answer-track mt-1.5">
              <span style={{ width: `${quizAnsweredPercent}%` }} />
            </div>
          </div>
          <MiniMetricGrid metrics={quizMetrics} variant="quiz" />
        </section>
        {activeQuizQuestions.length === 0 && <EmptyState title="Belum ada kuis" message="Kuis practice dari backend akan tampil di sini." />}
        {activeQuizQuestions.map((question) => (
          <QuizCard key={question.id} question={question} value={quiz.answers[question.id]} onChange={(value) => quiz.answerQuestion(question.id, value)} />
        ))}
        <section className="role-section-card rounded-[18px] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Bank Kuis</p>
              <h2 className="text-[15px] font-black leading-5">Latihan tersedia</h2>
            </div>
            <span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">{quizCollection.meta.total} Kuis</span>
          </div>
        </section>
        {quizCollection.isLoadingInitial && <LazyLoadSkeleton count={3} />}
        {!quizCollection.isLoadingInitial && backendQuizzes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectQuiz(item.id)}
            className={`role-list-card flex items-center justify-between gap-3 rounded-[18px] p-3 text-left ${item.id === activeQuizId ? 'ring-2 ring-[var(--gold)]' : ''}`}
          >
            <span className="min-w-0">
              <span className="block break-words text-[13px] font-black leading-5">{item.title}</span>
              <span className="block break-words text-[11px] font-bold leading-4 text-slate-500">{item.subjectName || 'Practice'} - {item.questionCount} soal</span>
            </span>
            <span className="role-pill shrink-0 rounded-full px-3 py-1 text-[11px] font-black">{item.levelLabel || levelStatus.label}</span>
          </button>
        ))}
        <InfiniteScrollSentinel
          error={quizCollection.error}
          hasNextPage={quizCollection.hasNextPage}
          isLoading={quizCollection.isLoadingMore}
          onRetry={quizCollection.loadMore}
          sentinelRef={quizCollection.sentinelRef}
        />
        <button onClick={submitQuiz} disabled={isSubmittingQuiz || quizAnsweredCount === 0} className="student-primary-btn flex h-12 w-full items-center justify-center rounded-[18px] px-4 text-[13px] font-black text-white disabled:cursor-wait disabled:opacity-60" type="button">
          <FiCheckCircle className="mr-2" />
          {isSubmittingQuiz ? 'Mengirim...' : 'Kirim Jawaban'}
        </button>
        {latestAssessment && <AIFeedbackCard assessment={latestAssessment} />}
      </>
    ),
    progress: (
      <>
        <section className="progress-summary-card rounded-[20px] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Performa</p>
              <h2 className="mt-1 text-[17px] font-black leading-6">Tren naik minggu ini</h2>
              <p className="text-[12px] font-bold text-slate-500">Akurasi stabil setelah 6 sesi belajar.</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-[17px] bg-success/15 text-success">
              <FiTrendingUp className="text-[20px]" />
            </div>
          </div>
        </section>
        <ChartCard title="Grafik Nilai" subtitle="Tren performa 6 hari terakhir">
          <PerformanceLineChart data={performanceSeries} />
        </ChartCard>
        <PerformanceTrendPanel role="student" title="Kinerja belajar siswa" metrics={studentTrendMetrics} />
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={FiBarChart2} label="Kecepatan" value={`${Math.round(Number(backendPerformance?.metrics?.average_time_spent_seconds || 0) / 60)}m`} helper="per kuis" tone="royal" />
          <StatCard icon={FiTarget} label="Akurasi" value={`${Math.round(Number(backendPerformance?.metrics?.accuracy || 0))}%`} helper="backend" tone="success" />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-black leading-5">Lencana Aktif</h2>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-black text-gold">{displayBadges.length} Lencana</span>
        </div>
        {displayBadges.map((badge) => (
          <BadgeCard key={badge} title={badge} subtitle="Lencana gamifikasi aktif" />
        ))}
        {displayBadges.length === 0 && <EmptyState title="Belum ada lencana" message="Lencana akan tampil setelah pencapaian tersimpan." />}
      </>
    ),
    profile: (
      <div className="profile-layout-grid">
        <ProfileSummaryCard
          eyebrow="Profil Siswa"
          avatar={user.avatar}
          name={user.name}
          subtitle={`${user.school} - ${user.className}`}
          metrics={profileMetrics}
        />
        <ProfileStatusPanel
          eyebrow="Rencana Belajar"
          title="Prioritas minggu ini"
          description="Ringkasan personal dari progres belajar dan hasil kuis terbaru."
          items={[
            { label: 'Level Aktif', value: activeLevel, helper: learning.selectedSubject, icon: FiAward, tone: 'gold' },
            { label: 'Sesi Belajar', value: `${backendPerformance?.metrics?.attempt_count || 0} kuis`, helper: 'riwayat aktif', icon: FiClock, tone: 'royal' },
            { label: 'Materi Berikutnya', value: nextMaterialTitle, helper: nextMaterial?.subjectName || 'jalur personal', icon: FiBookOpen, tone: 'success' },
          ]}
        />
        <ProgressCard title="Target Belajar" value={averageProgress} target={85} caption="Riwayat belajar aktif dari backend" />
        <ThemePreference />
      </div>
    ),
  };

  return (
    <AppShell
      title={showDiagnostic ? 'Tes Diagnostik AI' : `Halo, ${user.name?.split(' ')[0] || 'Siswa'}`}
      subtitle={showDiagnostic ? 'Level Awal Siswa' : 'Beranda Siswa'}
      navItems={navItems}
      activeTab={showDiagnostic ? 'home' : activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {showDiagnostic ? (
        <DiagnosticTestCard diagnostic={diagnostic} onAnswer={learning.answerDiagnostic} onComplete={completeDiagnostic} />
      ) : (
        screens[activeTab]
      )}
    </AppShell>
  );
}
