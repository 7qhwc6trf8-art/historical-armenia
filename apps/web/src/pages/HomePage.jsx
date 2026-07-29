import { BookOpenText, Church, Landmark, MapPinned, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RegionCard from '../components/RegionCard.jsx';
import { fetchHomeContent } from '../lib/api.js';
import { haptic } from '../lib/telegram.js';

const fallback = {
  regions: [
    { id: 'western', title: 'Western Armenia', subtitle: 'Historic provinces, cities and monuments' },
    { id: 'eastern', title: 'Eastern Armenia', subtitle: 'Regions, settlements and cultural heritage' },
  ],
  periods: [
    { id: 'ancient', title: 'Ancient', range: 'Before 301' },
    { id: 'medieval', title: 'Medieval', range: '301–1800' },
    { id: 'modern', title: '19th Century', range: '1800–1918' },
    { id: 'republic', title: '1918–1920', range: 'First Republic' },
  ],
};

const shortcuts = [
  { icon: MapPinned, label: 'Regions', to: '/map' },
  { icon: Landmark, label: 'Settlements', to: '/search?type=settlement' },
  { icon: Church, label: 'Monuments', to: '/search?type=monument' },
  { icon: BookOpenText, label: 'History', to: '/timeline' },
];

export default function HomePage({ user }) {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    fetchHomeContent().then(setContent).catch(() => setContent(fallback));
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__image" />
        <div className="hero__shade" />
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero__kicker">Virtual Historical</span>
          <h1>ARMENIA</h1>
          <p>Explore the lands, history and heritage of our ancestors.</p>
          {user?.firstName && <span className="hero__welcome">Welcome, {user.firstName}</span>}
        </motion.div>
      </section>

      <section className="content-stack">
        <motion.div
          className="search-box glass-panel"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
        >
          <Search size={21} />
          <input aria-label="Search" placeholder="Search regions, cities, monuments…" />
          <motion.button whileTap={{ scale: 0.9 }} aria-label="Open filters" onClick={() => haptic('light')}>
            <SlidersHorizontal size={19} />
          </motion.button>
        </motion.div>

        <div className="region-grid">
          {content.regions.map((region, index) => (
            <RegionCard key={region.id} region={region} index={index} />
          ))}
        </div>

        <div className="shortcut-grid">
          {shortcuts.map(({ icon: Icon, label, to }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + index * 0.05 }}
            >
              <Link className="shortcut" to={to} onClick={() => haptic('light')}>
                <span><Icon size={21} /></span>
                <small>{label}</small>
              </Link>
            </motion.div>
          ))}
        </div>

        <section className="section-card glass-panel">
          <div className="section-heading">
            <div>
              <span className="section-heading__eyebrow">Travel through history</span>
              <h2>Timeline</h2>
            </div>
            <Link to="/timeline">View all</Link>
          </div>
          <div className="period-scroller">
            {content.periods.map((period, index) => (
              <motion.button
                className={`period-card ${index === 2 ? 'is-selected' : ''}`}
                key={period.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => haptic('selection')}
              >
                <strong>{period.title}</strong>
                <span>{period.range}</span>
              </motion.button>
            ))}
          </div>
        </section>

        <motion.section
          className="featured-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.6 }}
        >
          <div className="featured-card__shade" />
          <div className="featured-card__content">
            <span>Featured region</span>
            <h2>Van Province</h2>
            <p>Historic Armenian province surrounding Lake Van.</p>
            <Link to="/place/van">Explore region <span>→</span></Link>
          </div>
        </motion.section>
      </section>
    </div>
  );
}
