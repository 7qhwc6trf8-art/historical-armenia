import { ChevronLeft, Layers3, LocateFixed, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';

export default function MapPage() {
  const [params] = useSearchParams();
  const region = params.get('region') || 'western';
  const title = region === 'eastern' ? 'Eastern Armenia' : 'Western Armenia';

  return (
    <div className="sub-page map-page">
      <header className="sub-header">
        <Link to="/" aria-label="Back"><ChevronLeft /></Link>
        <div><span>Interactive atlas</span><h1>{title}</h1></div>
        <button aria-label="Layers"><Layers3 /></button>
      </header>
      <div className="map-canvas glass-panel">
        <div className="map-grid" />
        <svg className="map-shape" viewBox="0 0 430 500" role="img" aria-label="Stylized historical region placeholder">
          <motion.path
            d="M77 134L150 82L242 96L323 151L350 240L310 333L237 403L140 378L73 303L50 211Z"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </svg>
        {['Van', 'Kars', 'Erzurum', 'Mush'].map((name, index) => (
          <motion.div
            className={`map-marker map-marker--${index + 1}`}
            key={name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.55 + index * 0.13, type: 'spring' }}
          >
            <MapPin size={18} fill="currentColor" /><span>{name}</span>
          </motion.div>
        ))}
        <motion.button className="locate-button" whileTap={{ scale: 0.9 }}><LocateFixed /></motion.button>
      </div>
      <motion.section
        className="map-sheet glass-panel"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, type: 'spring', damping: 22 }}
      >
        <i />
        <span>Selected province</span>
        <h2>Van Province</h2>
        <p>A rich historical layer will appear here with settlements, monuments, dates and cited sources.</p>
        <Link to="/place/van">View region</Link>
      </motion.section>
    </div>
  );
}
