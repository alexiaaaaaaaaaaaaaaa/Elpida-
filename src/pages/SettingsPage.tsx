import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, PlusCircle, LogOut, Trash2, ShieldCheck } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import Icon2D from '../components/Icon2D';
import { useUser } from '../context/UserContext';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountEmail, profile, logout, deleteAccount } = useUser();
  const [deleting, setDeleting] = useState(false);

  const handleAddAccount = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDelete = () => {
    if (deleting) return;
    const confirmed = window.confirm(
      `Excluir definitivamente a conta ${accountEmail}?\n\nSeus dados serão apagados e não poderão ser recuperados.`
    );
    if (!confirmed) return;
    setDeleting(true);
    void deleteAccount().then((res) => {
      if (res.ok) {
        navigate('/login', { replace: true });
      } else {
        setDeleting(false);
        window.alert(res.message);
      }
    });
  };

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/perfil">Configurações</PageTitle>

      <div className="elpida-account-badge">
        <strong>Conta atual</strong><br />
        {profile.name !== 'Visitante' ? profile.name : 'Perfil ainda não configurado'} · {accountEmail}
      </div>

      <div className="elpida-settings-list">
        <button className="elpida-settings-card" onClick={() => navigate('/perfil/editar')}>
          <span className="elpida-settings-card__icon"><Icon2D icon={UserRound} size={21} /></span>
          <span className="elpida-settings-card__copy">
            <span className="elpida-settings-card__title">Editar perfil</span>
            <span className="elpida-settings-card__desc">Nome, idade, gênero e foto da conta atual.</span>
          </span>
        </button>

        <button className="elpida-settings-card" onClick={handleAddAccount}>
          <span className="elpida-settings-card__icon"><Icon2D icon={PlusCircle} size={21} /></span>
          <span className="elpida-settings-card__copy">
            <span className="elpida-settings-card__title">Adicionar outra conta</span>
            <span className="elpida-settings-card__desc">Sai desta sessão sem apagar os dados e permite entrar com outro e-mail.</span>
          </span>
        </button>

        <button className="elpida-settings-card" onClick={() => { logout(); navigate('/login', { replace: true }); }}>
          <span className="elpida-settings-card__icon"><Icon2D icon={LogOut} size={21} /></span>
          <span className="elpida-settings-card__copy">
            <span className="elpida-settings-card__title">Sair da conta</span>
            <span className="elpida-settings-card__desc">Encerra a sessão, mas mantém os dados para o próximo login.</span>
          </span>
        </button>

        <div className="elpida-settings-card" style={{ cursor: 'default' }}>
          <span className="elpida-settings-card__icon"><Icon2D icon={ShieldCheck} size={21} /></span>
          <span className="elpida-settings-card__copy">
            <span className="elpida-settings-card__title">Dados protegidos na sua conta</span>
            <span className="elpida-settings-card__desc">Seus dados ficam vinculados ao seu e-mail e só você tem acesso a eles.</span>
          </span>
        </div>

        <button className="elpida-settings-card elpida-settings-card--danger" onClick={handleDelete} disabled={deleting}>
          <span className="elpida-settings-card__icon"><Icon2D icon={Trash2} size={21} /></span>
          <span className="elpida-settings-card__copy">
            <span className="elpida-settings-card__title">Excluir conta definitivamente</span>
            <span className="elpida-settings-card__desc">Apaga somente esta conta e todos os dados associados a este e-mail.</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
