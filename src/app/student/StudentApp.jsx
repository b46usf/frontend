import { FiActivity, FiAward, FiBarChart2, FiBookOpen, FiCheckCircle, FiClock, FiGlobe, FiHome, FiLogOut, FiPlay, FiTarget, FiTrendingUp, FiUser, FiZap } from 'react-icons/fi';
import AppShell from '../../components/layout/AppShell.jsx';
import SearchBar from '../../components/layout/SearchBar.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ProgressCard from '../../components/cards/ProgressCard.jsx';
import AIInsightCard from '../../components/cards/AIInsightCard.jsx';
import LearningPathCard from '../../components/learning-path/LearningPathCard.jsx';
import QuizCard from '../../components/quiz/QuizCard.jsx';
import AIFeedbackCard from '../../components/quiz/AIFeedbackCard.jsx';
import BadgeCard from '../../components/cards/BadgeCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import PerformanceLineChart from '../../components/charts/PerformanceLineChart.jsx';
import DiagnosticTestCard from '../../components/diagnostic/DiagnosticTestCard.jsx';
import PerformanceTrendPanel from '../../components/analytics/PerformanceTrendPanel.jsx';
import ThemePreference from '../../components/layout/ThemePreference.jsx';
import { useLearningStore } from '../../store/learningStore.js';
import { useQuizStore } from '../../store/quizStore.js';
import { useUserStore } from '../../store/userStore.js';
import { getLearningLevel } from '../../utils/levelEngine.js';
import { useState } from 'react';
import { showConfirmDialog, showToast } from '../../utils/alerts.js';

const navItems = [
  { id: 'home', label: 'Beranda', icon: FiHome },
  { id: 'learn', label: 'Belajar', icon: FiBookOpen },
  { id: 'quiz', label: 'Kuis', icon: FiZap },
  { id: 'progress', label: 'Kemajuan', icon: FiBarChart2 },
  { id: 'profile', label: 'Profil', icon: FiUser },
];

const subjectMeta = {
  Matematika: { icon: FiTarget, progress: 68, lessons: 12, tag: 'Logika' },
  Fisika: { icon: FiZap, progress: 54, lessons: 9, tag: 'Eksperimen' },
  Biologi: { icon: FiActivity, progress: 42, lessons: 8, tag: 'Konsep' },
  'Bahasa Inggris': { icon: FiGlobe, progress: 76, lessons: 14, tag: 'Bahasa' },
};

