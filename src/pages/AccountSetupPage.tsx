import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ChevronDown, User } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { fileToResizedDataUrl } from '../utils/image';
import Logo from '../components/Logo';

const AccountSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUser();
  const [name, setName] = useState(profile.name === 'Visitante' ? '' : profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [avatar, setAvatar] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      setAvatar(await fileToResizedDataUrl(file));
    } catch {
      // mantém a foto atual
    }
  };

  const handleSubmit = () => {
    updateProfile({ name: name.trim() || 'Visitante', age, gender, avatar });
    navigate('/localizacao');
  };

  return (
    <div className="elpida-card">
      <div className="elpida-top-curve" />
      <div className="elpida-blob" />

      <div className="elpida-logo-badge">
        <Logo size={54} />
      </div>

      <h1 className="elpida-title elpida-title--center" style={{ fontSize: 24, color: 'var(--elpida-purple)' }}>
        Vamos configurar sua conta
      </h1>

      <div className="elpida-avatar-wrap" style={{ width: 130, height: 130 }}>
        {avatar ? (
          <img className="elpida-avatar" src={avatar} alt="Sua foto" style={{ width: 130, height: 130 }} />
        ) : (
          <div className="elpida-avatar" style={{ width: 130, height: 130 }}>
            <User size={54} />
          </div>
        )}
        <button
          type="button"
          className="elpida-avatar-edit"
          aria-label="Editar foto"
          onClick={() => fileInputRef.current?.click()}
        >
          <Pencil size={16} />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="elpida-field">
        <label>Nome de usuário</label>
        <div className="elpida-input-wrap">
          <input placeholder="Insira um nome" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      <div className="elpida-field">
        <label>Idade</label>
        <input
          type="range"
          className="elpida-range"
          min={13}
          max={100}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <div className="elpida-age-value">{age}</div>
      </div>

      <div className="elpida-field">
        <label>Gênero</label>
        <div className="elpida-input-wrap">
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="" disabled>
              Escolha um gênero
            </option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="nao-binario">Não-binário</option>
            <option value="prefiro-nao-dizer">Prefiro não dizer</option>
          </select>
          <span className="elpida-select-chevron">
            <ChevronDown size={18} />
          </span>
        </div>
      </div>

      <button className="elpida-btn elpida-btn--secondary" style={{ marginTop: 12 }} onClick={handleSubmit}>
        Entrar
      </button>
    </div>
  );
};

export default AccountSetupPage;
