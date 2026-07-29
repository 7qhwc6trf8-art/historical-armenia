import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { haptic } from '../lib/telegram.js';
import { useResolvedPageHeader } from './PageHeaderContext.jsx';

const rootTabs = new Set(['/', '/map', '/search', '/timeline', '/profile']);

export function isRootTab(pathname) {
  return rootTabs.has(pathname);
}

export default function IOSNavbar({ pathname }) {
  const navigate = useNavigate();
  const metadata = useResolvedPageHeader();
  const canGoBack = !isRootTab(pathname);

  const goBack = () => {
    haptic('light');
    if (window.history.length > 1) navigate(-1);
    else navigate('/', { replace: true });
  };

  return (
    <header className="ios-navbar select-none" aria-label="App navigation">
      <div className="ios-navbar__inner">
        <div className="ios-navbar__side ios-navbar__side--left">
          {canGoBack && (
            <motion.button
              type="button"
              className="ios-navbar__button browser-back-button grid place-items-center"
              aria-label="Go back"
              whileTap={{ scale: 0.88 }}
              onClick={goBack}
            >
              <ChevronLeft size={24} strokeWidth={2.1} />
            </motion.button>
          )}
        </div>

        <motion.div
          className="ios-navbar__title"
          key={`${metadata.subtitle}-${metadata.title}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {metadata.subtitle && <span>{metadata.subtitle}</span>}
          <strong>{metadata.title}</strong>
        </motion.div>

        <div className="ios-navbar__side ios-navbar__side--right" aria-hidden="true" />
      </div>
    </header>
  );
}
