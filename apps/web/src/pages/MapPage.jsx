import { LocateFixed, MapPin } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchMapContent } from '../lib/api.js';
import { haptic } from '../lib/telegram.js';
import { usePageHeader } from '../components/PageHeaderContext.jsx';

const fallback = {
  western: {
    region: {
      id: 'western',
      title: 'Western Armenia',
      armenianTitle: 'Արևմտյան Հայաստան',
      description: 'Historical places and cultural landscapes shown with period-aware naming.',
    },
    places: [
      { slug: 'van', title: 'Van Province', armenianTitle: 'Վանի նահանգ', kind: 'province', map: { x: 52, y: 52 }, summary: 'Historic province centered on Lake Van.', featured: true },
      { slug: 'ani', title: 'Ani', armenianTitle: 'Անի', kind: 'city', map: { x: 31, y: 30 }, summary: 'Medieval Armenian capital.', featured: true },
      { slug: 'kars', title: 'Kars', armenianTitle: 'Կարս', kind: 'city', map: { x: 24, y: 23 }, summary: 'Historic fortified city.' },
      { slug: 'mush', title: 'Mush', armenianTitle: 'Մուշ', kind: 'city', map: { x: 43, y: 69 }, summary: 'Historic city and plain.' },
    ],
  },
  eastern: {
    region: {
      id: 'eastern',
      title: 'Eastern Armenia',
      armenianTitle: 'Արևելյան Հայաստան',
      description: 'Historic settlements, monasteries and living cultural heritage.',
    },
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
  const reduceMotion = useReducedMotion();
  const requestedRegion = params.get('region') === 'eastern' ? 'eastern' : 'western';
  const [payload, setPayload] = useState(fallback[requestedRegion]);
  const [selectedSlug, setSelectedSlug] = useState(payload.places[0]?.slug);
  const [loading, setLoading] = useState(false);

  usePageHeader({
    title: 'Map',
    subtitle: requestedRegion === 'eastern' ? 'Eastern Armenia' : 'Western Armenia',
  });

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
    <div className="sub-page map-page ios-map-page">
      <motion.div
        className="region-switch ios-segmented-control"
        role="tablist"
        aria-label="Atlas region"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {['western', 'eastern'].map((region) => {
          const active = requestedRegion === region;
          return (
            <button
              key={region}
              className={active ? 'is-active' : ''}
              onClick={() => changeRegion(region)}
              role="tab"
              aria-selected={active}
              type="button"
            >
              {active && (
                <motion.span
                  className="ios-segmented-control__selection"
                  layoutId="atlas-region-selection"
                  transition={{ type: 'spring', stiffness: 470, damping: 38 }}
                />
              )}
              <span>{region === 'western' ? 'Western' : 'Eastern'}</span>
            </button>
          );
        })}
      </motion.div>

      <motion.section
        className={`map-canvas ios-map-canvas ${loading ? 'is-loading' : ''}`}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="map-atmosphere" aria-hidden="true" />
        <div className="map-grid" aria-hidden="true" />
        <div className="map-label map-label--north">Black Sea</div>
        <div className="map-label map-label--east">Georgia</div>

        <svg className="map-shape" viewBox="0 0 430 500" role="img" aria-label={`Stylized ${payload.region.title} discovery map`}>
          <defs>
            <linearGradient id="atlasFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9d7137" stopOpacity="0.42" />
              <stop offset="1" stopColor="#503719" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.path
            key={requestedRegion}
            d={paths[requestedRegion]}
            fill="url(#atlasFill)"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.15 : 1.05, ease: 'easeInOut' }}
          />
        </svg>

        {payload.places.map((place, index) => {
          const active = selected?.slug === place.slug;
          return (
            <motion.button
              type="button"
              className={`map-marker ${active ? 'is-selected' : ''}`}
              style={{ left: `${place.map.x}%`, top: `${place.map.y}%` }}
              key={place.slug}
              initial={reduceMotion ? false : { scale: 0.3, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.18 + index * 0.065, type: 'spring', stiffness: 420, damping: 25 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                haptic('light');
                setSelectedSlug(place.slug);
              }}
              aria-label={`Select ${place.title}`}
            >
              {active && (
                <motion.span
                  className="map-marker__pulse"
                  layoutId="active-map-marker"
                  transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                />
              )}
              <span className="map-marker__pin"><MapPin size={18} fill="currentColor" /></span>
              <span className="map-marker__label">{place.title}</span>
            </motion.button>
          );
        })}

        <motion.button
          className="locate-button ios-circle-button"
          whileTap={{ scale: 0.88 }}
          aria-label="Center map"
          type="button"
          onClick={() => haptic('medium')}
        >
          <LocateFixed size={21} />
        </motion.button>
      </motion.section>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.section
            key={selected.slug}
            className="map-sheet ios-map-sheet"
            initial={reduceMotion ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: 18, opacity: 0, scale: 0.99 }}
            transition={{ type: 'spring', damping: 29, stiffness: 330 }}
          >
            <i aria-hidden="true" />
            <div className="ios-map-sheet__content">
              <div className="ios-map-sheet__copy">
                <span>{selected.kind}</span>
                <h2>{selected.title}</h2>
                <em>{selected.armenianTitle}</em>
                <p>{selected.summary}</p>
              </div>
              <Link to={`/place/${selected.slug}`} onClick={() => haptic('medium')}>
                View Region <b>›</b>
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
