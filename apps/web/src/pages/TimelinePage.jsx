import { Clock3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchTimeline } from '../lib/api.js';
import { haptic } from '../lib/telegram.js';

export default function TimelinePage() {
  const [params, setParams] = useSearchParams();
  const [periods, setPeriods] = useState([]);
  const [status, setStatus] = useState('loading');
  const requested = params.get('period');

  useEffect(() => {
    fetchTimeline()
      .then(({ periods: result }) => { setPeriods(result); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  const selectedId = useMemo(() => {
    if (periods.some((period) => period.id === requested)) return requested;
    return periods[0]?.id || null;
  }, [periods, requested]);

  const selected = periods.find((period) => period.id === selectedId);

  return (
    <div className="sub-page timeline-page">
      <section className="timeline-intro glass-panel">
        <span>Historical boundaries change over time</span>
        <h2>Select a period before reading a map</h2>
        <p>Each place can appear in more than one period. Names, borders and administrative structures should never be mixed without a date label.</p>
      </section>

      {status === 'loading' && <div className="timeline-loading glass-panel"><div className="loading-line"><i /></div></div>}
      {status === 'error' && <div className="empty-state glass-panel"><h2>Timeline unavailable</h2><p>Your secure session may have expired.</p></div>}

      {status === 'ready' && (
        <>
          <div className="timeline-rail" role="tablist" aria-label="Historical periods">
            {periods.map((period, index) => (
              <button
                key={period.id}
                role="tab"
                aria-selected={period.id === selectedId}
                className={period.id === selectedId ? 'is-active' : ''}
                onClick={() => { haptic('selection'); setParams({ period: period.id }); }}
              >
                <i /><span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{period.title}</strong><small>{period.range}</small></div>
              </button>
            ))}
          </div>

          {selected && (
            <motion.section
              key={selected.id}
              className="timeline-detail glass-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{selected.range}</span>
              <h2>{selected.title}</h2>
              <p>{selected.placeCount} catalog records currently connect to this period.</p>
              <div className="timeline-place-list">
                {selected.places.map((place) => (
                  <Link key={place.slug} to={`/place/${place.slug}`} onClick={() => haptic('light')}>
                    <div><strong>{place.title}</strong><em>{place.armenianTitle}</em></div>
                    <span>{place.kind} · {place.region}</span>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
