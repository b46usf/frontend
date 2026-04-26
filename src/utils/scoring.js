const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value) => normalize(value).split(' ').filter(Boolean);

const similarityScore = (source, target) => {
  const sourceTokens = new Set(tokenize(source));
  const targetTokens = new Set(tokenize(target));

  if (!sourceTokens.size || !targetTokens.size) return 0;

  const intersection = [...sourceTokens].filter((token) => targetTokens.has(token)).length;
  const union = new Set([...sourceTokens, ...targetTokens]).size || 1;

  return intersection / union;
};

const getEssayKeywords = (question) => {
  if (Array.isArray(question.keywords) && question.keywords.length) return question.keywords;
  return tokenize(question.answer).slice(0, 4);
};

export function scoreQuestion(question, answerValue) {
  const rawAnswer = String(answerValue || '').trim();
  const normalizedAnswer = normalize(rawAnswer);
  const normalizedKey = normalize(question.answer);

  if (question.type === 'multiple') {
    const correct = normalizedAnswer === normalizedKey;

    return {
      id: question.id,
      type: question.type,
      method: 'Exact match',
      score: correct ? 100 : 0,
      confidence: correct ? 98 : 82,
      correct,
      matchedKeywords: [],
      feedback: correct ? 'Jawaban pilihan ganda tepat.' : 'Cek lagi konsep dasar pada soal ini.',
    };
  }

  const keywords = getEssayKeywords(question);
  const matchedKeywords = keywords.filter((keyword) => normalizedAnswer.includes(normalize(keyword)));
  const keywordScore = keywords.length ? matchedKeywords.length / keywords.length : 0;
  const idealAnswer = question.idealAnswer || question.answer;
  const similarity = similarityScore(rawAnswer, idealAnswer);
  const score = Math.round((keywordScore * 0.68 + similarity * 0.32) * 100);
  const confidence = Math.round(Math.min(96, Math.max(48, 54 + score * 0.34 + keywordScore * 14)));

  return {
    id: question.id,
    type: question.type,
    method: 'Keyword + similarity',
    score,
    confidence,
    correct: score >= 70,
    matchedKeywords,
    feedback:
      score >= 80
        ? 'Esai menangkap kata kunci dan makna utama.'
        : 'Tambahkan kata kunci penting dan jelaskan hubungan konsepnya.',
  };
}

export function assessQuiz(questions, answers) {
  const results = questions.map((question) => scoreQuestion(question, answers[question.id]));
  const total = results.length || 1;
  const score = Math.round(results.reduce((sum, item) => sum + item.score, 0) / total);
  const confidence = Math.round(results.reduce((sum, item) => sum + item.confidence, 0) / total);
  const weakEssay = results.find((item) => item.type === 'essay' && item.score < 80);
  const missedMultiple = results.find((item) => item.type === 'multiple' && !item.correct);

  return {
    score,
    confidence,
    level: score >= 88 ? 'Advanced' : score >= 70 ? 'Intermediate' : 'Basic',
    trend: score >= 80 ? 'Improving' : score >= 65 ? 'Stable' : 'Needs support',
    results,
    insight: weakEssay
      ? 'Kamu kuat di konsep dasar, tetapi jawaban analisis perlu kata kunci yang lebih lengkap.'
      : missedMultiple
        ? 'Konsep sudah mulai terbentuk, tetapi ketelitian pilihan ganda perlu ditingkatkan.'
        : 'Kamu kuat di konsep dasar dan mulai stabil pada soal analisis.',
    recommendation: weakEssay
      ? 'Pelajari ulang Materi 3 tentang gradien, lalu kerjakan latihan penguatan.'
      : 'Lanjutkan ke materi berikutnya dan ambil challenge singkat untuk menjaga momentum.',
  };
}

export function calculateScore(questions, answers) {
  return assessQuiz(questions, answers).score;
}
