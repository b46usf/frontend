import { create } from 'zustand';

const getLevelFromScore = (score) => {
  if (score >= 85) return { local: 'Lanjutan', global: 'Advanced', score: 3 };
  if (score >= 60) return { local: 'Menengah', global: 'Intermediate', score: 2 };
  return { local: 'Dasar', global: 'Basic', score: 1 };
};

const scoreDiagnostic = (questions, answers) => {
  if (!questions.length) {
    const level = getLevelFromScore(0);

    return {
      score: 0,
      correct: 0,
      total: 0,
      confidence: 0,
      level: level.global,
      localLevel: level.local,
      levelScore: level.score,
    };
  }

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
  selectedSubject: '',
  level: 'Dasar',
  streak: 0,
  progress: 0,
  badges: [],
  subjects: [],
  diagnostic: {
    completed: false,
    questions: [],
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
