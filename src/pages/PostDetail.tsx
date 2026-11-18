import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, SendHorizontal, ChevronLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memberById } from '../data/community';
import { demoUser } from '../data/user';
import { useApp } from '../store/AppStore';
import { SmartImage, Avatar } from '../components/ui';
import { products } from '../data/products';

const typeLabel = { ergebnis: 'Ergebnis', frage: 'Frage', tipp: 'Tipp' };

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { allPosts, likedPosts, savedPosts, toggleLike, toggleSave, comments, addComment, toggleCommentLike, isCommentLiked, toast } = useApp();
  const post = allPosts.find((p) => p.id === postId);
  const [draft, setDraft] = useState('');

  if (!post) {
    return (
      <div className="p-6">
        <h1 className="text-[17px] font-bold">Beitrag nicht gefunden.</h1>
      </div>
    );
  }

  const author = post.authorId === 'm-lena' ? { ...memberById(post.authorId), name: demoUser.name } : memberById(post.authorId);
  const liked = likedPosts.includes(post.id);
  const saved = savedPosts.includes(post.id);
  const allComments = [...post.comments, ...(comments[post.id] ?? [])];
  const product = post.productHandle ? products.find((p) => p.id === post.productHandle) : null;

  const submit = () => {
    if (!draft.trim()) return;
    addComment(post.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-[54px] items-center gap-2 border-b border-mist-200 bg-white/85 px-3 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          aria-label="Zurück"
          className="tap flex h-9 w-9 items-center justify-center rounded-full text-deep-900 active:bg-mist-100"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
        <h1 className="flex-1 truncate text-[16px] font-bold tracking-tight text-deep-900">
          Beitrag
        </h1>
        <button
          onClick={async () => {
            try { await navigator.clipboard.writeText(location.href); } catch { /* Demo */ }
            toast('Beitragslink kopiert (Demo)', 'star');
          }}
          aria-label="Beitrag teilen"
          className="tap flex h-9 w-9 items-center justify-center rounded-full text-deep-900 active:bg-mist-100"
        >
          <Share2 className="h-[18px] w-[18px]" aria-hidden />
        </button>
        <span className="rounded-full bg-royal-50 px-2.5 py-1 text-[11px] font-bold text-royal-700">
          {typeLabel[post.type]}
        </span>
      </header>

      {/* Autor */}
      <Link to={`/community/member/${post.authorId}`} className="tap flex items-center gap-3 bg-white px-4 py-3.5">
        <Avatar name={author.name} gradient={author.gradient} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-bold text-deep-900">{author.name}</p>
          <p className="truncate text-[12px] text-slate-400">
            {author.role} · {author.city} · {post.ago}
          </p>
        </div>
        <span className="rounded-full border border-royal-200 px-3 py-1.5 text-[12px] font-bold text-royal-700">
          Profil
        </span>
      </Link>

      {/* Inhalt */}
      <div className="bg-white px-4 pb-4">
        {post.title && (
          <h2 className="text-[17px] font-extrabold leading-snug tracking-tight text-deep-950">
            {post.title}
          </h2>
        )}
        <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{post.text}</p>
      </div>

      {/* Bilder */}
      {post.images.length > 0 && (
        <div className={`grid gap-1 ${post.images.length > 1 ? 'grid-cols-2' : ''}`}>
          {post.images.map((img, i) => (
            <SmartImage key={i} src={img} alt={`Bild ${i + 1}`} className="w-full" imgClass="aspect-square" />
          ))}
        </div>
      )}

      {/* Produkt */}
      {product && (
        <Link
          to={`/shop/p/${product.id}`}
          className="tap mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3 shadow-card"
        >
          <SmartImage src={product.images[0]} alt={product.title} className="h-12 w-12 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
              Erwähntes Produkt
            </p>
            <p className="truncate text-[13.5px] font-bold text-deep-900">{product.shortTitle}</p>
          </div>
          <span className="text-[12px] font-bold text-royal-600">Ansehen →</span>
        </Link>
      )}

      {/* Interaktionen */}
      <div className="mx-4 mt-3 flex items-center gap-4 rounded-2xl border border-mist-200 bg-white px-4 py-3 shadow-card">
        <button
          onClick={() => toggleLike(post.id)}
          className="tap flex items-center gap-2 text-[13px] font-bold text-slate-600"
        >
          <Heart
            className={`h-5 w-5 ${liked ? 'anim-pop fill-royal-600 text-royal-600' : 'text-slate-400'}`}
            aria-hidden
          />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <span className="flex items-center gap-2 text-[13px] font-bold text-slate-600">
          <MessageCircle className="h-5 w-5 text-slate-400" aria-hidden />
          {allComments.length}
        </span>
        <button
          onClick={() => toggleSave(post.id)}
          className="tap ml-auto flex items-center gap-2 text-[13px] font-bold text-slate-600"
        >
          <Bookmark
            className={`h-5 w-5 ${saved ? 'fill-deep-900 text-deep-900' : 'text-slate-400'}`}
            aria-hidden
          />
          {saved ? 'Gespeichert' : 'Speichern'}
        </button>
      </div>

      {/* Kommentare */}
      <div className="mx-4 mt-3 rounded-2xl border border-mist-200 bg-white shadow-card">
        <p className="border-b border-mist-200 px-4 py-3 text-[13px] font-bold text-deep-900">
          Kommentare · {allComments.length}
        </p>
        <div className="divide-y divide-mist-100">
          {allComments.length === 0 && (
            <p className="px-4 py-6 text-center text-[13px] text-slate-400">
              Noch keine Kommentare – schreib als Erste etwas! 💙
            </p>
          )}
          {allComments.map((c) => {
            const ca = memberById(c.authorId);
            const isMe = c.authorId === 'm-lena';
            return (
              <div key={c.id} className="flex gap-3 px-4 py-3">
                <Avatar name={isMe ? demoUser.name : ca.name} gradient={isMe ? demoUser.gradient : ca.gradient} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold text-deep-900">
                    {isMe ? `${demoUser.name} (du)` : ca.name}
                    <span className="ml-2 font-medium text-slate-400">{c.ago}</span>
                  </p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{c.text}</p>
                  <button
                    onClick={() => toggleCommentLike(post.id, c.id)}
                    aria-label={isCommentLiked(post.id, c.id) ? 'Like entfernen' : 'Kommentar liken'}
                    className="tap mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${isCommentLiked(post.id, c.id) ? 'anim-pop fill-royal-600 text-royal-600' : ''}`}
                      aria-hidden
                    />
                    {isCommentLiked(post.id, c.id) ? 'Gefällt mir' : 'Gefällt mir'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Eingabe */}
        <div className="flex items-center gap-2.5 border-t border-mist-200 p-3">
          <Avatar name={demoUser.name} gradient={demoUser.gradient} size={34} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Kommentieren…"
            aria-label="Neuer Kommentar"
            className="h-10 flex-1 rounded-full border border-mist-200 bg-mist-50 px-4 text-[13.5px] font-medium text-deep-950 outline-none focus:border-royal-400"
          />
          <button
            onClick={submit}
            disabled={!draft.trim()}
            aria-label="Kommentar senden"
            className="tap flex h-10 w-10 items-center justify-center rounded-full bg-royal-600 text-white shadow-card disabled:opacity-40"
          >
            <SendHorizontal className="h-[17px] w-[17px]" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
