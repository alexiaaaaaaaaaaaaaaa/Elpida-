import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useUser } from '../context/UserContext';

/** Primeira tela do protótipo: logo centralizada e depois segue para o login (ou início, se já logada). */
const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useUser();

  useEffect(() => {
    if (authLoading) return;
    const t = window.setTimeout(() => navigate(isAuthenticated ? '/inicio' : '/login', { replace: true }), 1600);
    return () => window.clearTimeout(t);
  }, [navigate, isAuthenticated, authLoading]);

  return (
    <div className="elpida-splash">
      <Logo size={132} />
    </div>
  );
};

export default SplashPage;
