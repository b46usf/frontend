import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.localStorage.getItem('edusense-theme') || 'dark';
};

export const useUserStore = create((set) => ({
  isAuthenticated: false,
  role: 'student',
  theme: getInitialTheme(),
  user: {
    name: 'Alya Prameswari',
    school: 'SMA Nusantara',
    className: 'XI IPA 2',
    avatar: 'AP',
  },
  login: (role) =>
    set({
      isAuthenticated: true,
      role,
      user:
        role === 'teacher'
          ? { name: 'Bu Rani Wijaya', school: 'SMA Nusantara', className: 'Matematika', avatar: 'RW' }
          : role === 'admin'
            ? { name: 'Admin Sekolah', school: 'SMA Nusantara', className: 'Operator', avatar: 'AS' }
            : { name: 'Alya Prameswari', school: 'SMA Nusantara', className: 'XI IPA 2', avatar: 'AP' },
    }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('edusense-theme', theme);
    }
    set({ theme });
  },
  logout: () => set({ isAuthenticated: false, role: 'student' }),
}));
