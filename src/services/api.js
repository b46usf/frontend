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

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
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

async function requestPayload(path, options = {}) {
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

  return payload;
}

export async function apiRequest(path, options = {}) {
  const payload = await requestPayload(path, options);

  return payload?.data ?? null;
}

export async function apiRequestWithMeta(path, options = {}) {
  const payload = await requestPayload(path, options);

  return {
    data: payload?.data ?? null,
    meta: payload?.meta || {},
  };
}

function mapListResponse(response, mapper) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'meta')) {
    return {
      ...response,
      data: (response.data || []).map(mapper),
    };
  }

  return (response || []).map(mapper);
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

  listMaterials(params = {}, options = {}) {
    const request = options.withMeta
      ? apiRequestWithMeta(`/materials${buildQuery(params)}`)
      : apiRequest(`/materials${buildQuery(params)}`);

    return request.then((response) => mapListResponse(response, normalizeMaterial));
  },

  listQuizzes(params = {}, options = {}) {
    if (typeof params === 'string') {
      return apiRequest(`/quizzes${params}`).then(normalizeQuizList);
    }

    const request = options.withMeta
      ? apiRequestWithMeta(`/quizzes${buildQuery(params)}`)
      : apiRequest(`/quizzes${buildQuery(params)}`);

    return request.then((response) => mapListResponse(response, normalizeQuiz));
  },

  listStudents(params = {}, options = {}) {
    return options.withMeta
      ? apiRequestWithMeta(`/students${buildQuery(params)}`)
      : apiRequest(`/students${buildQuery(params)}`);
  },

  listAttempts(params = {}, options = {}) {
    return options.withMeta
      ? apiRequestWithMeta(`/assessments/attempts${buildQuery(params)}`)
      : apiRequest(`/assessments/attempts${buildQuery(params)}`);
  },

  listClasses(params = {}, options = {}) {
    return options.withMeta
      ? apiRequestWithMeta(`/admin/classes${buildQuery(params)}`)
      : apiRequest(`/admin/classes${buildQuery(params)}`);
  },

  listSubjects(params = {}, options = {}) {
    return options.withMeta
      ? apiRequestWithMeta(`/admin/subjects${buildQuery(params)}`)
      : apiRequest(`/admin/subjects${buildQuery(params)}`);
  },

  listTeachers(params = {}, options = {}) {
    return options.withMeta
      ? apiRequestWithMeta(`/teachers${buildQuery(params)}`)
      : apiRequest(`/teachers${buildQuery(params)}`);
  },

  getStudentDashboard() {
    return Promise.all([
      apiRequest('/students/me/dashboard'),
      apiRequest('/students/me/recommendations?page=1&limit=8'),
      apiRequest('/students/me/progress?page=1&limit=8'),
      apiRequest('/students/me/badges?page=1&limit=8'),
      apiRequest('/ai/diagnostic').then(normalizeDiagnostic),
      apiRequest('/ai/learning-path/me'),
      apiRequest('/ai/feedback-card/me').then(normalizeAssessment).catch(() => null),
      apiRequest('/ai/performance/me').catch(() => null),
      apiRequest('/materials?page=1&limit=8').then((items) => items.map(normalizeMaterial)),
      apiRequest('/quizzes?quizType=practice&page=1&limit=6').then(normalizeQuizList),
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
      apiRequest('/ai/risk-students?page=1&limit=8').then((items) => items.map(normalizeRiskStudent)),
      apiRequest('/ai/recommendations'),
      apiRequest('/analytics/dashboard'),
      apiRequest('/students?page=1&limit=10'),
      apiRequest('/assessments/attempts?page=1&limit=8'),
      apiRequest('/materials?page=1&limit=8').then((items) => items.map(normalizeMaterial)),
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
      apiRequest('/admin/classes?page=1&limit=8'),
      apiRequest('/admin/subjects?page=1&limit=8'),
      apiRequest('/analytics/dashboard'),
      apiRequest('/teachers?page=1&limit=8'),
      apiRequest('/students?page=1&limit=10'),
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
