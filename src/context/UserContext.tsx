import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { uid } from '../utils/storage';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  avatar: string;
  email: string;
  isAdmin: boolean;
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  createdAt: number;
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SavedLocation {
  lat: number;
  lon: number;
  savedAt: number;
}

export type BookFlag = 'saved' | 'fav' | 'reading';
export type BookFlags = Record<string, Partial<Record<BookFlag, boolean>>>;
type LocalBookFlags = Record<string, { saved?: boolean; reading?: boolean }>;

export const GENDER_LABELS: Record<string, string> = {
  feminino: 'Feminino',
  masculino: 'Masculino',
  'nao-binario': 'Não-binário',
  'prefiro-nao-dizer': 'Prefiro não dizer',
  '': 'Não informado',
};

export function greetingFor(gender: string): string {
  if (gender === 'feminino') return 'Bem-vinda';
  if (gender === 'masculino') return 'Bem-vindo';
  return 'Boas-vindas';
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Visitante',
  age: 18,
  gender: '',
  avatar: '',
  email: '',
  isAdmin: false,
};

/* ------------------------------------------------------------------ */
/* Dados que ainda ficam só neste aparelho (não fazem parte do modelo  */
/* do banco): posts, curtidas/salvos de posts, guardiões, localização  */
/* e os marcadores "salvo" / "lendo" dos livros.                        */
/* ------------------------------------------------------------------ */
interface LocalData {
  posts: Post[];
  likedIds: string[];
  savedIds: string[];
  bookLocal: LocalBookFlags;
  guardians: Guardian[];
  lastLocation: SavedLocation | null;
}

const EMPTY_LOCAL: LocalData = {
  posts: [],
  likedIds: [],
  savedIds: [],
  bookLocal: {},
  guardians: [],
  lastLocation: null,
};

const localKey = (userId: string) => `elpida:local:${userId}`;

function loadLocal(userId: string): LocalData {
  try {
    const raw = localStorage.getItem(localKey(userId));
    return raw ? { ...EMPTY_LOCAL, ...(JSON.parse(raw) as Partial<LocalData>) } : EMPTY_LOCAL;
  } catch {
    return EMPTY_LOCAL;
  }
}

function saveLocal(userId: string, data: LocalData) {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(data));
  } catch {
    // Imagens em base64 podem exceder a cota do localStorage.
  }
}

/* O banco guarda data_nascimento; o app trabalha com idade. */
function ageFromBirth(birth: string | null): number {
  if (!birth) return DEFAULT_PROFILE.age;
  const b = new Date(birth);
  if (Number.isNaN(b.getTime())) return DEFAULT_PROFILE.age;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const beforeBirthday =
    now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
  if (beforeBirthday) age -= 1;
  return Math.max(0, age);
}

function birthFromAge(age: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - age);
  return d.toISOString().slice(0, 10);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function authMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail (veja a caixa de entrada) antes de entrar.';
  if (m.includes('already registered')) return 'Este e-mail já possui uma conta.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (m.includes('password')) return 'A senha não atende aos requisitos (mínimo de 6 caracteres).';
  if (m.includes('fetch') || m.includes('network')) return 'Sem conexão com o servidor. Verifique sua internet.';
  return 'Não foi possível concluir. Tente novamente.';
}

interface AuthResult {
  ok: boolean;
  existing?: boolean;
  needsConfirmation?: boolean;
  message?: string;
}

interface UserContextValue {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => void;
  initials: string;
  firstName: string;
  greeting: string;
  isAuthenticated: boolean;
  authLoading: boolean;
  isAdmin: boolean;
  accountId: string;
  accountEmail: string;
  loginExistingAccount: (email: string, password: string) => Promise<AuthResult>;
  createAccount: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  deleteAccount: () => Promise<{ ok: boolean; message?: string }>;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  likedIds: string[];
  savedIds: string[];
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  bookFlags: BookFlags;
  toggleBookFlag: (id: string, flag: BookFlag) => void;
  setBookFlag: (id: string, flag: BookFlag, value: boolean) => void;
  guardians: Guardian[];
  addGuardian: (guardian: Omit<Guardian, 'id'>) => void;
  removeGuardian: (id: string) => void;
  lastLocation: SavedLocation | null;
  saveLocation: (location: SavedLocation) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // dados locais
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [bookLocal, setBookLocal] = useState<LocalBookFlags>({});
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [lastLocation, setLastLocation] = useState<SavedLocation | null>(null);

