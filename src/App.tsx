import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { BooksProvider } from './context/BooksContext';

import AppLayout from './components/AppLayout';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AccountSetupPage from './pages/AccountSetupPage';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import ReaderPage from './pages/ReaderPage';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import ClassesPage from './pages/ClassesPage';
import LocationPage from './pages/LocationPage';
import GuardiansPage from './pages/GuardiansPage';
import AddGuardianPage from './pages/AddGuardianPage';
import CycleOfViolencePage from './pages/CycleOfViolencePage';
import InfoPage from './pages/InfoPage';
import SettingsPage from './pages/SettingsPage';
import AdminVideoPage from './pages/AdminVideoPage';
import TermsPage from './pages/TermsPage';

/** Tela de login já pula para o Início se a sessão estiver salva. */
const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useUser();
  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to="/inicio" replace />;
  return <>{children}</>;
};

/** Telas internas exigem sessão ativa; sem ela, volta para o login. */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useUser();
  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Abertura + autenticação (sem busca/notificações/menu) */}
    <Route path="/" element={<SplashPage />} />
    <Route
      path="/login"
      element={
        <RedirectIfAuthenticated>
          <LoginPage />
        </RedirectIfAuthenticated>
      }
    />
    <Route path="/cadastro" element={<SignUpPage />} />
    <Route path="/termos" element={<TermsPage />} />
    <Route path="/configurar-conta" element={<RequireAuth><AccountSetupPage /></RequireAuth>} />

    {/* Onboarding de segurança */}
    <Route path="/localizacao" element={<RequireAuth><LocationPage /></RequireAuth>} />
    <Route path="/seguranca" element={<RequireAuth><GuardiansPage /></RequireAuth>} />
    <Route path="/guardioes/adicionar" element={<RequireAuth><AddGuardianPage /></RequireAuth>} />

    {/* Todas as telas internas dividem o mesmo layout: cabeçalho com busca, notificações e menu + navegação */}
    <Route
      element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }
    >
      <Route path="/inicio" element={<HomePage />} />
      <Route path="/aulas" element={<ClassesPage />} />
      <Route path="/aulas/nova" element={<AdminVideoPage />} />
      <Route path="/livros" element={<BooksPage />} />
      <Route path="/livros/:id" element={<BookDetailPage />} />
      <Route path="/livros/:id/ler" element={<ReaderPage />} />
      <Route path="/mapa" element={<MapPage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/perfil/editar" element={<EditProfilePage />} />
      <Route path="/configuracoes" element={<SettingsPage />} />
      <Route path="/perfil/novo-post" element={<CreatePostPage />} />
      <Route path="/ciclo-da-violencia" element={<CycleOfViolencePage />} />
      <Route path="/como-pedir-ajuda" element={<InfoPage slug="como-pedir-ajuda" />} />
      <Route path="/como-se-proteger" element={<InfoPage slug="como-se-proteger" />} />
    </Route>

    {/* rotas antigas / desconhecidas */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <UserProvider>
    <BooksProvider>
      <BrowserRouter>
        {/* Moldura travada nas dimensões lógicas do iPhone 16 Pro (393 x 852),
            responsiva: em telas menores ocupa 100% da largura. */}
        <div className="elpida-viewport">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </BooksProvider>
  </UserProvider>
);

export default App;
