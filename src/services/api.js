import {
  answersToPayload,
  normalizeAssessment,
  normalizeDiagnostic,
  normalizeMaterial,
  normalizeProgress,
  normalizeQuiz,
  normalizeQuizList,
  normalizeRiskStudent,
} from './adapters.js';
import { decryptResponseField } from '../utils/crypto.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const AUTH_TOKEN_KEY = 'edusense-auth-token';

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

function buildUrl(path) {
  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function readPayload(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Backend mengirim respons yang bukan JSON.');
  }
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, token = getAuthToken(), headers = {} } = options;
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await readPayload(response);

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request gagal dengan status ${response.status}.`);
  }

  if (payload?.encrypted) {
    try {
      payload.data = await decryptResponseField(payload.data);

      if (payload.meta !== undefined) {
        payload.meta = await decryptResponseField(payload.meta);
      }
    } catch (error) {
      throw new Error('Gagal membuka respons terenkripsi dari backend.');
    }
  }

  return payload?.data ?? null;
}

export const api = {
  login(payload) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: payload,
      token: null,
    });
  },

  register(payload) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: payload,
      token: null,
    });
  },

  me() {
    return apiRequest('/auth/me');
  },

  getStudentDashboard() {
    return Promise.all([
      apiRequest('/students/me/dashboard'),
      apiRequest('/students/me/recommendations'),
      apiRequest('/students/me/progress'),
      apiRequest('/students/me/badges'),
      apiRequest('/ai/diagnostic').then(normalizeDiagnostic),
      apiRequest('/ai/learning-path/me'),
      apiRequest('/ai/feedback-card/me').then(normalizeAssessment).catch(() => null),
      apiRequest('/ai/performance/me').catch(() => null),
      apiRequest('/materials').then((items) => items.map(normalizeMaterial)),
      apiRequest('/quizzes?quizType=practice').then(normalizeQuizList),
    ]).then(([dashboard, recommendations, progress, badges, diagnostic, learningPath, feedback, performance, materials, quizzes]) => ({
      dashboard,
      recommendations,
      progress: progress.map(normalizeProgress),
      badges,
      diagnostic,
      learningPath,
      feedback,
      performance,
      materials,
      quizzes,
    }));
  },

  getTeacherDashboard() {
    return Promise.all([
      apiRequest('/teachers/classes/dashboard'),
      apiRequest('/ai/risk-students').then((items) => items.map(normalizeRiskStudent)),
      apiRequest('/ai/recommendations'),
      apiRequest('/analytics/dashboard'),
      apiRequest('/students'),
      apiRequest('/assessments/attempts'),
      apiRequest('/materials').then((items) => items.map(normalizeMaterial)),
    ]).then(([classDashboard, riskStudents, recommendations, analytics, students, attempts, materials]) => ({
      classes: classDashboard?.classes || [],
      interventionQueue: classDashboard?.intervention_queue || [],
      riskStudents,
      recommendations,
      analytics,
      students,
      attempts,
      materials,
    }));
  },

  getAdminDashboard() {
    return Promise.all([
      apiRequest('/admin/classes'),
      apiRequest('/admin/subjects'),
      apiRequest('/analytics/dashboard'),
      apiRequest('/teachers'),
      apiRequest('/students'),
      apiRequest('/gamification/leaderboard'),
    ]).then(([classes, subjects, analytics, teachers, students, leaderboard]) => ({
      classes,
      subjects,
      analytics,
      teachers,
      students,
      leaderboard,
    }));
  },

  getDashboard(role) {
    if (role === 'teacher') return this.getTeacherDashboard();
    if (role === 'admin') return this.getAdminDashboard();
    return this.getStudentDashboard();
  },

  getDiagnostic() {
    return apiRequest('/ai/diagnostic').then(normalizeDiagnostic);
  },

  submitDiagnostic({ quizId, answers, timeSpentSeconds = 0 }) {
    return apiRequest('/ai/diagnostic/submit', {
      method: 'POST',
      body: {
        quizId,
        timeSpentSeconds,
        answers: answersToPayload(answers),
      },
    }).then(normalizeAssessment);
  },

  listQuizzes(query = '') {
    return apiRequest(`/quizzes${query}`).then(normalizeQuizList);
  },

  getQuiz(id) {
    return apiRequest(`/quizzes/${id}`).then(normalizeQuiz);
  },

  submitQuiz({ quizId, answers, timeSpentSeconds = 0 }) {
    return apiRequest(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: {
        timeSpentSeconds,
        answers: answersToPayload(answers),
      },
    }).then(normalizeAssessment);
  },

  updateMaterialProgress(materialId, payload) {
    return apiRequest(`/students/me/materials/${materialId}/progress`, {
      method: 'PUT',
      body: payload,
    });
  },

  createClass(payload) {
    return apiRequest('/admin/classes', {
      method: 'POST',
      body: payload,
    });
  },

  createSubject(payload) {
    return apiRequest('/admin/subjects', {
      method: 'POST',
      body: payload,
    });
  },

  importUsers(users) {
    return apiRequest('/admin/users/import', {
      method: 'POST',
      body: { users },
    });
  },

  resetUserPassword(userId, password) {
    return apiRequest(`/admin/users/${userId}/password`, {
      method: 'PATCH',
      body: { password },
    });
  },

  verifyUser(userId) {
    return apiRequest(`/auth/users/${userId}/verify`, {
      method: 'PATCH',
      body: {},
    });
  },

  createMaterial(payload) {
    return apiRequest('/materials', {
      method: 'POST',
      body: payload,
    }).then(normalizeMaterial);
  },

  createQuiz(payload) {
    return apiRequest('/quizzes', {
      method: 'POST',
      body: payload,
    }).then(normalizeQuiz);
  },

  sendIntervention(studentId, message) {
    return apiRequest(`/teachers/students/${studentId}/intervention`, {
      method: 'POST',
      body: { message },
    });
  },
};
