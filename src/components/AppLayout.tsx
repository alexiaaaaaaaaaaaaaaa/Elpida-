import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import SearchPanel from './SearchPanel';
import NotificationsPanel from './NotificationsPanel';
import SideMenu from './SideMenu';
import { ChromeContext, PanelName } from './Chrome';
import { useUser } from '../context/UserContext';
import { buildNotifications } from '../utils/notifications';
import { usePersistedState } from '../utils/storage';

/**
 * Layout de todas as telas internas: garante que busca, notificações e menu
 * funcionem igual em qualquer página (cada página só renderiza o <AppHeader />).
 */
const AppLayout: React.FC = () => {
  const { profile, firstName } = useUser();
  const location = useLocation();
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [readIds, setReadIds] = usePersistedState<string[]>('elpida:notifications-read', []);

  // fecha painéis e volta ao topo ao trocar de página
  useEffect(() => {
    setPanel(null);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const notifications = useMemo(() => buildNotifications(profile, firstName), [profile, firstName]);
  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const closePanel = useCallback(() => setPanel(null), []);
  const openPanel = useCallback((p: PanelName) => setPanel(p), []);

  const markRead = (id: string) => setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const markAllRead = () => setReadIds(notifications.map((n) => n.id));

  return (
    <ChromeContext.Provider value={{ openPanel, unreadCount }}>
      <Outlet />
      <BottomNav />
      {panel === 'search' && <SearchPanel onClose={closePanel} />}
      {panel === 'notifications' && (
        <NotificationsPanel
          notifications={notifications}
          readIds={readIds}
          onRead={markRead}
          onReadAll={markAllRead}
          onClose={closePanel}
        />
      )}
      {panel === 'menu' && <SideMenu onClose={closePanel} />}
    </ChromeContext.Provider>
  );
};

export default AppLayout;
