import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import BookCover from '../components/BookCover';
import type { Book } from '../data/content';
import { useBooks } from '../context/BooksContext';
import { useUser } from '../context/UserContext';

const filters = ['Todos', 'Lendo', 'Salvos', 'Infantis', 'Favoritos'] as const;
type Filter = (typeof filters)[number];

function chunk<T>(list: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

const BooksPage: React.FC = () => {
  const [active, setActive] = useState<Filter>('Todos');
  const { bookFlags } = useUser();
  const { books, loading, error } = useBooks();

  const matches = (b: Book): boolean => {
    const flags = bookFlags[b.id] ?? {};
    switch (active) {
      case 'Lendo':
        return !!flags.reading;
      case 'Salvos':
        return !!flags.saved;
      case 'Infantis':
        return !!b.infantil;
      case 'Favoritos':
        return !!flags.fav;
      default:
        return true;
    }
  };

  const visible = books.filter(matches);
  const rows = chunk(visible, 3);

  return (
    <div className="elpida-app-screen">
      <AppHeader />

      <div className="elpida-chip-row" style={{ marginTop: 14 }}>
        {filters.map((f) => (
          <button key={f} className={`elpida-chip ${active === f ? 'active' : ''}`} onClick={() => setActive(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#555', padding: '40px 32px' }}>Carregando livros...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#a13939', padding: '40px 32px' }}>{error}</p>
      ) : visible.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#555', padding: '40px 32px' }}>
          {active === 'Todos'
            ? 'Nenhum livro cadastrado ainda.'
            : `Nenhum livro em "${active}" ainda. Abra um livro para lê-lo, salvá-lo ou favoritá-lo.`}
        </p>
      ) : (
        <div style={{ marginTop: 14 }}>
          {rows.map((row, i) => (
            <div key={i} className={`elpida-shelf ${i % 2 === 1 ? 'elpida-shelf--alt' : ''}`}>
              {row.map((b) => (
                <Link key={b.id} to={`/livros/${b.id}`} className="elpida-shelf__book">
                  <BookCover book={b} />
                  <div className="elpida-shelf__panel" style={{ background: b.panel }}>
                    <p>{b.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
