import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Infinity as InfinityIcon,
  ShieldAlert,
  GraduationCap,
  HelpCircle,
  ChevronRight,
  Map,
  BookOpen,
  Newspaper,
  ShieldCheck,
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { ARTICLES } from '../data/content';

const categories = [
  { to: '/ciclo-da-violencia', icon: InfinityIcon, label: 'Ciclo da violência' },
  { to: '/como-se-proteger', icon: ShieldAlert, label: 'Como se proteger?' },
  { to: '/aulas', icon: GraduationCap, label: 'Educação' },
  { to: '/como-pedir-ajuda', icon: HelpCircle, label: 'Como pedir ajuda?' },
];

const moreCategories = [
  { to: '/mapa', icon: Map, label: 'Mapa de apoio' },
  { to: '/livros', icon: BookOpen, label: 'Livros' },
  { to: '/timeline', icon: Newspaper, label: 'Timeline' },
  { to: '/seguranca', icon: ShieldCheck, label: 'Guardiões' },
];

const HomePage: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? [...categories, ...moreCategories] : categories;

  return (
    <div className="elpida-app-screen">
      <AppHeader />

      <section className="elpida-section" style={{ paddingTop: 28 }}>
        <div className="elpida-section__head">
          <h2 className="elpida-section__title">Saiba mais</h2>
          <button type="button" className="elpida-section__link" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Mostrar menos' : 'Mostrar tudo'} <ChevronRight size={14} />
          </button>
        </div>
        <div className="elpida-category-row">
          {visible.map((c) => (
            <Link key={c.label} to={c.to} className="elpida-category">
              <span className="elpida-category__circle">
                <c.icon size={30} strokeWidth={1.8} />
              </span>
              <span className="elpida-category__label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="elpida-section">
        <div className="elpida-section__head">
          <h2 className="elpida-section__title">Artigos populares</h2>
        </div>
        {ARTICLES.map((a) => (
          <div className="elpida-news-card" key={a.id}>
            <div
              className="elpida-news-card__thumb"
              style={{ background: a.image ? `url(${a.image}) center / cover no-repeat` : `linear-gradient(135deg, ${a.tint}, #44175a55)` }}
            />
            <div className="elpida-news-card__body">
              <span className="elpida-news-card__source">{a.source}</span>
              <p className="elpida-news-card__title">{a.title}</p>
            </div>
            <button className="elpida-news-card__cta">Saiba mais</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
