import { motion } from 'framer-motion';
import BottomNavigation from './BottomNavigation.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import TopHeader from './TopHeader.jsx';

export default function AppShell({ title, subtitle, navItems, activeTab, onTabChange, children, onLogout }) {
  return (
    <main className="app-root min-h-screen">
      <section className="app-frame relative min-h-screen w-full">
        <div className="app-ambient absolute inset-x-0 top-0 h-44 gold-gradient" />
        <div className="app-layout relative z-10 min-h-screen">
          <DesktopNavigation items={navItems} active={activeTab} onChange={onTabChange} />
          <div className="app-main safe-bottom px-3 pt-3">
            <TopHeader title={title} subtitle={subtitle} onLogout={onLogout} />
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="app-content mt-3"
            >
              {children}
            </motion.div>
          </div>
        </div>
        <BottomNavigation items={navItems} active={activeTab} onChange={onTabChange} />
      </section>
    </main>
  );
}
