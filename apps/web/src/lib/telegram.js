let disposeTelegramListeners = null;

export function getTelegramWebApp() {
  return window.Telegram?.WebApp ?? null;
}

function px(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? `${Math.max(0, parsed)}px` : '0px';
}

function applyViewport(tg) {
  const root = document.documentElement;
  const viewportHeight = tg?.viewportStableHeight || tg?.viewportHeight || window.innerHeight;
  root.style.setProperty('--tg-viewport-height', px(viewportHeight));
  root.dataset.telegramFullscreen = tg?.isFullscreen ? 'true' : 'false';
}

function applySafeAreas(tg) {
  const root = document.documentElement;
  const safe = tg?.safeAreaInset || {};
  const content = tg?.contentSafeAreaInset || safe;

  root.style.setProperty('--tg-safe-area-inset-top', px(safe.top));
  root.style.setProperty('--tg-safe-area-inset-right', px(safe.right));
  root.style.setProperty('--tg-safe-area-inset-bottom', px(safe.bottom));
  root.style.setProperty('--tg-safe-area-inset-left', px(safe.left));

  root.style.setProperty('--tg-content-safe-area-inset-top', px(content.top));
  root.style.setProperty('--tg-content-safe-area-inset-right', px(content.right));
  root.style.setProperty('--tg-content-safe-area-inset-bottom', px(content.bottom));
  root.style.setProperty('--tg-content-safe-area-inset-left', px(content.left));
}

function requestImmersiveMode(tg) {
  try {
    tg.expand?.();
    if (tg.isVersionAtLeast?.('7.7')) tg.disableVerticalSwipes?.();
    if (tg.isVersionAtLeast?.('8.0') && !tg.isFullscreen) tg.requestFullscreen?.();
  } catch {
    // Older Telegram clients gracefully remain in expanded mode.
  }
}

export function initializeTelegram() {
  disposeTelegramListeners?.();
  disposeTelegramListeners = null;

  const tg = getTelegramWebApp();
  if (!tg) {
    document.documentElement.dataset.telegram = 'false';
    document.documentElement.style.setProperty('--tg-viewport-height', `${window.innerHeight}px`);
    return null;
  }

  tg.ready();
  tg.setHeaderColor?.('#071118');
  tg.setBackgroundColor?.('#071118');
  tg.setBottomBarColor?.('#09141c');

  document.documentElement.dataset.telegram = 'true';
  applyViewport(tg);
  applySafeAreas(tg);
  requestImmersiveMode(tg);

  const refreshViewport = () => applyViewport(tg);
  const refreshSafeAreas = () => applySafeAreas(tg);
  const refreshTheme = () => {
    tg.setHeaderColor?.('#071118');
    tg.setBackgroundColor?.('#071118');
    tg.setBottomBarColor?.('#09141c');
  };

  tg.onEvent?.('viewportChanged', refreshViewport);
  tg.onEvent?.('fullscreenChanged', refreshViewport);
  tg.onEvent?.('safeAreaChanged', refreshSafeAreas);
  tg.onEvent?.('contentSafeAreaChanged', refreshSafeAreas);
  tg.onEvent?.('themeChanged', refreshTheme);

  const retryFullscreen = () => requestImmersiveMode(tg);
  window.addEventListener('pointerdown', retryFullscreen, { once: true, passive: true });
  window.addEventListener('resize', refreshViewport, { passive: true });

  disposeTelegramListeners = () => {
    tg.offEvent?.('viewportChanged', refreshViewport);
    tg.offEvent?.('fullscreenChanged', refreshViewport);
    tg.offEvent?.('safeAreaChanged', refreshSafeAreas);
    tg.offEvent?.('contentSafeAreaChanged', refreshSafeAreas);
    tg.offEvent?.('themeChanged', refreshTheme);
    window.removeEventListener('pointerdown', retryFullscreen);
    window.removeEventListener('resize', refreshViewport);
  };

  return tg;
}

export function destroyTelegram() {
  disposeTelegramListeners?.();
  disposeTelegramListeners = null;
}

export function configureTelegramBackButton({ visible, onClick }) {
  const backButton = getTelegramWebApp()?.BackButton;
  if (!backButton) return () => {};

  backButton.offClick?.(onClick);
  if (visible) {
    backButton.onClick?.(onClick);
    backButton.show?.();
  } else {
    backButton.hide?.();
  }

  return () => {
    backButton.offClick?.(onClick);
    if (visible) backButton.hide?.();
  };
}

export function showNativePopup({ title, message }) {
  const tg = getTelegramWebApp();
  if (tg?.showPopup) {
    tg.showPopup({
      title,
      message,
      buttons: [{ id: 'close', type: 'close' }],
    });
    return;
  }
  window.alert(`${title}\n\n${message}`);
}

export function haptic(type = 'light') {
  const feedback = getTelegramWebApp()?.HapticFeedback;
  if (!feedback) return;
  if (type === 'selection') {
    feedback.selectionChanged?.();
    return;
  }
  if (type === 'success' || type === 'warning' || type === 'error') {
    feedback.notificationOccurred?.(type);
    return;
  }
  feedback.impactOccurred?.(type);
}
