import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinned, AlertTriangle, ChevronLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';

const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveLocation } = useUser();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const activate = () => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setErrorMsg('Seu navegador não tem suporte a geolocalização.');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          savedAt: Date.now(),
        });
        navigate('/seguranca');
      },
      (err) => {
        setStatus('error');
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Permissão de localização negada. Ative nas configurações do navegador/celular e tente de novo.');
        } else {
          setErrorMsg('Não conseguimos obter sua localização agora. Tente novamente.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="elpida-card">
      <div className="elpida-top-curve" />
      <button type="button" className="elpida-back" aria-label="Voltar" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} />
      </button>

      <div className="elpida-logo-badge">
        <Logo size={54} />
      </div>

      <div className="elpida-security-illustration">
        <MapPinned size={150} strokeWidth={1.6} />
      </div>
      <h1 className="elpida-security-title">Ative sua localização</h1>
      <p className="elpida-security-copy">
        Nós utilizamos sua localização em caso de risco. A ativação é necessária e <strong>OBRIGATÓRIA</strong>.
      </p>

      {status === 'error' && (
        <p className="elpida-form-error">
          <AlertTriangle size={16} /> {errorMsg}
        </p>
      )}

      <button className="elpida-btn elpida-btn--secondary" onClick={activate} disabled={status === 'loading'}>
        {status === 'loading' ? 'Obtendo localização...' : 'Ativar'}
      </button>
    </div>
  );
};

export default LocationPage;
