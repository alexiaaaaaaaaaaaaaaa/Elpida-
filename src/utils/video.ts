/** Converte links do YouTube em links de player; devolve o tipo de reprodução. */
export type VideoSource =
  | { kind: 'iframe'; src: string }
  | { kind: 'file'; src: string }
  | { kind: 'link'; src: string };

export function parseVideoUrl(url: string): VideoSource {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      return { kind: 'iframe', src: `https://www.youtube.com/embed/${u.pathname.slice(1)}` };
    }
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v');
      if (v) return { kind: 'iframe', src: `https://www.youtube.com/embed/${v}` };
      const m = u.pathname.match(/^\/(embed|shorts)\/([\w-]+)/);
      if (m) return { kind: 'iframe', src: `https://www.youtube.com/embed/${m[2]}` };
    }
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id) return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}` };
    }
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u.pathname)) return { kind: 'file', src: url };
  } catch {
    /* URL inválida: cai no link simples */
  }
  return { kind: 'link', src: url };
}

export function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
