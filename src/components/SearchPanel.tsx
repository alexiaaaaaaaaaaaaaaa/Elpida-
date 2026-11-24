import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useBooks } from '../context/BooksContext';
import { buildSearchIndex, searchItems } from '../utils/searchIndex';

const SUGGESTIONS = ['delegacia da mulher', 'ciclo da violência', 'livros', 'guardiões'];

const SearchPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { posts } = useUser();
  const { books } = useBooks();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildSearchIndex(posts, books), [posts, books]);
  const results = useMemo(() => searchItems(index, query), [index, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <div className="elpida-overlay" role="dialog" aria-label="Buscar">
      <div className="elpida-overlay__backdrop" onClick={onClose} />
      <div className="elpida-sheet">
        <div className="elpida-search-bar">
          <Search size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar livros, artigos, páginas..."
            aria-label="Buscar"
          />
          <button type="button" aria-label="Fechar busca" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="elpida-sheet__body">
          {query.trim() === '' ? (
            <>
              <p className="elpida-sheet__hint">Sugestões</p>
              <div className="elpida-chip-row" style={{ padding: 0, flexWrap: 'wrap', overflow: 'visible' }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="elpida-chip" onClick={() => setQuery(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </>
          ) : results.length === 0 ? (
            <p className="elpida-sheet__hint">Nada encontrado para "{query}".</p>
          ) : (
            results.map((r) => (
              <button key={r.id} className="elpida-result" onClick={() => go(r.to)}>
                <span className="elpida-result__text">
                  <strong>{r.label}</strong>
                  <small>{r.sub}</small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
