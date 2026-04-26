export function getLearningLevel(score) {
  if (score >= 88) return { label: 'Lanjutan', score: 3, delta: '+1 tingkat', tone: 'success' };
  if (score >= 70) return { label: 'Menengah', score: 2, delta: 'stabil', tone: 'warning' };
  return { label: 'Dasar', score: 1, delta: 'butuh penguatan', tone: 'danger' };
}
