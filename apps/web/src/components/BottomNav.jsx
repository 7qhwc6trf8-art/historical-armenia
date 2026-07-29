import { Clock3, Home, Map, Search, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { haptic } from '../lib/telegram.js';
import { isRootTab } from './IOSNavbar.jsx';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/timeline', label: 'Timeline', icon: Clock3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function BottomNav() {
  const location = useLocation();
  if (!isRootTab(location.pathname)) return null;

  return (
    <motion.nav
      className="ios-tabbar select-none"
      aria-label="Primary navigation"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, type: 'spring', stiffness: 340, damping: 30 }}
    >
      <div className="ios-tabbar__inner">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => haptic('selection')}
            className="ios-tabbar__item"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    className="ios-tabbar__active-bg"
                    layoutId="ios-tabbar-active"
                    transition={{ type: 'spring', stiffness: 430, damping: 34 }}
                  />
                )}
                <motion.span
                  className={`ios-tabbar__icon ${isActive ? 'is-active' : ''}`}
                  whileTap={{ scale: 0.82 }}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
                </motion.span>
                <span className={`ios-tabbar__label ${isActive ? 'is-active' : ''}`}>{label}</span>
                {isActive && <motion.i layoutId="ios-tabbar-dot" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
