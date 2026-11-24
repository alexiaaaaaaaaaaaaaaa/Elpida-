import { Zap, AlertTriangle, Heart } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import { CYCLE_PHASES } from '../data/content';

const icons = [Zap, AlertTriangle, Heart];

const CycleOfViolencePage: React.FC = () => {
  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/inicio">Ciclo da violência</PageTitle>
      <div className="elpida-cycle-divider" />

      {CYCLE_PHASES.map((p, i) => {
        const Icon = icons[i % icons.length];
        const dark = i % 2 === 1;
        return (
          <section key={p.id} className={`elpida-cycle ${dark ? 'elpida-cycle--dark' : ''}`}>
            <div className={`elpida-cycle__head ${dark ? 'elpida-cycle__head--flip' : ''}`}>
              <div className="elpida-cycle__art" aria-hidden="true">
                <Icon size={54} strokeWidth={1.4} />
              </div>
              <div className="elpida-cycle__heading">
                <p className="elpida-cycle__label">{p.label}</p>
                <h2 className="elpida-cycle__title">{p.title}</h2>
                <p className="elpida-cycle__text">{p.paragraphs[0]}</p>
              </div>
            </div>
            {p.paragraphs.slice(1).map((t) => (
              <p key={t} className="elpida-cycle__text elpida-cycle__text--full">
                {t}
              </p>
            ))}
          </section>
        );
      })}
    </div>
  );
};

export default CycleOfViolencePage;
