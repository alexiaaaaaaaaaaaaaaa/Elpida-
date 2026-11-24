import { useState } from 'react';
import { Heart, Repeat2, Share2, Bookmark } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Avatar from '../components/Avatar';
import PageTitle from '../components/PageTitle';
import { TIMELINE_POSTS } from '../data/content';
import { useUser } from '../context/UserContext';

interface FeedItem {
  id: string;
  author: string;
  avatar?: string;
  initials: string;
  kind: 'quote' | 'text' | 'image';
  quote?: string;
  text?: string;
  image?: string;
  caption?: string;
}

const TimelinePage: React.FC = () => {
  const { profile, initials, posts, likedIds, savedIds, toggleLike, toggleSave } = useUser();
  const [repeated, setRepeated] = useState<string[]>([]);
  const [notice, setNotice] = useState('');

  const mine: FeedItem[] = posts.map((p) => ({
    id: `u-${p.id}`,
    author: profile.name,
    avatar: profile.avatar,
    initials,
    kind: 'image',
    image: p.imageUrl,
    caption: p.caption,
  }));

  const official: FeedItem[] = TIMELINE_POSTS.map((p) => ({
    id: p.id,
    author: p.author,
    initials: p.author.slice(0, 2).toUpperCase(),
    kind: p.kind,
    quote: p.quote,
    text: p.text,
    caption: p.caption,
  }));

  const feed = [...mine, ...official];

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const share = async (item: FeedItem) => {
    const text = item.quote ?? item.text ?? item.caption ?? 'Elpida Protegida';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Elpida Protegida', text });
      } else {
        await navigator.clipboard.writeText(text);
        flash('Texto copiado');
      }
    } catch {
      // compartilhamento cancelado ou indisponível
    }
  };

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle>Timeline</PageTitle>

      <div className="elpida-feed">
        {feed.map((item) => {
          const liked = likedIds.includes(item.id);
          const saved = savedIds.includes(item.id);
          const rep = repeated.includes(item.id);
          return (
            <article className="elpida-post" key={item.id}>
              <div className="elpida-post__head">
                <Avatar src={item.avatar} initials={item.initials} size={26} />
                <span>{item.author}</span>
              </div>

              {item.kind === 'quote' && <div className="elpida-post__quote">{item.quote}</div>}
              {item.kind === 'text' && <p className="elpida-post__text">{item.text}</p>}
              {item.kind === 'image' && item.image && <img className="elpida-post__image" src={item.image} alt="" />}
              {item.caption && <p className="elpida-post__caption">{item.caption}</p>}

              <div className="elpida-post__actions">
                <button aria-label="Curtir" aria-pressed={liked} className={liked ? 'liked' : ''} onClick={() => toggleLike(item.id)}>
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button
                  aria-label="Repostar"
                  aria-pressed={rep}
                  className={rep ? 'on' : ''}
                  onClick={() => setRepeated((prev) => (prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]))}
                >
                  <Repeat2 size={20} />
                </button>
                <button aria-label="Compartilhar" onClick={() => share(item)}>
                  <Share2 size={20} />
                </button>
                <span style={{ flex: 1 }} />
                <button aria-label="Salvar" aria-pressed={saved} className={saved ? 'on' : ''} onClick={() => toggleSave(item.id)}>
                  <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {notice && <div className="elpida-toast">{notice}</div>}
    </div>
  );
};

export default TimelinePage;
