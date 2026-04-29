import { api } from './api.js';

export async function authenticate({ email, password }) {
  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.');
  }

  const result = await api.login({ email, password });

  return {
    ok: true,
    ...result,
  };
}

export async function registerAccount({ name, email, password, role }) {
  if (role === 'admin') {
    throw new Error('Pendaftaran admin hanya dapat dilakukan oleh administrator sistem.');
  }

  const payload = {
    name,
    email,
    password,
    role,
  };

  const result = await api.register(payload);

  return {
    ok: true,
    ...result,
  };
}

export async function getCurrentUser() {
  return api.me();
}
