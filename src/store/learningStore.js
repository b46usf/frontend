import { create } from 'zustand';

const diagnosticQuestions = [
  { id: 'd1', topic: 'Aljabar', difficulty: 'Basic', prompt: 'Tentukan nilai x dari persamaan 2x + 4 = 12.', options: ['2', '4', '6'], answer: '4' },
  { id: 'd2', topic: 'Fungsi', difficulty: 'Basic', prompt: 'Jika f(x) = x + 5, berapa nilai f(3)?', options: ['5', '8', '15'], answer: '8' },
  { id: 'd3', topic: 'Grafik', difficulty: 'Basic', prompt: 'Garis dengan gradien positif cenderung bergerak ke arah mana?', options: ['Naik', 'Turun', 'Datar'], answer: 'Naik' },
  { id: 'd4', topic: 'Gradien', difficulty: 'Intermediate', prompt: 'Berapa gradien dari garis y = 3x - 2?', options: ['-2', '2', '3'], answer: '3' },
  { id: 'd5', topic: 'Persamaan', difficulty: 'Intermediate', prompt: 'Pilih bentuk umum yang paling tepat untuk fungsi linear.', options: ['ax + b', 'ax2 + b', 'a/x'], answer: 'ax + b' },
  { id: 'd6', topic: 'Analisis', difficulty: 'Intermediate', prompt: 'Jika nilai gradien makin besar, bentuk garis akan terlihat seperti apa?', options: ['Lebih curam', 'Lebih datar', 'Tidak berubah'], answer: 'Lebih curam' },
  { id: 'd7', topic: 'Aplikasi', difficulty: 'Intermediate', prompt: 'Harga awal 10.000 naik 2.000 per item. Model yang tepat ...', options: ['y=2000x+10000', 'y=10000x+2000', 'y=12000x'], answer: 'y=2000x+10000' },
  { id: 'd8', topic: 'Interpretasi', difficulty: 'Advanced', prompt: 'Pada persamaan y = 5x + 1, angka 5 menunjukkan apa?', options: ['Laju perubahan', 'Nilai awal', 'Titik akhir'], answer: 'Laju perubahan' },
  { id: 'd9', topic: 'Prediksi', difficulty: 'Advanced', prompt: 'Jika pola linear stabil, konsep apa yang dipakai untuk prediksi nilai berikutnya?', options: ['Gradien', 'Akar', 'Luas'], answer: 'Gradien' },
  { id: 'd10', topic: 'Evaluasi', difficulty: 'Advanced', prompt: 'Dua garis sejajar memiliki hubungan gradien seperti apa?', options: ['Sama', 'Berlawanan', 'Nol'], answer: 'Sama' },
];

const getLevelFromScore = (score) => {
  if (score >= 85) return { local: 'Lanjutan', global: 'Advanced', score: 3 };
  if (score >= 60) return { local: 'Menengah', global: 'Intermediate', score: 2 };
  return { local: 'Dasar', global: 'Basic', score: 1 };
};

const scoreDiagnostic = (questions, answers) => {
  const correct = questions.filter((question) => String(answers[question.id] || '').trim() === question.answer).length;
  const score = Math.round((correct / questions.length) * 100);
  const level = getLevelFromScore(score);

  return {
    score,
    correct,
    total: questions.length,
    confidence: Math.min(96, 62 + correct * 3),
    level: level.global,
    localLevel: level.local,
    levelScore: level.score,
  };
};

export const useLearningStore = create((set, get) => ({
  selectedSubject: 'Matematika',
  level: 'Menengah',
  streak: 12,
  progress: 68,
  badges: ['Pemula AI', 'Runtun 7 Hari', 'Jago Kuis'],
  subjects: ['Matematika', 'Fisika', 'Biologi', 'Bahasa Inggris'],
  diagnostic: {
    completed: false,
    questions: diagnosticQuestions,
    answers: {},
    result: null,
  },
  setSubject: (selectedSubject) => set({ selectedSubject }),
  answerDiagnostic: (id, value) =>
    set((state) => ({
      diagnostic: {
        ...state.diagnostic,
        answers: { ...state.diagnostic.answers, [id]: value },
      },
    })),
  completeDiagnostic: () => {
    const current = get().diagnostic;
    const result = scoreDiagnostic(current.questions, current.answers);

    set((state) => ({
      level: result.localLevel,
      progress: Math.max(state.progress, result.score >= 85 ? 72 : result.score >= 60 ? 48 : 26),
      diagnostic: {
        ...state.diagnostic,
        completed: true,
        result,
      },
    }));

    return result;
  },
  setDiagnosticResult: (assessment) => {
    const level = getLevelFromScore(assessment.score);
    const result = {
      score: assessment.score,
      correct: assessment.correct,
      total: assessment.total,
      confidence: assessment.confidence,
      level: assessment.level || assessment.initial_level || assessment.ai_level_result,
      localLevel: level.local,
      levelScore: level.score,
    };

    set((state) => ({
      level: level.local,
      progress: Math.max(state.progress, result.score >= 85 ? 72 : result.score >= 60 ? 48 : 26),
      diagnostic: {
        ...state.diagnostic,
        completed: true,
        result,
      },
    }));

    return result;
  },
  applyAssessmentResult: (assessment) => {
    const level = getLevelFromScore(assessment.score);

    set((state) => ({
      level: level.local,
      progress: Math.min(100, Math.max(state.progress, Math.round(assessment.score * 0.82))),
      badges: assessment.score >= 88 && !state.badges.includes('Mastery Badge') ? [...state.badges, 'Mastery Badge'] : state.badges,
    }));
  },
  completeLesson: () => set((state) => ({ progress: Math.min(100, state.progress + 7), streak: state.streak + 1 })),
}));
