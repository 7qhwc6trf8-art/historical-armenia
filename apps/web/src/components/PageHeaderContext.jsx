import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageHeaderContext = createContext(null);

export function getDefaultPageHeader(pathname) {
  if (pathname === '/') return { title: 'Home', subtitle: 'Historical Armenia' };
  if (pathname === '/map') return { title: 'Map', subtitle: 'Interactive Atlas' };
  if (pathname === '/search') return { title: 'Search', subtitle: 'Historical Catalog' };
  if (pathname === '/timeline') return { title: 'Timeline', subtitle: 'Historical Periods' };
  if (pathname === '/profile') return { title: 'Profile', subtitle: 'Telegram Account' };
  if (pathname.startsWith('/place/')) return { title: 'Place', subtitle: 'Historical Record' };
  return { title: 'Historical Armenia', subtitle: 'Interactive Atlas' };
}

export function PageHeaderProvider({ children }) {
  const location = useLocation();
  const [override, setOverride] = useState(null);

  const setPageHeader = useCallback((nextHeader) => {
    setOverride((current) => (
      typeof nextHeader === 'function' ? nextHeader(current) : (nextHeader || null)
    ));
  }, []);

  const value = useMemo(() => {
    const routeOverride = override?.pathname === location.pathname ? override : null;
    return {
      header: routeOverride
        ? { title: routeOverride.title, subtitle: routeOverride.subtitle }
        : getDefaultPageHeader(location.pathname),
      setPageHeader,
    };
  }, [location.pathname, override, setPageHeader]);

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function useResolvedPageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('useResolvedPageHeader must be used inside PageHeaderProvider.');
  }
  return context.header;
}

export function usePageHeader({ title, subtitle }) {
  const context = useContext(PageHeaderContext);
  const location = useLocation();
  const setPageHeader = context?.setPageHeader;
  const pathname = location.pathname;

  useEffect(() => {
    if (!setPageHeader) return undefined;

    setPageHeader({ pathname, title, subtitle });
    return () => {
      setPageHeader((current) => (current?.pathname === pathname ? null : current));
    };
  }, [pathname, setPageHeader, title, subtitle]);
}
