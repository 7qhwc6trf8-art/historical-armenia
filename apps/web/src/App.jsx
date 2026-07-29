import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import { authenticateTelegram } from './lib/api.js';
import { initializeTelegram } from './lib/telegram.js';
import HomePage from './pages/HomePage.jsx';
import MapPage from './pages/MapPage.jsx';
import PlacePage from './pages/PlacePage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function App() {
  const [auth, setAuth] = useState({ status: 'loading', user: null, error: null });

  useEffect(() => {
    const tg = initializeTelegram();
    authenticateTelegram(tg?.initData || '')
      .then((result) => setAuth({ status: 'ready', user: result.user, error: null }))
      .catch((error) => setAuth({ status: 'error', user: null, error }));
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
    return (
      <div className="boot-screen boot-screen--error">
        <div className="boot-mark">!</div>
        <h1>Secure sign-in failed</h1>
        <p>{auth.error?.message || 'Open this Mini App from its Telegram bot.'}</p>
      </div>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage user={auth.user} />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/place/:slug" element={<PlacePage />} />
        <Route path="/search" element={<PlaceholderPage title="Search" description="Multilingual fuzzy search across regions, settlements and monuments." />} />
        <Route path="/timeline" element={<PlaceholderPage title="Timeline" description="Animated historical periods and border layers will be implemented here." />} />
        <Route path="/profile" element={<PlaceholderPage title="Your profile" description="Favorites, language, reading history and Telegram identity." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
