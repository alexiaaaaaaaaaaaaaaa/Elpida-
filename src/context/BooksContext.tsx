import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { BOOKS as STATIC_BOOKS, Book } from '../data/content';
import { normalize } from '../utils/storage';
import { useUser } from './UserContext';

interface LivroRow {
  id_livro: number;
  titulo: string;
  autora: string | null;
  sinopse: string | null;
  capa_url: string | null;
  link: string | null;
  livro_categoria: { categoria: { nome_categoria: string } | null }[] | null;
}

/** Cores usadas quando o livro não tem um estilo definido no protótipo. */
const PALETTE = [
  { bg: '#796aaa', fg: '#ffffff', panel: '#796aaa' },
  { bg: '#e8742a', fg: '#ffffff', panel: '#6c8c7d' },
  { bg: '#2f4b7c', fg: '#ffe9a8', panel: '#796aaa' },
  { bg: '#1f7a72', fg: '#f7e04b', panel: '#6c8c7d' },
  { bg: '#c94f6d', fg: '#ffffff', panel: '#796aaa' },
];

function toBook(row: LivroRow): Book {
  const styled = STATIC_BOOKS.find((b) => normalize(b.title) === normalize(row.titulo));
  const colors = styled ?? PALETTE[row.id_livro % PALETTE.length];
  const categorias = (row.livro_categoria ?? []).map((lc) => lc.categoria?.nome_categoria ?? '');
  return {
    id: String(row.id_livro),
    title: row.titulo,
    desc: row.sinopse ?? '',
    bg: colors.bg,
    fg: colors.fg,
    panel: colors.panel,
    cover: row.capa_url ?? undefined,
    infantil: categorias.includes('Infantil'),
    autora: row.autora ?? undefined,
    link: row.link ?? undefined,
  };
}

interface BooksContextValue {
  books: Book[];
  loading: boolean;
  error: string;
}

const BooksContext = createContext<BooksContextValue>({ books: [], loading: true, error: '' });

/** Carrega os livros da tabela LIVRO (Supabase). Sem .env, usa os livros de exemplo do app. */
export const BooksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { accountId } = useUser();
  const [books, setBooks] = useState<Book[]>(supabaseConfigured ? [] : STATIC_BOOKS);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabaseConfigured) return;
    if (!accountId) {
      setBooks([]);
      return;
    }
    let active = true;
    setLoading(true);
    supabase
      .from('livro')
      .select('id_livro, titulo, autora, sinopse, capa_url, link, livro_categoria(categoria(nome_categoria))')
      .order('id_livro')
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err) {
          setError('Não foi possível carregar os livros.');
          setBooks([]);
        } else {
          setError('');
          setBooks(((data ?? []) as unknown as LivroRow[]).map(toBook));
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [accountId]);

  return <BooksContext.Provider value={{ books, loading, error }}>{children}</BooksContext.Provider>;
};

export function useBooks() {
  return useContext(BooksContext);
}
