import { useNavigate } from 'react-router-dom';
import { Users, ChevronLeft, Trash2, Plus } from 'lucide-react';
import Logo from '../components/Logo';
import Icon2D from '../components/Icon2D';
import { useUser } from '../context/UserContext';

const GuardiansPage: React.FC = () => {
  const navigate = useNavigate();
  const { guardians, removeGuardian } = useUser();

  return (
    <div className="elpida-card">
      <div className="elpida-top-curve" />
      <button type="button" className="elpida-back" aria-label="Voltar" onClick={() => navigate(-1)}>
        <Icon2D icon={ChevronLeft} size={20} />
      </button>

      <div className="elpida-logo-badge"><Logo size={54} /></div>
      <div className="elpida-security-illustration"><Icon2D icon={Users} size={112} /></div>
      <h1 className="elpida-security-title">Guardiões</h1>
      <p className="elpida-security-copy">
        Seus contatos de confiança ficam salvos somente na conta deste CPF.
      </p>

      {guardians.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 8, marginBottom: 18 }}>
          {guardians.map((guardian) => (
            <div key={guardian.id} className="elpida-settings-card" style={{ padding: '10px 12px' }}>
              <span className="elpida-settings-card__icon"><Icon2D icon={Users} size={19} /></span>
              <span className="elpida-settings-card__copy">
                <span className="elpida-settings-card__title">{guardian.name}</span>
                <span className="elpida-settings-card__desc">{guardian.phone} · {guardian.relationship}</span>
              </span>
              <button type="button" aria-label={`Remover ${guardian.name}`} onClick={() => removeGuardian(guardian.id)} style={{ border: 0, background: 'transparent', color: '#a13939' }}>
                <Icon2D icon={Trash2} size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {guardians.length < 3 && (
        <button className="elpida-btn elpida-btn--primary" onClick={() => navigate('/guardioes/adicionar')}>
          <Icon2D icon={Plus} size={19} />
          Adicionar guardião
        </button>
      )}
      <button
        className="elpida-btn"
        style={{ background: 'transparent', color: 'var(--elpida-purple)', border: '2px solid var(--elpida-purple)', marginTop: -10 }}
        onClick={() => navigate('/inicio')}
      >
        Voltar ao início
      </button>
    </div>
  );
};

export default GuardiansPage;