  // favoritos vêm do banco (tabela FAVORITA)
  const [favIds, setFavIds] = useState<string[]>([]);

  const localReadyFor = useRef('');
  const loadedFor = useRef('');

  const resetState = useCallback(() => {
    loadedFor.current = '';
    localReadyFor.current = '';
    setUserId('');
    setProfile(DEFAULT_PROFILE);
    setPosts([]);
    setLikedIds([]);
    setSavedIds([]);
    setBookLocal({});
    setGuardians([]);
    setLastLocation(null);
    setFavIds([]);
  }, []);

  /** Carrega perfil, favoritos e dados locais do usuário da sessão. */
  const applySession = useCallback(
    async (session: Session | null) => {
      if (!session) {
        resetState();
        return;
      }
      const user = session.user;
      if (loadedFor.current === user.id) return;
      loadedFor.current = user.id;

      const [{ data: row, error: rowError }, { data: favs, error: favsError }] = await Promise.all([
        supabase
          .from('usuario')
          .select('nome, genero, foto_perfil, data_nascimento, tipo_perfil, status_conta')
          .eq('id_usuario', user.id)
          .maybeSingle(),
        supabase.from('favorita').select('id_livro').eq('id_usuario', user.id),
      ]);

      if (rowError) console.error('Erro ao ler perfil:', rowError);
      if (favsError) console.error('Erro ao ler favoritos:', favsError);

      if (row && row.status_conta !== 'ativa') {
        await supabase.auth.signOut();
        resetState();
        return;
      }

      const local = loadLocal(user.id);
      setProfile({
        name: row?.nome ?? DEFAULT_PROFILE.name,
        age: ageFromBirth(row?.data_nascimento ?? null),
        gender: row?.genero ?? '',
        avatar: row?.foto_perfil ?? '',
        email: user.email ?? '',
        isAdmin: row?.tipo_perfil === 'administrador',
      });
      setFavIds((favs ?? []).map((f: { id_livro: number }) => String(f.id_livro)));
      setPosts(local.posts);
      setLikedIds(local.likedIds);
      setSavedIds(local.savedIds);
      setBookLocal(local.bookLocal);
      setGuardians(local.guardians);
      setLastLocation(local.lastLocation);
      localReadyFor.current = user.id;
      setUserId(user.id);
    },
    [resetState]
  );

  useEffect(() => {
    if (!supabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      await applySession(data.session);
      if (active) setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // adiado para não chamar o Supabase de dentro do próprio callback
      window.setTimeout(() => {
        if (active) void applySession(session);
      }, 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  // grava os dados locais sempre que mudarem
  useEffect(() => {
    if (!userId || localReadyFor.current !== userId) return;
    saveLocal(userId, { posts, likedIds, savedIds, bookLocal, guardians, lastLocation });
  }, [userId, posts, likedIds, savedIds, bookLocal, guardians, lastLocation]);

  /* ----------------------------- autenticação ----------------------------- */

  const createAccount = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabaseConfigured) return { ok: false, message: 'Servidor não configurado (arquivo .env).' };
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) {
      const existing = error.message.toLowerCase().includes('already registered');
      return { ok: false, existing, message: authMessage(error.message) };
    }
    // com confirmação de e-mail ligada, e-mail repetido volta sem identidades
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { ok: false, existing: true, message: 'Este e-mail já possui uma conta.' };
    }
    if (!data.session) {
      return {
        ok: true,
        needsConfirmation: true,
        message: 'Enviamos um e-mail de confirmação. Confirme e depois entre na sua conta.',
      };
    }
    await applySession(data.session);
    return { ok: true };
  };

