import { ARTICLES, INFO_PAGES, TIMELINE_POSTS } from '../data/content';
import type { Book } from '../data/content';
import type { Post } from '../context/UserContext';
import { normalize } from './storage';

export interface SearchItem {
  id: string;
  label: string;
  sub: string;
  to: string;
  text: string; // texto normalizado usado na comparação
}

function item(id: string, label: string, sub: string, to: string, extra = ''): SearchItem {
  return { id, label, sub, to, text: normalize(`${label} ${sub} ${extra}`) };
}

const PAGES: SearchItem[] = [
  item('p-inicio', 'Início', 'Página', '/inicio', 'home artigos saiba mais'),
  item('p-aulas', 'Aulas', 'Página', '/aulas', 'educação cursos'),
  item('p-livros', 'Livros', 'Página', '/livros', 'biblioteca leitura'),
  item('p-mapa', 'Mapa', 'Página', '/mapa', 'delegacia da mulher polícia hospital bombeiros localização perto'),
  item('p-timeline', 'Timeline', 'Página', '/timeline', 'publicações feed comunidade'),
  item('p-perfil', 'Perfil', 'Página', '/perfil', 'meu perfil posts salvos'),
  item('p-editar', 'Editar perfil', 'Página', '/perfil/editar', 'nome idade gênero foto'),
  item('p-ciclo', 'Ciclo da violência', 'Saiba mais', '/ciclo-da-violencia', 'fases tensão agressor'),
  item('p-local', 'Localização', 'Segurança', '/localizacao', 'ativar gps'),
  item('p-guardioes', 'Guardiões', 'Segurança', '/seguranca', 'contatos de confiança'),
  ...INFO_PAGES.map((p) => item(`i-${p.slug}`, p.title, 'Saiba mais', `/${p.slug}`, p.intro)),
];

export function buildSearchIndex(posts: Post[], books: Book[]): SearchItem[] {
  return [
    ...PAGES,
    ...books.map((b) => item(`b-${b.id}`, b.title, 'Livro', `/livros/${b.id}`, b.desc)),
    ...ARTICLES.map((a) => item(`a-${a.id}`, a.title, `Artigo · ${a.source}`, '/inicio')),
    ...TIMELINE_POSTS.map((t) =>
      item(`t-${t.id}`, t.quote ?? t.text ?? '', `Timeline · ${t.author}`, '/timeline', t.caption ?? '')
    ),
    ...posts.map((p) => item(`u-${p.id}`, p.caption || 'Meu post', 'Meus posts', '/perfil', p.caption)),
  ];
}

export function searchItems(index: SearchItem[], query: string, limit = 12): SearchItem[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return index.filter((it) => tokens.every((t) => it.text.includes(t))).slice(0, limit);
}
