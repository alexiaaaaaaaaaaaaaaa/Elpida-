import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';
import Icon2D from '../components/Icon2D';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginExistingAccount } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState('');

  const emailValid = EMAIL_RE.test(email.trim());
  const showError = touched && email.length > 0 && !emailValid;

  const handleSubmit = async () => {
    setTouched(true);
    setMessage('');
    if (!emailValid || !password) return;

    const result = await loginExistingAccount(email, password);
    if (!result.ok) {
      setMessage(result.message ?? 'Não foi possível entrar.');
      return;
    }
    navigate('/inicio');
  };

  return (
    <div className="elpida-card elpida-auth-card elpida-auth-card--login">
      <div className="elpida-top-curve" />
      <div className="elpida-blob elpida-blob--top-right" />
      <div className="elpida-blob" />

      <div className="elpida-logo-badge">
        <Logo size={88} />
      </div>

      <h1 className="elpida-title">Entrar na conta</h1>

      <div className="elpida-field">
        <label htmlFor="login-email">E-mail</label>
        <div className="elpida-input-wrap" style={{ borderColor: showError ? '#a13939' : undefined }}>
          <input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
        {showError && <p className="elpida-form-error">E-mail inválido. Confira o que foi digitado.</p>}
      </div>

      <div className="elpida-field">
        <label htmlFor="login-password">Senha</label>
        <div className="elpida-input-wrap">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="elpida-eye-btn"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Icon2D icon={showPassword ? Eye : EyeOff} size={19} />
          </button>
        </div>
      </div>

      {message && <p className="elpida-form-error elpida-form-error--box">{message}</p>}

      <div className="elpida-inline-link">
        Esqueceu a senha? <button type="button" className="elpida-link">Clique aqui</button>
      </div>

      <button className="elpida-btn elpida-btn--primary" onClick={handleSubmit} disabled={!emailValid || !password}>
        Entrar
      </button>

      <div className="elpida-btn-row">
        <button className="elpida-btn-sm" type="button" onClick={() => navigate('/cadastro')}>
          Criar conta
        </button>
      </div>

      <div className="elpida-bottom-text">
        Não tem uma conta?{' '}
        <Link className="elpida-link" to="/cadastro">
          Clique aqui
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
