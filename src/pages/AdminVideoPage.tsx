import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

interface Categoria {
  id_categoria: number;
  nome_categoria: string;
}

const AdminVideoPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, accountId } = useUser();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [url, setUrl] = useState('');
  const [miniatura, setMiniatura] = useState('');
  const [minutos, setMinutos] = useState('');
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [publicar, setPublicar] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    supabase
      .from('categoria')
      .select('id_categoria, nome_categoria')
      .order('nome_categoria')
      .then(({ data }) => setCategorias((data ?? []) as Categoria[]));
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/aulas" replace />;

  const urlValida = /^https?:\/\/.+/i.test(url.trim());
  const canSave = titulo.trim().length > 0 && urlValida && selecionadas.length > 0 && !saving;

  const toggleCategoria = (id: number) =>
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setMessage('');

    const duracao = minutos.trim() ? Math.round(Number(minutos.replace(',', '.')) * 60) : null;
    const { data, error } = await supabase
      .from('videoaula')
      .insert({
        id_admin: accountId,
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        url_video: url.trim(),
        miniatura: miniatura.trim() || null,
        duracao: duracao !== null && !Number.isNaN(duracao) ? duracao : null,
        status_publicacao: publicar ? 'publicado' : 'rascunho',
      })
      .select('id_videoaula')
      .single();

    if (error || !data) {
      setSaving(false);
      setMessage('Não foi possível salvar a videoaula. Confirme se sua conta é de administrador.');
      return;
    }

    const { error: catError } = await supabase
      .from('videoaula_categoria')
      .insert(selecionadas.map((id_categoria) => ({ id_videoaula: data.id_videoaula, id_categoria })));

    setSaving(false);
    if (catError) {
      setMessage('A videoaula foi salva, mas as categorias não. Edite no painel do Supabase.');
      return;
    }
    navigate('/aulas');
  };

  const box: React.CSSProperties = { width: '100%', border: 0, outline: 'none', background: 'transparent', font: 'inherit' };

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle back="/aulas">Nova videoaula</PageTitle>

      <div className="elpida-form">
        <div className="elpida-field">
          <label>Título *</label>
          <div className="elpida-input-wrap">
            <input placeholder="Ex.: Primeiros passos de autodefesa" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
        </div>

        <div className="elpida-field">
          <label>Descrição</label>
          <div className="elpida-input-wrap">
            <textarea rows={3} style={box} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
        </div>

        <div className="elpida-field">
          <label>Link do vídeo * (YouTube, Vimeo ou .mp4)</label>
          <div className="elpida-input-wrap">
            <input placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        </div>

        <div className="elpida-field">
          <label>Link da miniatura (opcional)</label>
          <div className="elpida-input-wrap">
            <input placeholder="https://..." value={miniatura} onChange={(e) => setMiniatura(e.target.value)} />
          </div>
        </div>

        <div className="elpida-field">
          <label>Duração em minutos (opcional)</label>
          <div className="elpida-input-wrap">
            <input inputMode="decimal" placeholder="Ex.: 12" value={minutos} onChange={(e) => setMinutos(e.target.value)} />
          </div>
        </div>

        <div className="elpida-field">
          <label>Categorias * (escolha ao menos uma)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {categorias.map((c) => (
              <button
                key={c.id_categoria}
                type="button"
                className={`elpida-chip ${selecionadas.includes(c.id_categoria) ? 'active' : ''}`}
                onClick={() => toggleCategoria(c.id_categoria)}
              >
                {c.nome_categoria}
              </button>
            ))}
          </div>
        </div>

        <div className="elpida-checkbox-row">
          <input type="checkbox" id="publicar" checked={publicar} onChange={(e) => setPublicar(e.target.checked)} />
          <label htmlFor="publicar">Publicar agora (desmarque para salvar como rascunho)</label>
        </div>

        {message && <p className="elpida-form-error elpida-form-error--box">{message}</p>}

        <button className="elpida-btn elpida-btn--primary" disabled={!canSave} onClick={() => void handleSave()}>
          {saving ? 'Salvando...' : 'Salvar videoaula'}
        </button>
      </div>
    </div>
  );
};

export default AdminVideoPage;
