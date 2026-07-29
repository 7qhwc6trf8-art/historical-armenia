export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

export function initializeTelegram() {
  const tg = getTelegramWebApp();
  if (!tg) return null;

  tg.ready();
  tg.expand();
  tg.setHeaderColor?.('#091016');
  tg.setBackgroundColor?.('#091016');

  document.documentElement.dataset.telegram = 'true';
  document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportStableHeight || window.innerHeight}px`);

  const updateViewport = () => {
    document.documentElement.style.setProperty(
      '--tg-viewport-height',
      `${tg.viewportStableHeight || tg.viewportHeight || window.innerHeight}px`,
    );
  };

  tg.onEvent?.('viewportChanged', updateViewport);
  return tg;
}

export function haptic(type = 'light') {
  const feedback = getTelegramWebApp()?.HapticFeedback;
  if (!feedback) return;
  if (type === 'selection') {
    feedback.selectionChanged?.();
    return;
  }
  feedback.impactOccurred?.(type);
}
