import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DrawerContext = createContext(null);

export function DrawerProvider({ children }) {
  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  const openDrawer = useCallback((type, data = null) => {
    setDrawerState({ isOpen: true, type, data });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerState((prev) => ({ ...prev, isOpen: false }));
    // If the URL hash was an action drawer, reset it gracefully without full reload
    if (
      ['#contact', '#hire', '#ai-chat', '#chat'].some((h) =>
        window.location.hash.startsWith(h)
      )
    ) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  // Listen for hash triggers like /#contact, /#hire, /#ai-chat
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#contact')) {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const type = params.get('type');
        openDrawer(type ? 'hire' : 'contact', type ? { service: type } : null);
      } else if (hash.startsWith('#hire')) {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const service = params.get('service') || params.get('type');
        openDrawer('hire', service ? { service } : null);
      } else if (hash === '#ai-chat' || hash === '#chat') {
        openDrawer('chat');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [openDrawer]);

  return (
    <DrawerContext.Provider value={{ drawerState, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}
