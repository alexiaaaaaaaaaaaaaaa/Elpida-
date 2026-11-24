import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import BookCover from '../components/BookCover';
import { useBooks } from '../context/BooksContext';
import { useUser } from '../context/UserContext';

const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setBookFlag } = useUser();
  const [page, setPage] = useState(0);
  const { books, loading } = useBooks();
  const book = books.find((b) => b.id === id);

  useEffect(() => {
    if (book) setBookFlag(book.id, 'reading', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  if (loading) return null;
  if (!book) return <Navigate to="/livros" replace />;

  const total = 3;
  const progress = ((page + 1) / total) * 100;

  return (
    <div className="elpida-app-screen elpida-reader">
      <AppHeader />

      <div className="elpida-reader__bar" aria-label={`Página ${page + 1} de ${total}`}>
        <div className="elpida-reader__bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="elpida-reader__top">
        <button type="button" className="elpida-icon-btn" aria-label="Fechar leitura" onClick={() => navigate(`/livros/${book.id}`)}>
          <X size={18} />
        </button>
        <span>
          {page + 1} / {total}
        </span>
      </div>

      <div className="elpida-reader__page">
        {page === 0 && <BookCover book={book} className="elpida-reader__cover" />}
        {page === 1 && (
          <div className="elpida-reader__text">
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
          </div>
        )}
        {page === 2 && (
          <div className="elpida-reader__text">
            <h2>Continue sua leitura</h2>
            <p>O texto completo deste livro ainda não está disponível no app. Por enquanto, você pode salvá-lo e favoritá-lo na página do livro.</p>
          </div>
        )}
      </div>

      <div className="elpida-reader__nav">
        <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Página anterior">
          <ChevronLeft size={22} />
        </button>
        <button type="button" onClick={() => setPage((p) => Math.min(total - 1, p + 1))} disabled={page === total - 1} aria-label="Próxima página">
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default ReaderPage;
