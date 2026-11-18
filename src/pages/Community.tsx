import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, PenSquare, Search, X } from 'lucide-react';
import { memberById, type Post } from '../data/community';
import { demoUser } from '../data/user';
import { useApp } from '../store/AppStore';
import { TopBar, Chip, SmartImage, Avatar, EmptyState, BellButton } from '../components/ui';
import { products } from '../data/products';

const typeMeta: Record<Post['type'], { label: string; classes: string }> = {
  ergebnis: { label: 'Ergebnis', classes: 'bg-royal-600' },
  frage: { label: 'Frage', classes: 'bg-amber-500' },
  tipp: { label: 'Tipp', classes: 'bg-emerald-500' },
};

export function PostCard({ post }: { post: Post }) {
  const author = post.authorId === 'm-lena' ? { ...memberById(post.authorId), name: demoUser.name } : memberById(post.authorId);
  const { likedPosts, savedPosts, toggleLike, toggleSave, comments } = useApp();
  const liked = likedPosts.includes(post.id);
  const saved = savedPosts.includes(post.id);
  const myComments = comments[post.id] ?? [];
  const meta = typeMeta[post.type];

  return (
    <article className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
      {/* Kopf */}
      <Link
        to={`/community/member/${post.authorId}`}
        className="tap flex items-center gap-3 px-4 pt-3.5 pb-3"
      >
        <Avatar name={author.name} gradient={author.gradient} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold text-deep-900">{author.name}</p>
          <p className="truncate text-[11.5px] text-slate-400">
            {author.role} · {post.ago}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${meta.classes}`}
        >
          {meta.label}
        </span>
      </Link>

      {/* Text */}
      <Link to={`/community/post/${post.id}`} className="tap block px-4">
        {post.title && (
          <h3 className="text-[15px] font-bold leading-snug tracking-tight text-deep-950">
            {post.title}
          </h3>
        )}
        <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-slate-600">{post.text}</p>
      </Link>

      {/* Bilder */}
      {post.images.length > 0 && (
        <Link to={`/community/post/${post.id}`} className="tap mt-3 block">
          {post.images.length === 1 ? (
            <SmartImage src={post.images[0]} alt={post.title ?? 'Community-Beitrag'} className="aspect-[4/3] w-full" />
          ) : (
            <>
              <SmartImage src={post.images[0]} alt="" className="aspect-[4/3] w-full" />
              {post.images.length > 1 && (
                <div className="flex items-center gap-1 bg-deep-950/0 px-3.5 py-1.5">
                  <span className="text-[10.5px] font-semibold text-slate-400">
                    + {post.images.length - 1} weitere {post.images.length - 1 === 1 ? 'Bild' : 'Bilder'} in der Detailansicht
                  </span>
                </div>
              )}
            </>
          )}
        </Link>
      )}

      {/* Produkt-Tag */}
      {post.productHandle && (
        <Link
          to={`/shop/p/${post.productHandle}`}
          className="tap mx-4 mt-3 flex items-center gap-2 rounded-xl border border-mist-200 bg-mist-50 px-3 py-2"
        >
          <SmartImage
            src={products.find((p) => p.id === post.productHandle)?.images[0] ?? ''}
            alt=""
            className="h-8 w-8 rounded-lg"
          />
          <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-deep-900">
            {products.find((p) => p.id === post.productHandle)?.shortTitle}
          </span>
          <span className="text-[11px] font-bold text-royal-600">Im Shop →</span>
        </Link>
      )}

      {/* Aktionen */}
      <div className="flex items-center gap-5 px-4 py-3">
        <button
          onClick={() => toggleLike(post.id)}
          aria-label={liked ? 'Like entfernen' : 'Beitrag liken'}
          className="tap flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500"
        >
          <Heart
            className={`h-[19px] w-[19px] transition-all ${
              liked ? 'anim-pop fill-royal-600 text-royal-600' : 'text-slate-400'
            }`}
            aria-hidden
          />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <Link
          to={`/community/post/${post.id}`}
          className="tap flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500"
        >
          <MessageCircle className="h-[19px] w-[19px] text-slate-400" aria-hidden />
          {post.comments.length + myComments.length}
        </Link>
        <button
          onClick={() => toggleSave(post.id)}
          aria-label={saved ? 'Nicht mehr speichern' : 'Beitrag speichern'}
          className="tap ml-auto flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500"
        >
          <Bookmark
            className={`h-[19px] w-[19px] ${saved ? 'fill-deep-900 text-deep-900' : 'text-slate-400'}`}
            aria-hidden
          />
          {saved ? 'Gespeichert' : 'Speichern'}
        </button>
      </div>
    </article>
  );
}

export default function Community() {
  const [filter, setFilter] = useState<'alle' | Post['type'] | 'gespeichert'>('alle');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { allPosts, savedPosts } = useApp();
  const navigate = useNavigate();

  const feed = useMemo(() => {
    let list = allPosts;
    if (filter === 'gespeichert') list = list.filter((p) => savedPosts.includes(p.id));
    else if (filter !== 'alle') list = list.filter((p) => p.type === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        const author = memberById(p.authorId);
        return (
          p.title?.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          author.name.toLowerCase().includes(q) ||
          (p.tag ?? '').toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [allPosts, filter, savedPosts, query]);

  const filters: { id: typeof filter; label: string }[] = [
    { id: 'alle', label: 'Alle' },
    { id: 'ergebnis', label: 'Ergebnisse' },
    { id: 'frage', label: 'Fragen' },
    { id: 'tipp', label: 'Tipps' },
    { id: 'gespeichert', label: 'Gespeichert' },
  ];

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-6">
      <TopBar
        title="Community"
        right={
          <>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Beiträge durchsuchen"
              className={`tap flex h-9 w-9 items-center justify-center rounded-full ${searchOpen ? 'bg-deep-900 text-white' : 'text-deep-900 active:bg-mist-100'}`}
            >
              <Search className="h-[19px] w-[19px]" aria-hidden />
            </button>
            <BellButton />
          </>
        }
      />

      {/* Suche */}
      {searchOpen && (
        <div className="sticky top-[54px] z-20 border-b border-mist-200 bg-mist-50/95 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-mist-200 bg-white px-3 shadow-card focus-within:border-royal-400">
            <Search className="h-[16px] w-[16px] shrink-0 text-slate-400" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Beiträge, Autorinnen, Stichworte…"
              aria-label="Community durchsuchen"
              className="w-full bg-transparent text-[13.5px] font-medium text-deep-950 outline-none placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Suche löschen"
                className="tap flex h-6 w-6 items-center justify-center rounded-full bg-mist-100 text-slate-400"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Kopfbereich */}
      <div className="bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 px-4 pb-5 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight text-white">
              Lash & Brow Family 💙
            </h2>
            <p className="mt-0.5 text-[12px] text-royal-100/75">
              4.200+ Profis tauschen sich hier aus
            </p>
          </div>
        </div>
        {/* Beitrag erstellen */}
        <Link
          to="/community/new"
          className="tap mt-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-2.5 backdrop-blur"
        >
          <Avatar name={demoUser.name} gradient={demoUser.gradient} size={36} />
          <span className="flex-1 text-left text-[13px] font-medium text-white/70">
            Teile ein Ergebnis oder stell eine Frage…
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-500 text-white shadow-card">
            <PenSquare className="h-4 w-4" aria-hidden />
          </span>
        </Link>
      </div>

      {/* Filter */}
      <div className="sticky top-[54px] z-20 border-b border-mist-200 bg-mist-50/95 px-4 py-2.5 backdrop-blur-xl">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
              {f.id === 'gespeichert' && savedPosts.length > 0 ? ` · ${savedPosts.length}` : ''}
            </Chip>
          ))}
        </div>
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-7 w-7" aria-hidden />}
          title={filter === 'gespeichert' ? 'Noch nichts gespeichert' : 'Keine Beiträge'}
          text={
            query.trim()
              ? `Nichts gefunden für "${query}" – versuche ein anderes Stichwort.`
              : filter === 'gespeichert'
                ? 'Tippe bei einem Beitrag auf „Speichern“, um ihn hier wiederzufinden.'
                : 'Wechsle den Filter oder erstelle selbst den ersten Beitrag.'
          }
          action={
            <button
              onClick={() => (filter === 'gespeichert' ? setFilter('alle') : navigate('/community/new'))}
              className="tap rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
            >
              {filter === 'gespeichert' ? 'Alle Beiträge ansehen' : 'Beitrag erstellen'}
            </button>
          }
        />
      ) : (
        <div className="space-y-3.5 px-4 pt-3.5">
          {feed.map((p) => (
            <div key={p.id} className="anim-fade-up">
              <PostCard post={p} />
            </div>
          ))}
        </div>
      )}

      {/* Community-Hinweis */}
      <p className="mt-6 px-8 text-center text-[10.5px] leading-relaxed text-slate-400">
        Demo-Feed: Beiträge, Autorinnen & Interaktionen sind Beispieldaten für
        den Prototyp. Bilder: Original-Produktbilder von glamloox.net.
      </p>
    </div>
  );
}
