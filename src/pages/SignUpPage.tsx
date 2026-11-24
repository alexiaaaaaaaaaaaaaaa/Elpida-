import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Globe } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';
import Icon2D from '../components/Icon2D';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { createAccount } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState('');
  const [info, setInfo] = useState('');

  const emailValid = EMAIL_RE.test(email.trim());
  const showEmailError = touched && email.length > 0 && !emailValid;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = acceptedTerms && emailValid && password.length >= 6 && passwordsMatch;

  const handleSubmit = async () => {
    setTouched(true);
    setMessage('');
    setInfo('');
    if (!canSubmit) return;

    const result = await createAccount(email, password);
    if (!result.ok) {
      setMessage(result.message ?? 'Não foi possível criar a conta.');
      return;
    }
    if (result.needsConfirmation) {
      setInfo(result.message ?? 'Confirme seu e-mail para continuar.');
      return;
    }
    navigate('/configurar-conta');
  };

  return (
    <div className="elpida-card elpida-auth-card elpida-auth-card--signup">
      <div className="elpida-top-curve" />
      <div className="elpida-blob elpida-blob--top-right" />
      <div className="elpida-blob" />

      <div className="elpida-logo-badge">
        <Logo size={88} />
      </div>
      <h1 className="elpida-title elpida-title--signup">Criar conta</h1>

      <div className="elpida-field">
        <label htmlFor="signup-email">E-mail</label>
        <div className="elpida-input-wrap" style={{ borderColor: showEmailError ? '#a13939' : undefined }}>
          <input
            id="signup-email"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </div>
        {showEmailError && <p className="elpida-form-error">E-mail inválido. Confira o que foi digitado.</p>}
      </div>

      <div className="elpida-field">
        <label htmlFor="signup-password">Senha</label>
        <div className="elpida-input-wrap">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Crie uma senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="elpida-eye-btn" onClick={() => setShowPassword((v) => !v)}>
            <Icon2D icon={showPassword ? Eye : EyeOff} size={19} />
          </button>
        </div>
      </div>

      <div className="elpida-field">
        <label htmlFor="signup-confirm">Confirme a senha</label>
        <div className="elpida-input-wrap">
          <input
            id="signup-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="button" className="elpida-eye-btn" onClick={() => setShowConfirm((v) => !v)}>
            <Icon2D icon={showConfirm ? Eye : EyeOff} size={19} />
          </button>
        </div>
        {touched && confirmPassword.length > 0 && !passwordsMatch && (
          <p className="elpida-form-error">As senhas não coincidem.</p>
        )}
      </div>

      <div className="elpida-checkbox-row">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          id="terms"
        />
        <label htmlFor="terms">Aceito os <a className="elpida-link" href="#">termos e condições</a> do aplicativo</label>
      </div>

      {info && <div className="elpida-form-error elpida-form-error--box" style={{ color: 'var(--elpida-purple)' }}>{info}</div>}

      {message && (
        <div className="elpida-form-error elpida-form-error--box">
          {message}{' '}
          <button type="button" className="elpida-link" onClick={() => navigate('/login')}>
            Entrar com esta conta
          </button>
        </div>
      )}

      <button className="elpida-btn elpida-btn--primary" disabled={!canSubmit} onClick={handleSubmit}>
        Criar conta
      </button>

      <div className="elpida-divider">Tente de outra forma</div>

      <div className="elpida-btn-row">
        <button className="elpida-btn-sm" type="button">
          <Icon2D icon={Globe} size={17} />
          Google
        </button>
        <button className="elpida-btn-sm" type="button" onClick={() => navigate('/login')}>
          Entrar
        </button>
      </div>

      <div className="elpida-bottom-text">
        Já tem uma conta?{' '}
        <Link className="elpida-link" to="/login">Clique aqui</Link>
      </div>
    </div>
  );
};

export default SignUpPage;
