import { Bookmark, ChevronLeft, Clock3, Images, Info, MapPinned } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../lib/api.js';
import { haptic } from '../lib/telegram.js';

export default function PlacePage() {
  const [saved, setSaved] = useState(false);

  const save = async () => {
    haptic('medium');
    setSaved((value) => !value);
    try { await toggleFavorite('van-province'); } catch { /* optimistic demo */ }
  };

  return (
    <div className="place-page">
      <section className="place-hero">
        <div className="place-hero__image" />
        <div className="place-hero__shade" />
        <Link className="place-hero__back" to="/"><ChevronLeft /></Link>
        <motion.div className="place-hero__title" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <span>Western Armenia</span>
          <h1>Van Province</h1>
          <p>Վանի նահանգ</p>
        </motion.div>
      </section>
      <div className="place-content">
        <div className="detail-tabs glass-panel">
          {[Info, Clock3, Images, MapPinned].map((Icon, index) => (
            <button className={index === 0 ? 'is-active' : ''} key={index}><Icon size={19} /><span>{['Info','History','Gallery','Map'][index]}</span></button>
          ))}
        </div>
        <section className="detail-card glass-panel">
          <span>About</span>
          <h2>Historic Armenian province</h2>
          <p>Van Province surrounds Lake Van and contains a dense network of historic settlements, monasteries, fortresses and cultural landmarks.</p>
          <dl>
            <div><dt>Historic center</dt><dd>Van</dd></div>
            <div><dt>Featured monument</dt><dd>Holy Cross, Aghtamar</dd></div>
            <div><dt>Content status</dt><dd>Draft · sources required</dd></div>
          </dl>
        </section>
        <motion.button className={`favorite-button ${saved ? 'is-saved' : ''}`} whileTap={{ scale: 0.97 }} onClick={save}>
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved to favorites' : 'Add to favorites'}
        </motion.button>
      </div>
    </div>
  );
}