export default function StudentApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const user = useUserStore((state) => state.user);
  const learning = useLearningStore();
  const quiz = useQuizStore();
  const levelStatus = getLearningLevel(quiz.lastScore);
  const selectedSubjectMeta = subjectMeta[learning.selectedSubject] || subjectMeta.Matematika;
  const showDiagnostic = !learning.diagnostic.completed;
  const diagnosticResult = learning.diagnostic.result;
  const quizQuestionCount = quiz.questions.length;
  const quizAnsweredCount = Object.values(quiz.answers).filter((answer) => String(answer ?? '').trim().length > 0).length;
  const quizAnsweredPercent = quizQuestionCount > 0 ? (quizAnsweredCount / quizQuestionCount) * 100 : 0;
  const quizTimer = `${String(Math.floor(quiz.timer / 60)).padStart(2, '0')}:${String(quiz.timer % 60).padStart(2, '0')}`;
  const quizMetrics = [
    { label: 'Soal', value: quizQuestionCount, helper: `${quizAnsweredCount}/${quizQuestionCount} terjawab`, icon: FiBookOpen, tone: 'royal' },
    { label: 'Target', value: '86%', helper: 'akurasi minimal', icon: FiTarget, tone: 'success' },
    { label: 'Tingkat', value: `${levelStatus.score}/3`, helper: levelStatus.label, icon: FiAward, tone: 'gold' },
  ];
  const profileTarget = 80;
  const profileRemaining = Math.max(profileTarget - learning.progress, 0);
  const profileMetrics = [
    { label: 'Runtun', value: `${learning.streak}h`, helper: 'hari aktif', icon: FiZap, tone: 'success' },
    { label: 'Skor', value: quiz.lastScore, helper: 'minggu ini', icon: FiAward, tone: 'royal' },
    { label: 'Target', value: `${learning.progress}%`, helper: profileRemaining > 0 ? `${profileRemaining}% lagi` : 'tercapai', icon: FiTarget, tone: 'gold' },
  ];

  const submitQuiz = () => {
    const assessment = quiz.submitQuiz();
    learning.applyAssessmentResult(assessment);
    showConfirmDialog({
      title: `Nilai kamu ${assessment.score}`,
      html: `AI confidence ${assessment.confidence}%. ${assessment.recommendation}`,
      icon: assessment.score >= 70 ? 'success' : 'warning',
      confirmButtonText: 'Lihat feedback',
      showCancelButton: false,
    });
  };

  const completeDiagnostic = () => {
    const result = learning.completeDiagnostic();
    setActiveTab('home');
    showToast({ title: `Level awal: ${result.level}` });
  };

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
              <p className="mt-1 text-[12px] font-bold text-slate-500">Fokus pada fungsi linear dan latihan cepat.</p>
            </div>
            <div className="summary-score grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-[16px] font-black">
              {learning.progress}%
            </div>
          </div>
        </section>
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard icon={FiTarget} label="Skor" value={quiz.lastScore} helper="minggu ini" tone="royal" />
          <StatCard icon={FiAward} label="Tingkat" value={levelStatus.score} helper={`${levelStatus.score}/3`} tone="gold" />
          <StatCard icon={FiZap} label="Runtun" value={`${learning.streak}h`} helper="harian" tone="success" />
        </div>
        <AIInsightCard text="Fokus 15 menit pada latihan fungsi linear akan menaikkan kepercayaan belajar kamu ke tingkat Lanjutan." />
        <ProgressCard title="Kemajuan Belajar" value={learning.progress} target={80} caption="Target mingguan" />
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
          <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-[11px] font-black text-gold">4 Mapel</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {learning.subjects.map((subject) => {
            const meta = subjectMeta[subject] || subjectMeta.Matematika;
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
                  <span className="learn-subject-pill rounded-full px-2 py-1 text-[10px] font-black">{meta.progress}%</span>
                </div>
                <h3 className="mt-3 break-words text-[14px] font-black leading-5">{subject}</h3>
                <p className="learn-subject-meta mt-0.5 break-words text-[11px] font-bold leading-4">{meta.lessons} materi - {meta.tag}</p>
                <div className="learn-subject-track mt-3 h-1.5 overflow-hidden rounded-full">
                  <span className="block h-full rounded-full" style={{ width: `${meta.progress}%` }} />
                </div>
              </button>
            );
          })}
        </div>
        <LearningPathCard subject={learning.selectedSubject} level={learning.level} progress={learning.progress} lessons={selectedSubjectMeta.lessons} />
        <button onClick={learning.completeLesson} className="flex h-12 w-full items-center justify-center rounded-[18px] bg-gold px-4 text-[13px] font-black text-navy shadow-gold" type="button">
          <FiPlay className="mr-2 inline" /> Mulai Materi
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
              <p className="text-[12px] font-bold text-slate-500">{learning.selectedSubject} - Level {levelStatus.score}/3</p>
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
          <div className="mt-3 grid grid-cols-3 gap-2">
            {quizMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div key={metric.label} className={`quiz-meta-card quiz-meta-${metric.tone} rounded-[14px] px-2 py-2`}>
                  <span className="quiz-meta-icon mx-auto grid h-7 w-7 place-items-center rounded-[11px]">
                    <Icon className="text-[14px]" />
                  </span>
                  <strong className="quiz-meta-value">{metric.value}</strong>
                  <span className="quiz-meta-label">{metric.label}</span>
                  <small className="quiz-meta-helper">{metric.helper}</small>
                </div>
              );
            })}
          </div>
        </section>
        {quiz.questions.map((question) => (
          <QuizCard key={question.id} question={question} value={quiz.answers[question.id]} onChange={(value) => quiz.answerQuestion(question.id, value)} />
        ))}
        <button onClick={submitQuiz} className="student-primary-btn flex h-12 w-full items-center justify-center rounded-[18px] px-4 text-[13px] font-black text-white" type="button">
          <FiCheckCircle className="mr-2" />
          Kirim Jawaban
        </button>
        {quiz.hasSubmitted && <AIFeedbackCard assessment={quiz.lastAssessment} />}
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
          <PerformanceLineChart />
        </ChartCard>
        <PerformanceTrendPanel role="student" title="Kinerja belajar siswa" />
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={FiBarChart2} label="Kecepatan" value="1.4x" helper="lebih cepat" tone="royal" />
          <StatCard icon={FiTarget} label="Akurasi" value="86%" helper="stabil" tone="success" />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-black leading-5">Lencana Aktif</h2>
          <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-black text-gold">{learning.badges.length} Lencana</span>
        </div>
        {learning.badges.map((badge) => (
          <BadgeCard key={badge} title={badge} subtitle="Lencana gamifikasi aktif" />
        ))}
      </>
    ),
    profile: (
      <>
        <section className="profile-card rounded-[20px] p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[19px] bg-royal text-[17px] font-black text-white">{user.avatar}</div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-royal">Profil Siswa</p>
              <h2 className="mt-1 break-words text-[17px] font-black leading-6">{user.name}</h2>
              <p className="break-words text-[12px] font-bold leading-4 text-slate-500">{user.school} - {user.className}</p>
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
        <ProgressCard title="Target Belajar" value={74} target={85} caption="Riwayat belajar aktif 28 sesi" />
        <ThemePreference />
        <button onClick={onLogout} className="student-danger-btn flex h-12 w-full items-center justify-center rounded-[18px] px-4 text-[13px] font-black text-white" type="button">
          <FiLogOut className="mr-2" />
          Keluar
        </button>
      </>
    ),
  };

  return (
    <AppShell
      title={showDiagnostic ? 'Tes Diagnostik AI' : 'Halo, Alya'}
      subtitle={showDiagnostic ? 'Level Awal Siswa' : 'Beranda Siswa'}
      navItems={navItems}
      activeTab={showDiagnostic ? 'home' : activeTab}
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      {showDiagnostic ? (
        <DiagnosticTestCard diagnostic={learning.diagnostic} onAnswer={learning.answerDiagnostic} onComplete={completeDiagnostic} />
      ) : (
        screens[activeTab]
      )}
    </AppShell>
  );
}
