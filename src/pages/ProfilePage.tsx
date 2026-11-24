import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Share2, Plus, Trash2 } from 'lucide-react';
import Avatar from '../components/Avatar';
import BookCover from '../components/BookCover';
import { HeaderActions } from '../components/AppHeader';
import { TIMELINE_POSTS } from '../data/content';
import { useBooks } from '../context/BooksContext';
import { useUser, GENDER_LABELS } from '../context/UserContext';

const tabs = ['Posts', 'Salvos', 'Sobre'] as const;
type Tab = (typeof tabs)[number];

const ProfilePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('Posts');
  const [notice, setNotice] = useState('');
  const { profile, initials, posts, likedIds, savedIds, bookFlags, deleteAccount } = useUser();
  const navigate = useNavigate();
  const { books } = useBooks();

  const genderLabel = GENDER_LABELS[profile.gender] ?? 'Não informado';
  const savedBooks = books.filter((b) => bookFlags[b.id]?.saved);
  const savedPosts = savedIds
    .map((id) => {
      const official = TIMELINE_POSTS.find((p) => p.id === id);
      if (official) return { id, label: official.quote ?? official.text ?? '', image: '' };
      const mine = posts.find((p) => `u-${p.id}` === id);
      if (mine) return { id, label: mine.caption, image: mine.imageUrl };
      return null;
    })
    .filter((x): x is { id: string; label: string; image: string } => x !== null);

  const shareProfile = async () => {
    const text = `${profile.name} no Elpida Protegida`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Elpida Protegida', text });
      } else {
        await navigator.clipboard.writeText(text);
        setNotice('Texto copiado');
        window.setTimeout(() => setNotice(''), 2200);
      }
    } catch {
      // compartilhamento cancelado ou indisponível
    }
  };

  return (
    <div className="elpida-app-screen">
      <header className="elpida-profile-hero">
        <span className="elpida-profile-hero__blob elpida-profile-hero__blob--l" />
        <span className="elpida-profile-hero__blob elpida-profile-hero__blob--r" />
        <HeaderActions className="elpida-profile-hero__actions" />
        <div className="elpida-profile-hero__avatar">
          <Avatar src={profile.avatar} initials={initials} size={96} />
        </div>
        <p className="elpida-profile-hero__name">{profile.name}</p>
        <p className="elpida-profile-hero__meta">
          {profile.age} anos · {genderLabel}
        </p>
      </header>

      <div className="elpida-profile-stats">
        <div>
          <p className="elpida-profile-stats__value">{posts.length}</p>
          <p className="elpida-profile-stats__label">Publicações</p>
        </div>
        <div>
          <p className="elpida-profile-stats__value">{likedIds.length}</p>
          <p className="elpida-profile-stats__label">Likes</p>
        </div>
        <div>
          <p className="elpida-profile-stats__value">{savedIds.length + savedBooks.length}</p>
          <p className="elpida-profile-stats__label">Salvos</p>
        </div>
      </div>

      <div className="elpida-profile-actions">
        <button onClick={() => navigate('/perfil/editar')}>
          <Pencil size={14} />
          Editar perfil
        </button>
        <button onClick={shareProfile}>
          <Share2 size={14} />
          Compartilhar
        </button>
      </div>

      <div className="elpida-profile-tabs">
        {tabs.map((t) => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Posts' && (
        <div className="elpida-profile-grid">
          <button
            className="elpida-profile-grid__item elpida-profile-grid__new"
            onClick={() => navigate('/perfil/novo-post')}
            aria-label="Criar novo post"
          >
            <Plus size={26} />
            <span>Novo post</span>
          </button>
          {posts.map((post) => (
            <div
              key={post.id}
              className="elpida-profile-grid__item"
              style={{ backgroundImage: `url(${post.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              title={post.caption}
            />
          ))}
        </div>
      )}

      {tab === 'Salvos' &&
        (savedPosts.length === 0 && savedBooks.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#555', padding: '32px 32px' }}>
            Você ainda não salvou nada. Salve posts na Timeline e livros na Biblioteca.
          </p>
        ) : (
          <div className="elpida-profile-grid">
            {savedBooks.map((b) => (
              <Link key={b.id} to={`/livros/${b.id}`} className="elpida-profile-grid__item elpida-profile-grid__cover">
                <BookCover book={b} />
              </Link>
            ))}
            {savedPosts.map((p) => (
              <Link
                key={p.id}
                to="/timeline"
                className="elpida-profile-grid__item elpida-profile-grid__note"
                style={p.image ? { backgroundImage: `url(${p.image})`, backgroundSize: 'cover' } : undefined}
              >
                {!p.image && <span>{p.label}</span>}
              </Link>
            ))}
          </div>
        ))}

      {tab === 'Sobre' && (
        <div className="elpida-about">
          <p>
            <strong>Nome:</strong> {profile.name}
          </p>
          <p>
            <strong>Idade:</strong> {profile.age} anos
          </p>
          <p>
            <strong>Gênero:</strong> {genderLabel}
          </p>
          <div className="elpida-about__actions">
            <button className="elpida-about__edit" onClick={() => navigate('/perfil/editar')}>
              Editar informações
            </button>
            <button
              className="elpida-about__delete"
              onClick={() => {
                const confirmed = window.confirm(
                  'Excluir esta conta? Seus dados serão removidos definitivamente e não poderão ser recuperados.'
                );
                if (!confirmed) return;
                void deleteAccount().then((res) => {
                  if (res.ok) navigate('/login', { replace: true });
                  else window.alert(res.message);
                });
              }}
            >
              <Trash2 size={15} strokeWidth={1.8} />
              Excluir conta
            </button>
          </div>
        </div>
      )}

      {notice && <div className="elpida-toast">{notice}</div>}
    </div>
  );
};

export default ProfilePage;
