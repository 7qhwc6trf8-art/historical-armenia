import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import { authenticateTelegram } from './lib/api.js';
import { destroyTelegram, initializeTelegram } from './lib/telegram.js';
import HomePage from './pages/HomePage.jsx';
import MapPage from './pages/MapPage.jsx';
import PlacePage from './pages/PlacePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import TimelinePage from './pages/TimelinePage.jsx';

export default function App() {
  const [auth, setAuth] = useState({ status: 'loading', user: null, error: null });

  useEffect(() => {
    let active = true;
    const tg = initializeTelegram();

    authenticateTelegram(tg?.initData || '')
      .then((result) => active && setAuth({ status: 'ready', user: result.user, error: null }))
      .catch((error) => active && setAuth({ status: 'error', user: null, error }));

    return () => {
      active = false;
      destroyTelegram();
    };
  }, []);

  if (auth.status === 'loading') {
    return (
      <div className="boot-screen">
        <div className="boot-mark">Ա</div>
        <div className="boot-line"><i /></div>
        <span>Opening historical atlas…</span>
      </div>
    );
  }

  if (auth.status === 'error') {
    const username = String(import.meta.env.VITE_BOT_USERNAME || '').replace(/^@/, '');
    return (
      <div className="boot-screen boot-screen--error">
        <div className="boot-mark">!</div>
        <h1>Open inside Telegram</h1>
        <p>{auth.error?.message || 'This protected Mini App requires Telegram authentication.'}</p>
        {username && (
          <a className="telegram-open-button" href={`https://t.me/${username}`}>
            Open @{username}
          </a>
        )}
      </div>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage user={auth.user} />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/place/:slug" element={<PlacePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/profile" element={<ProfilePage user={auth.user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
