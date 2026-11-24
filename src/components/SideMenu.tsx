import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  BookOpen,
  Map,
  Newspaper,
  User,
  MapPin,
  ShieldCheck,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import Avatar from './Avatar';
import Icon2D from './Icon2D';
import { useUser, GENDER_LABELS } from '../context/UserContext';

const items = [
  { to: '/inicio', icon: Home, label: 'Início' },
  { to: '/aulas', icon: GraduationCap, label: 'Aulas' },
  { to: '/livros', icon: BookOpen, label: 'Livros' },
  { to: '/mapa', icon: Map, label: 'Mapa' },
  { to: '/timeline', icon: Newspaper, label: 'Timeline' },
  { to: '/perfil', icon: User, label: 'Perfil' },
  { to: '/localizacao', icon: MapPin, label: 'Localização' },
  { to: '/seguranca', icon: ShieldCheck, label: 'Guardiões' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
];

/** Menu lateral roxo (abre pela direita), como no Figma. */
const SideMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { profile, initials, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <div className="elpida-overlay" role="dialog" aria-label="Menu">
      <div className="elpida-overlay__backdrop" onClick={onClose} />
      <aside className="elpida-drawer">
        <button type="button" className="elpida-drawer__close" aria-label="Fechar menu" onClick={onClose}>
          <Icon2D icon={X} size={20} />
        </button>

        <div className="elpida-drawer__user">
          <Avatar src={profile.avatar} initials={initials} size={56} />
          <p className="elpida-drawer__name">{profile.name}</p>
          <p className="elpida-drawer__meta">
            {profile.age} anos · {GENDER_LABELS[profile.gender] ?? 'Não informado'}
          </p>
        </div>

        <nav className="elpida-drawer__list">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end
              onClick={onClose}
              className={({ isActive }) => `elpida-drawer__item ${isActive ? 'active' : ''}`}
            >
              <span>{it.label}</span>
              <Icon2D icon={it.icon} size={22} />
            </NavLink>
          ))}
          <button type="button" className="elpida-drawer__item danger" onClick={handleLogout}>
            <span>Sair</span>
            <Icon2D icon={LogOut} size={22} />
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default SideMenu;
