import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchPlaces } from '../lib/api.js';
import { haptic } from '../lib/telegram.js';

const kindOptions = [
  { id: 'all', label: 'All' },
  { id: 'city', label: 'Cities' },
  { id: 'province', label: 'Provinces' },
  { id: 'monastery', label: 'Monasteries' },
  { id: 'monument', label: 'Monuments' },
];

const regionOptions = [
  { id: 'all', label: 'Both' },
  { id: 'western', label: 'Western' },
  { id: 'eastern', label: 'Eastern' },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get('q') || '';
  const initialKind = kindOptions.some((item) => item.id === params.get('kind')) ? params.get('kind') : 'all';
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState(initialKind);
  const [region, setRegion] = useState(params.get('region') === 'western' || params.get('region') === 'eastern' ? params.get('region') : 'all');
  const [payload, setPayload] = useState({ results: [], total: 0 });
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setStatus('loading');
      searchPlaces({ q: query.trim(), kind, region, limit: 30 })
        .then((result) => {
          if (!active) return;
          setPayload(result);
          setStatus('ready');
        })
        .catch(() => active && setStatus('error'));
    }, 220);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, kind, region]);

  useEffect(() => {
    const next = {};
    if (query.trim()) next.q = query.trim();
    if (kind !== 'all') next.kind = kind;
    if (region !== 'all') next.region = region;
    setParams(next, { replace: true });
  }, [query, kind, region, setParams]);

  const summary = useMemo(() => {
    if (status === 'loading') return 'Searching the atlas…';
    if (status === 'error') return 'Search is temporarily unavailable.';
    return `${payload.total} result${payload.total === 1 ? '' : 's'}`;
  }, [payload.total, status]);

  return (
    <div className="sub-page search-page">
      <div className="search-page__input glass-panel">
        <Search size={21} />
        <input
          autoFocus
          value={query}
          maxLength={80}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ani, Van, Garni, Տաթև…"
          aria-label="Search historical places"
        />
        {query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={18} /></button>}
      </div>

      <div className="filter-block">
        <span>Region</span>
        <div className="filter-row">
          {regionOptions.map((option) => (
            <button
              key={option.id}
              className={region === option.id ? 'is-active' : ''}
              onClick={() => { haptic('selection'); setRegion(option.id); }}
            >{option.label}</button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <span>Place type</span>
        <div className="filter-row filter-row--scroll">
          {kindOptions.map((option) => (
            <button
              key={option.id}
              className={kind === option.id ? 'is-active' : ''}
              onClick={() => { haptic('selection'); setKind(option.id); }}
            >{option.label}</button>
          ))}
        </div>
      </div>

      <div className="result-summary"><span>{summary}</span><i className={status === 'loading' ? 'is-loading' : ''} /></div>

      <AnimatePresence mode="popLayout">
        {status === 'ready' && payload.results.map((place, index) => (
          <motion.article
            className="search-result glass-panel"
            key={place.slug}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ delay: Math.min(index * 0.035, 0.25) }}
          >
            <Link to={`/place/${place.slug}`} onClick={() => haptic('light')}>
              <div className="search-result__visual"><span>{place.armenianTitle?.slice(0, 1) || 'Ա'}</span></div>
              <div className="search-result__copy">
                <span>{place.region} Armenia · {place.kind}</span>
                <h2>{place.title}</h2>
                <em>{place.armenianTitle}</em>
                <p>{place.summary}</p>
                <div>{place.tags.slice(0, 3).map((tag) => <small key={tag}>{tag}</small>)}</div>
              </div>
              <b>›</b>
            </Link>
          </motion.article>
        ))}
      </AnimatePresence>

      {status === 'ready' && payload.results.length === 0 && (
        <div className="empty-state glass-panel">
          <span>0 results</span>
          <h2>No place matched</h2>
          <p>Try another spelling or remove one of the filters.</p>
          <button onClick={() => { setQuery(''); setKind('all'); setRegion('all'); }}>Reset search</button>
        </div>
      )}

      {status === 'error' && (
        <div className="empty-state glass-panel">
          <span>Connection</span>
          <h2>Search unavailable</h2>
          <p>Reopen the Mini App or check whether the API session is still active.</p>
        </div>
      )}
    </div>
  );
}
