import { NavLink } from 'react-router-dom';
import { GraduationCap, BookOpen, Home, Map, User } from 'lucide-react';
import Icon2D from './Icon2D';

const tabs = [
  { to: '/aulas', icon: GraduationCap, label: 'Aulas' },
  { to: '/livros', icon: BookOpen, label: 'Livros' },
  { to: '/inicio', icon: Home, label: 'Início' },
  { to: '/mapa', icon: Map, label: 'Mapa' },
  { to: '/perfil', icon: User, label: 'Perfil' },
];

const BottomNav: React.FC = () => (
  <nav className="elpida-bottom-nav" aria-label="Navegação principal">
    {tabs.map((tab) => (
      <NavLink key={tab.to} to={tab.to} aria-label={tab.label} className={({ isActive }) => (isActive ? 'active' : '')}>
        <Icon2D icon={tab.icon} size={24} />
      </NavLink>
    ))}
  </nav>
);

export default BottomNav;
