import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppShell({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <AnimatedBackground />
      <main className="app-main">
        <AnimatePresence mode="wait">
          <motion.div
            className="route-stage"
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
