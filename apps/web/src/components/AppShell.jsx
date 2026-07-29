import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { configureTelegramBackButton, haptic } from '../lib/telegram.js';
import AnimatedBackground from './AnimatedBackground.jsx';
import BottomNav from './BottomNav.jsx';
import IOSNavbar, { isRootTab } from './IOSNavbar.jsx';
import { PageHeaderProvider } from './PageHeaderContext.jsx';

const tabOrder = ['/', '/map', '/search', '/timeline', '/profile'];

function routeIndex(pathname) {
  if (pathname.startsWith('/place/')) return 6;
  const index = tabOrder.indexOf(pathname);
  return index === -1 ? 5 : index;
}

function AppShellLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const previousIndex = useRef(routeIndex(location.pathname));
  const reduceMotion = useReducedMotion();

  const currentIndex = routeIndex(location.pathname);
  const direction = currentIndex >= previousIndex.current ? 1 : -1;
  const showTabs = isRootTab(location.pathname);

  useEffect(() => {
    previousIndex.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const visible = !isRootTab(location.pathname);
    const onBack = () => {
      haptic('light');
      if (window.history.length > 1) navigate(-1);
      else navigate('/', { replace: true });
    };
    return configureTelegramBackButton({ visible, onClick: onBack });
  }, [location.pathname, navigate]);

  const variants = useMemo(() => ({
    initial: (customDirection) => reduceMotion ? { opacity: 0 } : {
      opacity: 0,
      x: customDirection > 0 ? 28 : -28,
      scale: 0.992,
      filter: 'blur(3px)',
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (customDirection) => reduceMotion ? { opacity: 0 } : {
      opacity: 0,
      x: customDirection > 0 ? -18 : 18,
      scale: 0.995,
      filter: 'blur(2px)',
    },
  }), [reduceMotion]);

  return (
    <div className={`app-shell ${showTabs ? 'has-tabbar' : 'has-no-tabbar'}`}>
      <AnimatedBackground />
      <IOSNavbar pathname={location.pathname} />
      <main ref={mainRef} className="app-main" id="app-scroll-container">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            className="route-stage"
            key={location.pathname}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.12 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <PageHeaderProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </PageHeaderProvider>
  );
}
