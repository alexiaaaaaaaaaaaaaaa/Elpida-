import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Heart, Bookmark, Play, Plus, Trash2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import { useUser } from '../context/UserContext';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { formatDuration, parseVideoUrl } from '../utils/video';

interface Aula {
  id_videoaula: number;
  titulo: string;
  descricao: string | null;
  url_video: string;
  miniatura: string | null;
  duracao: number | null;
  status_publicacao: 'rascunho' | 'publicado' | 'arquivado';
  videoaula_categoria: { categoria: { nome_categoria: string } | null }[] | null;
}

const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId, isAdmin } = useUser();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [liked, setLiked] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabaseConfigured || !accountId) {
      setLoading(false);
      return;
    }
    const [vids, likes, saves] = await Promise.all([
      supabase
        .from('videoaula')
        .select(
          'id_videoaula, titulo, descricao, url_video, miniatura, duracao, status_publicacao, videoaula_categoria(categoria(nome_categoria))'
        )
        .order('data_publicacao', { ascending: false, nullsFirst: true })
        .order('id_videoaula', { ascending: false }),
      supabase.from('curte').select('id_videoaula').eq('id_usuario', accountId),
      supabase.from('salva').select('id_videoaula').eq('id_usuario', accountId),
    ]);
    if (vids.error) {
      setError('Não foi possível carregar as aulas.');
    } else {
      setError('');
      setAulas((vids.data ?? []) as unknown as Aula[]);
    }
    setLiked((likes.data ?? []).map((r: { id_videoaula: number }) => r.id_videoaula));
    setSaved((saves.data ?? []).map((r: { id_videoaula: number }) => r.id_videoaula));
    setLoading(false);
  }, [accountId]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = async (table: 'curte' | 'salva', id: number, on: boolean) => {
    const setList = table === 'curte' ? setLiked : setSaved;
    setList((prev) => (on ? prev.filter((x) => x !== id) : [...prev, id]));
    const query = supabase.from(table);
    const { error: err } = on
      ? await query.delete().eq('id_usuario', accountId).eq('id_videoaula', id)
      : await query.insert({ id_usuario: accountId, id_videoaula: id });
    if (err) setList((prev) => (on ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const remove = async (id: number) => {
    if (!window.confirm('Excluir esta videoaula definitivamente?')) return;
    const { error: err } = await supabase.from('videoaula').delete().eq('id_videoaula', id);
    if (err) window.alert('Não foi possível excluir a videoaula.');
    else setAulas((prev) => prev.filter((a) => a.id_videoaula !== id));
  };

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle>Aulas</PageTitle>

      {isAdmin && (
        <div style={{ padding: '0 20px 8px' }}>
          <button className="elpida-btn elpida-btn--primary" onClick={() => navigate('/aulas/nova')}>
            <Plus size={16} style={{ verticalAlign: -3, marginRight: 6 }} />
            Nova videoaula
          </button>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#555', padding: '30px 32px' }}>Carregando aulas...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#a13939', padding: '30px 32px' }}>{error}</p>
      ) : aulas.length === 0 ? (
        <div className="elpida-empty-state" style={{ paddingTop: 30 }}>
          <div className="elpida-empty-state__icon">
            <GraduationCap size={40} />
          </div>
          <h2>Aulas em breve</h2>
          <p>Estamos preparando conteúdos e cursos para você. Volte em breve!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 20px 24px' }}>
          {aulas.map((a) => {
            const source = parseVideoUrl(a.url_video);
            const isOpen = openId === a.id_videoaula;
            const cats = (a.videoaula_categoria ?? []).map((c) => c.categoria?.nome_categoria).filter(Boolean);
            const isLiked = liked.includes(a.id_videoaula);
            const isSaved = saved.includes(a.id_videoaula);
            return (
              <article
                key={a.id_videoaula}
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}
              >
                {isOpen && source.kind === 'iframe' ? (
                  <iframe
                    src={source.src}
                    title={a.titulo}
                    allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', aspectRatio: '16 / 9', border: 0, display: 'block' }}
                  />
                ) : isOpen && source.kind === 'file' ? (
                  <video src={source.src} controls autoPlay style={{ width: '100%', display: 'block' }} />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (source.kind === 'link') window.open(source.src, '_blank', 'noopener');
                      else setOpenId(a.id_videoaula);
                    }}
                    aria-label={`Assistir ${a.titulo}`}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      border: 0,
                      padding: 0,
                      cursor: 'pointer',
                      background: a.miniatura ? `center / cover url(${a.miniatura})` : 'var(--elpida-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,.55)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Play size={24} fill="currentColor" />
                    </span>
                    {a.duracao ? (
                      <span
                        style={{
                          position: 'absolute',
                          right: 8,
                          bottom: 8,
                          background: 'rgba(0,0,0,.7)',
                          color: '#fff',
                          fontSize: 11,
                          padding: '2px 6px',
                          borderRadius: 6,
                        }}
                      >
                        {formatDuration(a.duracao)}
                      </span>
                    ) : null}
                  </button>
                )}

                <div style={{ padding: '12px 14px 14px' }}>
                  <h3 style={{ margin: 0, fontSize: 15, color: 'var(--elpida-purple)' }}>
                    {a.titulo}
                    {a.status_publicacao !== 'publicado' && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: '#a13939' }}>({a.status_publicacao})</span>
                    )}
                  </h3>
                  {cats.length > 0 && (
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#666' }}>{cats.join(' · ')}</p>
                  )}
                  {a.descricao && <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.4 }}>{a.descricao}</p>}

                  <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => void toggle('curte', a.id_videoaula, isLiked)}
                      aria-label={isLiked ? 'Descurtir' : 'Curtir'}
                      style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--elpida-purple)' }}
                    >
                      <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggle('salva', a.id_videoaula, isSaved)}
                      aria-label={isSaved ? 'Remover dos salvos' : 'Salvar'}
                      style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--elpida-purple)' }}
                    >
                      <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => void remove(a.id_videoaula)}
                        aria-label="Excluir videoaula"
                        style={{ background: 'none', border: 0, cursor: 'pointer', color: '#a13939', marginLeft: 'auto' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
