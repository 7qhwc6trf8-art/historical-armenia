import { Clock3, Home, Map, Search, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { haptic } from '../lib/telegram.js';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/timeline', label: 'Timeline', icon: Clock3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => haptic('light')}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <motion.span whileTap={{ scale: 0.82 }} className="bottom-nav__icon">
                <Icon size={21} strokeWidth={isActive ? 2.2 : 1.7} />
              </motion.span>
              <span>{label}</span>
              {isActive && <motion.i layoutId="nav-dot" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
