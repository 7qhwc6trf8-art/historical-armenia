import { Bookmark, CheckCircle2, Globe2, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, subscribeFavorites } from '../lib/favorites.js';
import { haptic } from '../lib/telegram.js';

export default function ProfilePage({ user }) {
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('vha:language') || user?.languageCode || 'en'; }
    catch { return user?.languageCode || 'en'; }
  });

  useEffect(() => subscribeFavorites(setFavorites), []);

  const setPreferredLanguage = (value) => {
    haptic('selection');
    try { localStorage.setItem('vha:language', value); } catch { /* restricted webview storage */ }
    setLanguage(value);
  };

  return (
    <div className="sub-page profile-page">
      <motion.section className="profile-hero glass-panel" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar">{user?.firstName?.slice(0, 1)?.toUpperCase() || <UserRound />}</div>
        <div>
          <span>Authenticated user</span>
          <h2>{user?.firstName || 'Telegram user'}</h2>
          <p>{user?.username ? `@${user.username}` : `Telegram ID ${user?.id || 'secured'}`}</p>
        </div>
        <CheckCircle2 className="profile-verified" />
      </motion.section>

      <section className="profile-card glass-panel">
        <div className="profile-card__heading"><Globe2 /><div><span>Language</span><h2>Interface preference</h2></div></div>
        <div className="language-picker">
          {[
            ['hy', 'Հայերեն'],
            ['en', 'English'],
            ['ru', 'Русский'],
          ].map(([id, label]) => (
            <button key={id} className={language === id ? 'is-active' : ''} onClick={() => setPreferredLanguage(id)}>{label}</button>
          ))}
        </div>
        <p>Full translations are scheduled for the multilingual content milestone.</p>
      </section>

      <section className="profile-card glass-panel">
        <div className="profile-card__heading"><Bookmark /><div><span>Saved locally</span><h2>{favorites.length} favorite{favorites.length === 1 ? '' : 's'}</h2></div></div>
        {favorites.length ? (
          <div className="favorite-slugs">
            {favorites.slice(0, 8).map((slug) => <Link key={slug} to={`/place/${slug}`}>{slug.replaceAll('-', ' ')}</Link>)}
          </div>
        ) : <p>Open a historical place and press “Add to favorites.”</p>}
      </section>

      <section className="profile-card glass-panel security-card">
        <div className="profile-card__heading"><LockKeyhole /><div><span>Protected session</span><h2>Telegram-signed access</h2></div></div>
        <ul>
          <li><CheckCircle2 /> Telegram initData verified by the server</li>
          <li><CheckCircle2 /> HTTP-only signed session cookie</li>
          <li><CheckCircle2 /> CSRF and trusted-origin checks</li>
          <li><CheckCircle2 /> API rate limits and secure headers</li>
        </ul>
      </section>
    </div>
  );
}
