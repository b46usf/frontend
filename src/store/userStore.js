import { create } from 'zustand';
import { getAuthToken, setAuthToken } from '../services/api.js';

const USER_STORAGE_KEY = 'edusense-auth-user';

const defaultUsers = {
  student: { name: 'Siswa', school: 'Sekolah', className: 'Kelas', avatar: 'S' },
  teacher: { name: 'Guru', school: 'Sekolah', className: 'Pengajar', avatar: 'G' },
  admin: { name: 'Admin', school: 'Sekolah', className: 'Operator', avatar: 'A' },
};

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.localStorage.getItem('edusense-theme') || 'dark';
};

const readStoredUser = () => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const getRole = (user) => user?.role || 'student';

const normalizeUser = (user) => {
  const role = getRole(user);
  const fallback = defaultUsers[role] || defaultUsers.student;
  const name = user?.name || fallback.name;

  return {
    ...fallback,
    ...user,
    role,
    name,
    school: user?.school || user?.school_name || fallback.school,
    className: user?.className || user?.class_name || user?.specialization || fallback.className,
    avatar: user?.avatar || name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
  };
};

const initialToken = getAuthToken();
const initialUser = normalizeUser(readStoredUser());

export const useUserStore = create((set) => ({
  isAuthenticated: Boolean(initialToken),
  token: initialToken,
  role: initialUser.role,
  theme: getInitialTheme(),
  user: initialUser,
  dashboards: {},
  login: (role) => {
    const nextUser = normalizeUser({ ...defaultUsers[role], role });
    set({
      isAuthenticated: true,
      role,
      user: nextUser,
    });
  },
  setSession: ({ token, user }) => {
    const nextUser = normalizeUser(user);

    setAuthToken(token);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    }

    set({
      isAuthenticated: Boolean(token),
      token,
      role: nextUser.role,
      user: nextUser,
    });
  },
  setUser: (user) => {
    const nextUser = normalizeUser(user);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    }

    set({
      role: nextUser.role,
      user: nextUser,
    });
  },
  setDashboard: (role, dashboard) =>
    set((state) => ({
      dashboards: {
        ...state.dashboards,
        [role]: dashboard,
      },
    })),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('edusense-theme', theme);
    }
    set({ theme });
  },
  logout: () => {
    setAuthToken(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }

    set({
      isAuthenticated: false,
      token: null,
      role: 'student',
      user: normalizeUser({ ...defaultUsers.student, role: 'student' }),
      dashboards: {},
    });
  },
}));
