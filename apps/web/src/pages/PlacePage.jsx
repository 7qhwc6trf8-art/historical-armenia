import { Bookmark, Clock3, Images, Info, MapPinned, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPlace, toggleFavorite } from '../lib/api.js';
import { isFavorite, toggleLocalFavorite } from '../lib/favorites.js';
import { haptic } from '../lib/telegram.js';
import { usePageHeader } from '../components/PageHeaderContext.jsx';

const tabDefinitions = [
  { id: 'info', label: 'Info', icon: Info },
  { id: 'history', label: 'History', icon: Clock3 },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'map', label: 'Map', icon: MapPinned },
];

export default function PlacePage() {
  const { slug = '' } = useParams();
  const [place, setPlace] = useState(null);
  const [status, setStatus] = useState('loading');
  const [saved, setSaved] = useState(() => isFavorite(slug));
  const [activeTab, setActiveTab] = useState('info');

  usePageHeader({
    title: place?.title || 'Place',
    subtitle: place
      ? `${place.region === 'western' ? 'Western Armenia' : 'Eastern Armenia'} · ${place.kind}`
      : 'Historical Record',
  });

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setPlace(null);
    setSaved(isFavorite(slug));
    fetchPlace(slug)
      .then(({ place: result }) => {
        if (!active) return;
        setPlace(result);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => { active = false; };
  }, [slug]);

  const save = async () => {
    haptic('medium');
    const next = toggleLocalFavorite(slug);
    setSaved(next);
    try { await toggleFavorite(slug); } catch { /* local favorite remains available */ }
  };

  if (status === 'loading') {
    return <div className="sub-page page-loader"><div className="boot-mark">Ա</div><div className="boot-line"><i /></div></div>;
  }

  if (status === 'error' || !place) {
    return (
      <div className="sub-page placeholder-page">
        <div className="placeholder-card glass-panel">
          <span>Historical record</span>
          <h1>Place not found</h1>
          <p>This place is unavailable or the secure session has expired.</p>
          <Link className="inline-action" to="/search">Return to search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="place-page">
      <section className="place-hero">
        <div className="place-hero__image" style={{ backgroundPosition: place.heroPosition || '72% center' }} />
        <div className="place-hero__shade" />
        <motion.div className="place-hero__title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <span>{place.region === 'western' ? 'Western Armenia' : 'Eastern Armenia'} · {place.kind}</span>
          <h1>{place.title}</h1>
          <p>{place.armenianTitle}</p>
        </motion.div>
      </section>

      <div className="place-content">
        <div className="detail-tabs glass-panel">
          {tabDefinitions.map(({ id, label, icon: Icon }) => (
            <button
              className={activeTab === id ? 'is-active' : ''}
              key={id}
              onClick={() => {
                haptic('selection');
                setActiveTab(id);
              }}
            >
              <Icon size={19} /><span>{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            className="detail-card glass-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {activeTab === 'info' && (
              <>
                <span>About</span>
                <h2>{place.summary}</h2>
                <p>{place.description}</p>
                <dl>
                  {place.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
                  <div><dt>Current name field</dt><dd>{place.currentName}</dd></div>
                </dl>
              </>
            )}

            {activeTab === 'history' && (
              <>
                <span>Period layers</span>
                <h2>Historical timeline coverage</h2>
                <p>This record is connected to the following atlas periods. Future releases will show a separate narrative and boundary layer for each one.</p>
                <div className="tag-list">{place.periodIds.map((period) => <span key={period}>{period.replace('-', ' ')}</span>)}</div>
              </>
            )}

            {activeTab === 'gallery' && (
              <>
                <span>Editorial gallery</span>
                <h2>Licensed images coming next</h2>
                <p>Images will be attached only after license, caption, date and source fields have been reviewed.</p>
                <div className="gallery-skeleton"><i /><i /><i /></div>
              </>
            )}

            {activeTab === 'map' && (
              <>
                <span>Geography policy</span>
                <h2>Historical and present-day layers stay separate</h2>
                <p>Coordinates and boundaries will be tied to a selected period. Present-day administrative geography will be shown as a distinct optional overlay.</p>
                <Link className="inline-action" to={`/map?region=${place.region}`}>Open regional map</Link>
              </>
            )}
          </motion.section>
        </AnimatePresence>

        <section className="source-card glass-panel">
          <div><ShieldCheck size={20} /><strong>Source-first record</strong></div>
          <p>{place.sourceCount} bibliography placeholder{place.sourceCount === 1 ? '' : 's'} · editorial approval required before publication.</p>
        </section>

        <motion.button className={`favorite-button ${saved ? 'is-saved' : ''}`} whileTap={{ scale: 0.97 }} onClick={save}>
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved on this device' : 'Add to favorites'}
        </motion.button>
      </div>
    </div>
  );
}
