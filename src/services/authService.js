import { api } from './api.js';

export const demoAccounts = {
  student: {
    email: 'student@edusense.ai',
    password: 'demo12345',
  },
  teacher: {
    email: 'teacher@edusense.ai',
    password: 'demo12345',
  },
  admin: {
    email: 'admin@edusense.ai',
    password: 'demo12345',
  },
};

export async function authenticate({ email, password, role = 'student' }) {
  const credentials = {
    email: email || demoAccounts[role]?.email || demoAccounts.student.email,
    password: password || demoAccounts[role]?.password || demoAccounts.student.password,
  };
  const result = await api.login(credentials);

  return {
    ok: true,
    ...result,
  };
}

export async function registerAccount({ name, email, password, role }) {
  const payload = {
    name,
    email,
    password,
    role,
  };

  if (role === 'student') {
    payload.classId = 1;
    payload.studentNumber = `REG-${Date.now()}`;
  }

  if (role === 'teacher') {
    payload.employeeNumber = `EMP-${Date.now()}`;
    payload.position = 'teacher';
    payload.specialization = 'Demo Subject';
  }

  const result = await api.register(payload);

  return {
    ok: true,
    ...result,
  };
}

export async function getCurrentUser() {
  return api.me();
}
