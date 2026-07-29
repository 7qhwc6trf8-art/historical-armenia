import { ChevronLeft, Layers3, LocateFixed, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchMapContent } from '../lib/api.js';
import { haptic } from '../lib/telegram.js';

const fallback = {
  western: {
    region: { id: 'western', title: 'Western Armenia', armenianTitle: 'Արևմտյան Հայաստան', description: 'Historical places and cultural landscapes shown with period-aware naming.' },
    places: [
      { slug: 'van', title: 'Van Province', armenianTitle: 'Վանի նահանգ', kind: 'province', map: { x: 52, y: 52 }, summary: 'Historic province centered on Lake Van.', featured: true },
      { slug: 'ani', title: 'Ani', armenianTitle: 'Անի', kind: 'city', map: { x: 31, y: 30 }, summary: 'Medieval Armenian capital.', featured: true },
      { slug: 'kars', title: 'Kars', armenianTitle: 'Կարս', kind: 'city', map: { x: 24, y: 23 }, summary: 'Historic fortified city.' },
      { slug: 'mush', title: 'Mush', armenianTitle: 'Մուշ', kind: 'city', map: { x: 43, y: 69 }, summary: 'Historic city and plain.' },
    ],
  },
  eastern: {
    region: { id: 'eastern', title: 'Eastern Armenia', armenianTitle: 'Արևելյան Հայաստան', description: 'Historic settlements, monasteries and living cultural heritage.' },
    places: [
      { slug: 'yerevan', title: 'Yerevan', armenianTitle: 'Երևան', kind: 'city', map: { x: 48, y: 54 }, summary: 'Multi-period capital city.', featured: true },
      { slug: 'garni', title: 'Garni', armenianTitle: 'Գառնի', kind: 'monument', map: { x: 60, y: 51 }, summary: 'Ancient and medieval site.', featured: true },
      { slug: 'tatev', title: 'Tatev Monastery', armenianTitle: 'Տաթև', kind: 'monastery', map: { x: 53, y: 80 }, summary: 'Medieval monastery in Syunik.', featured: true },
      { slug: 'haghpat', title: 'Haghpat Monastery', armenianTitle: 'Հաղպատ', kind: 'monastery', map: { x: 45, y: 20 }, summary: 'Medieval monastery in Lori.' },
    ],
  },
};

const paths = {
  western: 'M77 134L150 82L242 96L323 151L350 240L310 333L237 403L140 378L73 303L50 211Z',
  eastern: 'M190 51L266 93L316 169L288 246L326 320L268 421L176 401L116 325L89 236L126 145Z',
};

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const requestedRegion = params.get('region') === 'eastern' ? 'eastern' : 'western';
  const [payload, setPayload] = useState(fallback[requestedRegion]);
  const [selectedSlug, setSelectedSlug] = useState(payload.places[0]?.slug);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPayload(fallback[requestedRegion]);
    setSelectedSlug(fallback[requestedRegion].places[0]?.slug);
    fetchMapContent(requestedRegion)
      .then((data) => {
        if (!active) return;
        setPayload(data);
        setSelectedSlug(data.places.find((place) => place.featured)?.slug || data.places[0]?.slug);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [requestedRegion]);

  const selected = useMemo(
    () => payload.places.find((place) => place.slug === selectedSlug) || payload.places[0],
    [payload.places, selectedSlug],
  );

  const changeRegion = (region) => {
    haptic('selection');
    setParams({ region });
  };

  return (
    <div className="sub-page map-page">
      <header className="sub-header">
        <Link to="/" aria-label="Back"><ChevronLeft /></Link>
        <div><span>Interactive atlas</span><h1>{payload.region.title}</h1></div>
        <button aria-label="Map layers" onClick={() => haptic('light')}><Layers3 /></button>
      </header>

      <div className="region-switch glass-panel" role="tablist" aria-label="Atlas region">
        {['western', 'eastern'].map((region) => (
          <button
            key={region}
            className={requestedRegion === region ? 'is-active' : ''}
            onClick={() => changeRegion(region)}
            role="tab"
            aria-selected={requestedRegion === region}
          >
            {region === 'western' ? 'Western' : 'Eastern'}
          </button>
        ))}
      </div>

      <div className={`map-canvas glass-panel ${loading ? 'is-loading' : ''}`}>
        <div className="map-grid" />
        <svg className="map-shape" viewBox="0 0 430 500" role="img" aria-label={`Stylized ${payload.region.title} discovery map`}>
          <motion.path
            key={requestedRegion}
            d={paths[requestedRegion]}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.05, ease: 'easeInOut' }}
          />
        </svg>

        {payload.places.map((place, index) => (
          <motion.button
            type="button"
            className={`map-marker ${selected?.slug === place.slug ? 'is-selected' : ''}`}
            style={{ left: `${place.map.x}%`, top: `${place.map.y}%` }}
            key={place.slug}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 + index * 0.07, type: 'spring' }}
            onClick={() => {
              haptic('light');
              setSelectedSlug(place.slug);
            }}
            aria-label={`Select ${place.title}`}
          >
            <span className="map-marker__pin"><MapPin size={18} fill="currentColor" /></span>
            <span className="map-marker__label">{place.title}</span>
          </motion.button>
        ))}

        <motion.button className="locate-button" whileTap={{ scale: 0.9 }} aria-label="Center map" onClick={() => haptic('medium')}>
          <LocateFixed />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.section
            key={selected.slug}
            className="map-sheet glass-panel"
            initial={{ y: 45, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          >
            <i />
            <span>{selected.kind}</span>
            <h2>{selected.title}</h2>
            <em>{selected.armenianTitle}</em>
            <p>{selected.summary}</p>
            <Link to={`/place/${selected.slug}`}>View historical record</Link>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
