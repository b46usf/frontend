import { motion } from 'framer-motion';
import BottomNavigation from './BottomNavigation.jsx';
import TopHeader from './TopHeader.jsx';

export default function AppShell({ title, subtitle, navItems, activeTab, onTabChange, children, onLogout }) {
  return (
    <main className="app-root min-h-screen sm:flex sm:justify-center">
      <section className="app-frame relative min-h-screen w-full overflow-hidden sm:max-w-[430px] sm:shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-44 gold-gradient" />
        <div className="relative z-10 safe-bottom px-3 pt-3">
          <TopHeader title={title} subtitle={subtitle} onLogout={onLogout} />
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="mt-3 space-y-3"
          >
            {children}
          </motion.div>
        </div>
        <BottomNavigation items={navItems} active={activeTab} onChange={onTabChange} />
      </section>
    </main>
  );
}