  const loginExistingAccount = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabaseConfigured) return { ok: false, message: 'Servidor não configurado (arquivo .env).' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, message: authMessage(error.message) };
    await applySession(data.session);
    return { ok: true };
  };

  const logout = () => {
    void supabase.auth.signOut();
    resetState();
  };

  const deleteAccount = async () => {
    if (!userId) return { ok: false, message: 'Nenhuma conta ativa.' };
    const { error } = await supabase.rpc('excluir_minha_conta');
    if (error) {
      return {
        ok: false,
        message:
          'Não foi possível excluir a conta agora. Contas de administrador com videoaulas cadastradas precisam ser tratadas pelo painel do Supabase.',
      };
    }
    try {
      localStorage.removeItem(localKey(userId));
    } catch {
      /* ignora */
    }
    await supabase.auth.signOut();
    resetState();
    return { ok: true };
  };

  /* -------------------------------- perfil -------------------------------- */

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial, email: prev.email, isAdmin: prev.isAdmin }));
    if (!userId) return;
    const row: Record<string, string | null> = {};
    if (partial.name !== undefined) row.nome = partial.name;
    if (partial.age !== undefined) row.data_nascimento = birthFromAge(partial.age);
    if (partial.gender !== undefined) row.genero = partial.gender || null;
    if (partial.avatar !== undefined) row.foto_perfil = partial.avatar || null;
    if (Object.keys(row).length > 0) {
      void supabase
        .from('usuario')
        .update(row)
        .eq('id_usuario', userId)
        .select('id_usuario')
        .then(({ data, error }) => {
          if (error) {
            console.error('Erro ao salvar perfil:', error);
            window.alert(`Não foi possível salvar o perfil.\n\nMotivo: ${error.message}`);
          } else if (!data || data.length === 0) {
            console.error('Nenhuma linha atualizada em usuario para', userId);
            window.alert(
              'O perfil não foi salvo: o banco não encontrou a sua linha na tabela "usuario" (ou bloqueou a gravação).'
            );
          }
        });
    }
  };

  /* --------------------------- posts / locais ----------------------------- */

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = { ...post, id: uid(), createdAt: Date.now() };
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLike = (id: string) => setLikedIds((prev) => toggleInList(prev, id));
  const toggleSave = (id: string) => setSavedIds((prev) => toggleInList(prev, id));

  const addGuardian = (guardian: Omit<Guardian, 'id'>) => {
    setGuardians((prev) => (prev.length >= 3 ? prev : [...prev, { ...guardian, id: uid() }]));
  };
  const removeGuardian = (id: string) => setGuardians((prev) => prev.filter((g) => g.id !== id));
  const saveLocation = (location: SavedLocation) => setLastLocation(location);

  /* -------------------------------- livros -------------------------------- */

  const bookFlags = useMemo<BookFlags>(() => {
    const merged: BookFlags = {};
    Object.entries(bookLocal).forEach(([id, f]) => {
      merged[id] = { ...f };
    });
    favIds.forEach((id) => {
      merged[id] = { ...merged[id], fav: true };
    });
    return merged;
  }, [bookLocal, favIds]);

  const setFavorite = (id: string, value: boolean) => {
    setFavIds((prev) => (value ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)));
    const idLivro = Number(id);
    if (!userId || Number.isNaN(idLivro)) return;
    const request = value
      ? supabase.from('favorita').upsert({ id_usuario: userId, id_livro: idLivro })
      : supabase.from('favorita').delete().eq('id_usuario', userId).eq('id_livro', idLivro);
    void request.then(({ error }) => {
      if (!error) return;
      console.error('Erro ao salvar favorito:', error);
      // desfaz a marcação na tela, já que não foi gravada
      setFavIds((prev) => (value ? prev.filter((x) => x !== id) : prev.includes(id) ? prev : [...prev, id]));
      window.alert(`Não foi possível salvar o favorito.\n\nMotivo: ${error.message}`);
    });
  };

  const setBookFlag = (id: string, flag: BookFlag, value: boolean) => {
    if (flag === 'fav') {
      setFavorite(id, value);
      return;
    }
    setBookLocal((prev) => ({ ...prev, [id]: { ...prev[id], [flag]: value } }));
  };

  const toggleBookFlag = (id: string, flag: BookFlag) => {
    setBookFlag(id, flag, !bookFlags[id]?.[flag]);
  };

  const initials = getInitials(profile.name);
  const firstName = profile.name.trim().split(/\s+/)[0] || 'Visitante';
  const greeting = greetingFor(profile.gender);

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        initials,
        firstName,
        greeting,
        isAuthenticated: !!userId,
        authLoading,
        isAdmin: profile.isAdmin,
        accountId: userId,
        accountEmail: profile.email,
        loginExistingAccount,
        createAccount,
        logout,
        deleteAccount,
        posts,
        addPost,
        likedIds,
        savedIds,
        toggleLike,
        toggleSave,
        bookFlags,
        toggleBookFlag,
        setBookFlag,
        guardians,
        addGuardian,
        removeGuardian,
        lastLocation,
        saveLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser precisa ser usado dentro de <UserProvider>');
  return ctx;
}
