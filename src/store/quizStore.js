import { create } from 'zustand';
import { assessQuiz } from '../utils/scoring.js';

export const useQuizStore = create((set, get) => ({
  questions: [],
  answers: {},
  lastScore: 0,
  lastAssessment: null,
  hasSubmitted: false,
  timer: 0,
  answerQuestion: (id, value) => set((state) => ({ answers: { ...state.answers, [id]: value } })),
  submitQuiz: () => {
    const assessment = assessQuiz(get().questions, get().answers);
    set({ lastScore: assessment.score, lastAssessment: assessment, hasSubmitted: true });
    return assessment;
  },
  resetQuiz: () => set({ answers: {}, timer: 0, hasSubmitted: false }),
}));
