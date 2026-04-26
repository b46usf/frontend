import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './app/auth/LoginPage.jsx';
import StudentApp from './app/student/StudentApp.jsx';
import TeacherApp from './app/teacher/TeacherApp.jsx';
import AdminApp from './app/admin/AdminApp.jsx';
import { useUserStore } from './store/userStore.js';
import { showConfirmDialog, showToast } from './utils/alerts.js';

const roleApps = {
  student: StudentApp,
  teacher: TeacherApp,
  admin: AdminApp,
};

export default function App() {
  const { isAuthenticated, role, logout, theme } = useUserStore();
  const RoleApp = roleApps[role] || StudentApp;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const handleLogout = async () => {
    const result = await showConfirmDialog({
      title: 'Keluar dari EduSense?',
      text: 'Kemajuan belajar tetap tersimpan di perangkat ini.',
      icon: 'question',
      confirmButtonText: 'Keluar',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      logout();
      showToast({ title: 'Berhasil keluar' });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div key={role} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <RoleApp onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
