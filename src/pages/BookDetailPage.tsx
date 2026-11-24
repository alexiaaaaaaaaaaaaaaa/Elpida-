import { Link, Navigate, useParams } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BookCover from '../components/BookCover';
import PageTitle from '../components/PageTitle';
import { useBooks } from '../context/BooksContext';
import { useUser } from '../context/UserContext';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { bookFlags, toggleBookFlag, setBookFlag } = useUser();
  const { books, loading } = useBooks();
  const book = books.find((b) => b.id === id);

  if (loading) return null;
  if (!book) return <Navigate to="/livros" replace />;

  const flags = bookFlags[book.id] ?? {};
  const similar = books.filter((b) => b.id !== book.id)
    .sort((a, b) => Number(!!b.infantil === !!book.infantil) - Number(!!a.infantil === !!book.infantil))
    .slice(0, 3);

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/livros">Livro</PageTitle>

      <section className="elpida-book-hero">
        <BookCover book={book} className="elpida-book-hero__cover" />
        <div className="elpida-book-hero__pills">
          <button className={flags.fav ? 'on' : ''} onClick={() => toggleBookFlag(book.id, 'fav')}>
            <Heart size={12} fill={flags.fav ? 'currentColor' : 'none'} /> {flags.fav ? 'Favorito' : 'Favoritar'}
          </button>
          <button className={flags.saved ? 'on' : ''} onClick={() => toggleBookFlag(book.id, 'saved')}>
            <Bookmark size={12} fill={flags.saved ? 'currentColor' : 'none'} /> {flags.saved ? 'Salvo' : 'Salvar'}
          </button>
          {book.infantil && <span>Infantil</span>}
        </div>
      </section>

      <h2 className="elpida-book-title">{book.title}</h2>
      {book.autora && <p className="elpida-book-desc" style={{ fontWeight: 600 }}>{book.autora}</p>}
      <p className="elpida-book-desc">{book.desc}</p>

      <Link
        to={`/livros/${book.id}/ler`}
        className="elpida-book-cta"
        onClick={() => setBookFlag(book.id, 'reading', true)}
      >
        Ler agora
      </Link>

      <div className="elpida-section__head" style={{ padding: '24px 20px 0' }}>
        <h3 className="elpida-section__title" style={{ fontSize: 14 }}>
          Obras semelhantes
        </h3>
      </div>
      <div className="elpida-similar">
        {similar.map((b) => (
          <Link key={b.id} to={`/livros/${b.id}`}>
            <BookCover book={b} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookDetailPage;
