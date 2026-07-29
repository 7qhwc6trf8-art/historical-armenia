import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { haptic } from '../lib/telegram.js';

export default function RegionCard({ region, index }) {
  return (
    <motion.article
      className={`region-card region-card--${region.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/map?region=${region.id}`} onClick={() => haptic('medium')}>
        <span className="region-card__eyebrow">Explore</span>
        <h2>{region.title}</h2>
        <p>{region.subtitle}</p>
        {Number.isFinite(region.placeCount) && <small className="region-card__count">{region.placeCount} catalog places</small>}
        <span className="region-card__cta">
          Open atlas <ArrowUpRight size={17} />
        </span>
      </Link>
    </motion.article>
  );
}
