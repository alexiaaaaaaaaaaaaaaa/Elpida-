import type { Book } from '../data/content';

/** Usa as capas reais anexadas; mantém fallback visual para qualquer livro futuro. */
const BookCover: React.FC<{ book: Book; className?: string }> = ({ book, className }) => (
  <div
    className={`elpida-cover ${book.cover ? 'elpida-cover--image' : ''} ${className ?? ''}`}
    style={{ background: book.cover ? undefined : book.bg, color: book.fg }}
  >
    {book.cover ? (
      <img src={book.cover} alt={`Capa de ${book.title}`} className="elpida-cover__image" />
    ) : (
      <>
        <span className="elpida-cover__title">{book.title}</span>
        <span className="elpida-cover__dots" style={{ background: book.fg }} />
      </>
    )}
  </div>
);

export default BookCover;
