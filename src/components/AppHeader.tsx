import { Link } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import Avatar from './Avatar';
import { useChrome } from './Chrome';
import { useUser } from '../context/UserContext';
import Icon2D from './Icon2D';

export const HeaderActions: React.FC<{ className?: string }> = ({ className }) => {
  const { openPanel, unreadCount } = useChrome();
  return (
    <div className={`elpida-app-header__actions ${className ?? ''}`}>
      <button className="elpida-icon-btn" aria-label="Buscar" onClick={() => openPanel('search')}><Icon2D icon={Search} size={18} /></button>
      <button className="elpida-icon-btn" aria-label="Notificações" onClick={() => openPanel('notifications')}>
        <Icon2D icon={Bell} size={18} />
        {unreadCount > 0 && <span className="elpida-badge">{unreadCount}</span>}
      </button>
      <button className="elpida-icon-btn" aria-label="Menu" onClick={() => openPanel('menu')}><Icon2D icon={Menu} size={18} /></button>
    </div>
  );
};

const AppHeader: React.FC = () => {
  const { profile, initials, firstName, greeting } = useUser();
  return (
    <header className="elpida-app-header">
      <Link to="/perfil" className="elpida-app-header__profile">
        <Avatar src={profile.avatar} initials={initials} size={46} />
        <div className="elpida-app-header__text">
          <span className="greeting">{greeting}</span>
          <span className="name">{firstName}</span>
        </div>
      </Link>
      <HeaderActions />
    </header>
  );
};

export default AppHeader;
