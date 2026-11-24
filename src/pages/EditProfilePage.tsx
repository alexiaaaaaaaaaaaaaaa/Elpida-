import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Image as ImageIcon, Camera } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { fileToResizedDataUrl } from '../utils/image';
import Avatar from '../components/Avatar';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, initials } = useUser();
  const [name, setName] = useState(profile.name === 'Visitante' ? '' : profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [uploading, setUploading] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setAvatar(dataUrl);
    } catch {
      // se falhar, mantém a foto atual
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    updateProfile({ name: name.trim() || 'Visitante', age, gender, avatar });
    navigate('/perfil');
  };

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/perfil">Editar perfil</PageTitle>

      <div className="elpida-form">
        <div className="elpida-avatar-wrap" style={{ width: 140, height: 140 }}>
          <Avatar src={avatar} initials={initials} size={140} />
          <div style={{ position: 'absolute', right: -6, bottom: -6, display: 'flex', gap: 6 }}>
            <button
              type="button"
              className="elpida-avatar-edit"
              style={{ position: 'static' }}
              aria-label="Escolher foto da galeria"
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImageIcon size={16} />
            </button>
            <button
              type="button"
              className="elpida-avatar-edit"
              style={{ position: 'static' }}
              aria-label="Tirar foto com a câmera"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        {/* Galeria: sem "capture" abre o seletor de fotos do dispositivo */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {/* Câmera: capture="environment" abre a câmera direto em celulares */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {uploading && (
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--elpida-purple)', margin: '0 0 12px' }}>
            Processando imagem...
          </p>
        )}

        <div className="elpida-field">
          <label>Nome</label>
          <div className="elpida-input-wrap">
            <input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
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

        <button className="elpida-btn elpida-btn--primary" style={{ marginTop: 12 }} onClick={handleSave}>
          Salvar alterações
        </button>
        <button
          className="elpida-btn"
          style={{
            background: 'transparent',
            color: 'var(--elpida-purple)',
            border: '2px solid var(--elpida-purple)',
            marginTop: -14,
          }}
          onClick={() => navigate('/perfil')}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
