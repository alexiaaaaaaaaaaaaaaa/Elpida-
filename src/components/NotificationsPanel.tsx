import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import type { AppNotification } from '../utils/notifications';

interface Props {
  notifications: AppNotification[];
  readIds: string[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  onClose: () => void;
}

const NotificationsPanel: React.FC<Props> = ({ notifications, readIds, onRead, onReadAll, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const open = (n: AppNotification) => {
    onRead(n.id);
    onClose();
    navigate(n.to);
  };

  const allRead = notifications.every((n) => readIds.includes(n.id));

  return (
    <div className="elpida-overlay" role="dialog" aria-label="Notificações">
      <div className="elpida-overlay__backdrop" onClick={onClose} />
      <div className="elpida-sheet">
        <div className="elpida-sheet__head">
          <h2>Notificações</h2>
          <button type="button" aria-label="Fechar notificações" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="elpida-sheet__body">
          {notifications.map((n) => {
            const read = readIds.includes(n.id);
            return (
              <button key={n.id} className={`elpida-result elpida-result--notif ${read ? 'read' : ''}`} onClick={() => open(n)}>
                {!read && <span className="elpida-dot" aria-label="Não lida" />}
                <span className="elpida-result__text">
                  <strong>{n.title}</strong>
                  <small>{n.body}</small>
                </span>
              </button>
            );
          })}
          <button className="elpida-sheet__link" onClick={onReadAll} disabled={allRead}>
            Marcar todas como lidas
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
