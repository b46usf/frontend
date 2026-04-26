import { create } from 'zustand';
import { assessQuiz } from '../utils/scoring.js';

const questions = [
  {
    id: 1,
    type: 'multiple',
    prompt: 'Jika f(x)=2x+3, berapa nilai f(4)?',
    options: ['8', '10', '11', '14'],
    answer: '11',
  },
  {
    id: 2,
    type: 'essay',
    prompt: 'Jelaskan singkat fungsi gradien pada persamaan garis.',
    answer: 'kemiringan',
    keywords: ['kemiringan', 'garis', 'perubahan', 'arah'],
    idealAnswer: 'Gradien menunjukkan kemiringan garis dan besar perubahan nilai y terhadap perubahan x.',
  },
];

export const useQuizStore = create((set, get) => ({
  questions,
  answers: {},
  lastScore: 84,
  lastAssessment: {
    score: 84,
    confidence: 91,
    level: 'Intermediate',
    trend: 'Improving',
    insight: 'Kamu kuat di konsep dasar, tetapi masih lemah pada soal analisis.',
    recommendation: 'Pelajari ulang Materi 3 dan kerjakan latihan penguatan.',
    results: [],
  },
  hasSubmitted: false,
  timer: 540,
  answerQuestion: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submitQuiz: () => {
    const assessment = assessQuiz(get().questions, get().answers);
    set({ lastScore: assessment.score, lastAssessment: assessment, hasSubmitted: true });
    return assessment;
  },
  resetQuiz: () => set({ answers: {}, timer: 540, hasSubmitted: false }),
}));
