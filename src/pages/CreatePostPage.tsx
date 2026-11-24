import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import { useUser } from '../context/UserContext';
import { fileToResizedDataUrl } from '../utils/image';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPost } = useUser();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file, 900, 0.85);
      setImageUrl(dataUrl);
    } catch {
      // ignora — usuário pode tentar de novo
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = () => {
    if (!imageUrl) return;
    addPost({ imageUrl, caption: caption.trim() });
    navigate('/perfil');
  };

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/perfil">Novo post</PageTitle>

      <div className="elpida-form">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            borderRadius: 16,
            border: '2px dashed var(--elpida-purple)',
            background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : 'rgba(68,23,90,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--elpida-purple)',
            marginBottom: 20,
            position: 'relative',
          }}
        >
          {!imageUrl && (
            <>
              <ImagePlus size={36} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {uploading ? 'Carregando...' : 'Escolher imagem da galeria'}
              </span>
            </>
          )}
          {imageUrl && (
            <span
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: 20,
              }}
            >
              Trocar imagem
            </span>
          )}
        </button>

        <div className="elpida-field">
          <label>Legenda</label>
          <div className="elpida-input-wrap" style={{ borderRadius: 20 }}>
            <textarea
              placeholder="Escreva algo sobre esse post..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                padding: '14px 20px',
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'none',
              }}
            />
          </div>
        </div>

        <button className="elpida-btn elpida-btn--primary" disabled={!imageUrl} onClick={handlePublish}>
          Publicar
        </button>
      </div>
    </div>
  );
};

export default CreatePostPage;
