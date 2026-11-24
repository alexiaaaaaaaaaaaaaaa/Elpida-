import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';

const AddGuardianPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('amigo');
  const { addGuardian } = useUser();

  return (
    <div className="elpida-card">
      <div className="elpida-top-curve" />
      <button type="button" className="elpida-back" aria-label="Voltar" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} />
      </button>
      <div className="elpida-logo-badge">
        <Logo size={54} />
      </div>

      <h1 className="elpida-title elpida-title--center" style={{ fontSize: 30 }}>
        Guardiões
      </h1>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#333', margin: '0 0 24px', position: 'relative', zIndex: 1 }}>
        Escolha ao menos uma pessoa de total confiança para receber seu pedido de socorro por SMS e WhatsApp.
      </p>

      <div className="elpida-field">
        <label>Nome</label>
        <div className="elpida-input-wrap">
          <input placeholder="Nome do guardião" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      <div className="elpida-field">
        <label>Celular</label>
        <div className="elpida-input-wrap">
          <input type="tel" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="elpida-field">
        <label>Relação</label>
        <div className="elpida-input-wrap">
          <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
            <option value="amigo">Amigo(a)</option>
            <option value="familiar">Familiar</option>
            <option value="parceiro">Parceiro(a)</option>
            <option value="outro">Outro</option>
          </select>
          <span className="elpida-select-chevron">
            <ChevronDown size={18} />
          </span>
        </div>
      </div>

      <button
        className="elpida-btn elpida-btn--secondary"
        disabled={!name.trim() || !phone.trim()}
        onClick={() => {
          addGuardian({ name: name.trim(), phone: phone.trim(), relationship });
          navigate('/seguranca');
        }}
      >
        Salvar guardião
      </button>
      <button className="elpida-btn elpida-btn--primary" onClick={() => navigate('/inicio')}>
        Agora não
      </button>
    </div>
  );
};

export default AddGuardianPage;
