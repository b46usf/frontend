import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPage from './app/auth/LoginPage.jsx';
import StudentApp from './app/student/StudentApp.jsx';
import TeacherApp from './app/teacher/TeacherApp.jsx';
import AdminApp from './app/admin/AdminApp.jsx';
import { useUserStore } from './store/userStore.js';
import { getCurrentUser } from './services/authService.js';
import { api } from './services/api.js';
import { showConfirmDialog, showToast } from './utils/alerts.js';

const roleApps = {
  student: StudentApp,
  teacher: TeacherApp,
  admin: AdminApp,
};

export default function App() {
  const { isAuthenticated, role, logout, theme, token, user, setUser, setDashboard } = useUserStore();
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));
  const [isSyncingDashboard, setIsSyncingDashboard] = useState(false);
  const RoleApp = roleApps[role] || StudentApp;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return undefined;
    }

    let isActive = true;

    getCurrentUser()
      .then((profile) => {
        if (isActive) {
          setUser(profile);
        }
      })
      .catch(() => {
        if (isActive) {
          logout();
          showToast({ icon: 'warning', title: 'Sesi berakhir, silakan masuk lagi' });
        }
      })
      .finally(() => {
        if (isActive) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [logout, setUser, token]);

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return undefined;
    }

    let isActive = true;
    setIsSyncingDashboard(true);

    api.getDashboard(role)
      .then((dashboard) => {
        if (isActive) {
          setDashboard(role, dashboard);
        }
      })
      .catch((error) => {
        if (isActive) {
          showToast({ icon: 'warning', title: error.message || 'Dashboard backend belum tersedia' });
        }
      })
      .finally(() => {
        if (isActive) {
          setIsSyncingDashboard(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, role, setDashboard]);

  const handleLogout = async () => {
    const result = await showConfirmDialog({
      title: 'Keluar dari EduSense?',
      text: 'Sesi backend akan dihapus dari perangkat ini.',
      icon: 'question',
      confirmButtonText: 'Keluar',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      logout();
      showToast({ title: 'Berhasil keluar' });
    }
  };

  if (isBootstrapping) {
    return (
      <main className="grid min-h-screen place-items-center bg-navy px-6 text-center text-white">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold">EduSense AI</p>
          <h1 className="mt-3 text-2xl font-black">Menyambungkan sesi...</h1>
          <p className="mt-2 text-sm font-semibold text-slate-300">Mengambil profil dari backend.</p>
        </div>
      </main>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div key={role} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <RoleApp onLogout={handleLogout} user={user} isSyncingDashboard={isSyncingDashboard} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
