const levelLabels = {
  basic: 'Dasar',
  intermediate: 'Menengah',
  advanced: 'Lanjutan',
  Basic: 'Dasar',
  Intermediate: 'Menengah',
  Advanced: 'Lanjutan',
};

const trendLabels = {
  improving: 'Improving',
  stable: 'Stable',
  declining: 'Declining',
};

export function displayLevel(level = 'basic') {
  return levelLabels[level] || level;
}

export function levelScore(level = 'basic') {
  if (level === 'advanced' || level === 'Advanced' || level === 'Lanjutan') return 3;
  if (level === 'intermediate' || level === 'Intermediate' || level === 'Menengah') return 2;
  return 1;
}

export function normalizeQuestion(question = {}) {
  const options = [question.option_a, question.option_b, question.option_c, question.option_d].filter(Boolean);
  const questionType = question.question_type || question.type || 'multiple_choice';

  return {
    id: question.id,
    questionId: question.id,
    type: questionType === 'essay' ? 'essay' : 'multiple',
    topic: question.subject_name || question.topic || 'Adaptif',
    difficulty: question.difficulty || 'medium',
    prompt: question.question_text || question.prompt || '',
    options: options.length ? options : question.options,
    answer: question.correct_answer || question.answer,
    keywords: question.keywords,
    idealAnswer: question.correct_answer || question.idealAnswer,
    point: Number(question.point || 10),
  };
}

export function normalizeDiagnostic(data = {}) {
  return {
    completed: false,
    quizId: data.quiz?.id,
    title: data.quiz?.title || data.title || 'Tes Diagnostik AI',
    durationMinutes: data.quiz?.duration_minutes || 20,
    questions: (data.questions || []).map(normalizeQuestion),
    answers: {},
    result: null,
    source: 'backend',
  };
}

export function normalizeQuiz(data = {}) {
  return {
    id: data.id,
    subjectId: data.subject_id,
    materialId: data.material_id,
    title: data.title || 'Kuis Adaptif',
    quizType: data.quiz_type,
    level: data.level,
    durationMinutes: data.duration_minutes || 15,
    subjectName: data.subject_name,
    materialTitle: data.material_title,
    questionCount: Number(data.question_count || data.questions?.length || 0),
    questions: (data.questions || []).map(normalizeQuestion),
  };
}

export function normalizeQuizList(items = []) {
  return items.map(normalizeQuiz);
}

export function answersToPayload(answers = {}) {
  return Object.entries(answers)
    .filter(([, answer]) => String(answer ?? '').trim().length > 0)
    .map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer: String(answer ?? ''),
    }));
}

export function normalizeAssessment(result = {}) {
  const feedback = result.feedback || result.answers || [];
  const confidence = result.confidence_score ??
    (feedback.length
      ? Math.round(feedback.reduce((sum, item) => sum + Number(item.confidence_score || item.confidence || 0), 0) / feedback.length)
      : Math.round(result.accuracy_rate || 0));
  const level = result.ai_level_result || result.initial_level || result.level || 'basic';
  const trend = result.performance_trend || result.trend || 'stable';

  return {
    attemptId: result.attempt_id,
    quizId: result.quiz_id,
    score: Math.round(Number(result.score || 0)),
    confidence,
    level: displayLevel(level),
    trend: trendLabels[trend] || trend,
    insight: result.ai_insight || `AI menilai performa berada pada level ${displayLevel(level)}.`,
    recommendation:
      result.recommendation ||
      result.next_learning_path?.title ||
      result.feedback?.find((item) => !item.is_correct)?.ai_feedback ||
      'Lanjutkan jalur belajar personal sesuai rekomendasi AI.',
    results: feedback.map((item) => ({
      id: item.question_id || item.id,
      type: item.question_type === 'essay' ? 'essay' : 'multiple',
      score: Math.round(Number(item.score || 0)),
      confidence: Math.round(Number(item.confidence_score || 0)),
      method: item.ai_feedback || 'AI scoring',
      matchedKeywords: item.matched_keywords || [],
    })),
    raw: result,
  };
}

export function normalizeMaterial(material = {}) {
  return {
    id: material.id,
    subjectId: material.subject_id,
    title: material.title,
    content: material.content,
    level: material.level,
    levelLabel: displayLevel(material.level),
    mediaUrl: material.media_url,
    estimatedMinutes: material.estimated_minutes,
    subjectName: material.subject_name,
    subjectCode: material.subject_code,
  };
}

export function normalizeProgress(progress = {}) {
  return {
    id: progress.id,
    materialId: progress.material_id,
    title: progress.material_title,
    subjectName: progress.subject_name,
    status: progress.status,
    progressPercent: Number(progress.progress_percent || 0),
    timeSpentSeconds: Number(progress.time_spent_seconds || 0),
    level: progress.level,
  };
}

export function normalizeRiskStudent(student = {}) {
  const riskStatus = student.risk_status || 'safe';
  const tone = riskStatus === 'danger' ? 'danger' : riskStatus === 'warning' ? 'watch' : 'safe';

  return {
    id: student.student_id || student.id,
    name: student.name,
    score: Math.round(Number(student.metrics?.average_score || student.total_score || 0)),
    risk: student.risk_category?.status || (riskStatus === 'danger' ? 'Perlu Intervensi' : riskStatus === 'warning' ? 'Perlu Dipantau' : 'Aman'),
    tone,
    reason: student.decision_support || 'Ringkasan risiko dihitung dari skor, akurasi, dan progres belajar.',
    intervention: student.decision_support || 'Pantau progres dan berikan latihan sesuai rekomendasi AI.',
    className: student.class_name,
    level: displayLevel(student.current_level),
    metrics: student.metrics || {},
  };
}

export function normalizeTrendSeries(series = []) {
  return series.map((item, index) => ({
    name: item.submitted_at
      ? new Date(item.submitted_at).toLocaleDateString('id-ID', { weekday: 'short' })
      : `S${index + 1}`,
    nilai: Math.round(Number(item.score || 0)),
    accuracy: Math.round(Number(item.accuracy_rate || 0)),
  }));
}

export function normalizeLevelDistribution(students = []) {
  const counts = students.reduce(
    (acc, student) => {
      acc[student.current_level || 'basic'] += 1;
      return acc;
    },
    { basic: 0, intermediate: 0, advanced: 0 },
  );

  return [
    { name: 'Dasar', value: counts.basic, color: '#F59E0B' },
    { name: 'Menengah', value: counts.intermediate, color: '#155EEF' },
    { name: 'Lanjutan', value: counts.advanced, color: '#22C55E' },
  ];
}
