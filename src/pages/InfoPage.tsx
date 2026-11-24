import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import { INFO_PAGES } from '../data/content';

/** Páginas informativas ligadas aos atalhos "Como se proteger?" e "Como pedir ajuda?". */
const InfoPage: React.FC<{ slug: string }> = ({ slug }) => {
  const page = INFO_PAGES.find((p) => p.slug === slug);
  if (!page) return null;

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/inicio">{page.title}</PageTitle>

      <div className="elpida-info">
        <p className="elpida-info__intro">{page.intro}</p>

        {page.sections.map((s) => (
          <section className="elpida-info__section" key={s.title}>
            <h2>{s.title}</h2>
            <ul>
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </section>
        ))}

        <div className="elpida-info__actions">
          <a className="elpida-info__btn" href="tel:180">
            <Phone size={16} /> Ligar 180
          </a>
          <Link className="elpida-info__btn elpida-info__btn--alt" to="/mapa">
            <MapPin size={16} /> Ver no mapa
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
