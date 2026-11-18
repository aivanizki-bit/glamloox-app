import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WifiOff, MessageSquareHeart, SendHorizontal, X, Home as HomeIcon } from 'lucide-react';
import { useApp } from '../store/AppStore';

/** R41: Splash-Screen beim ersten Load einer Session. */
export function Splash() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('glx-splash'));
  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem('glx-splash', '1');
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, [show]);
  if (!show) return null;
  return (
    <div className="anim-fade-in absolute inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800">
      <div className="splash-logo flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-royal-400 to-royal-600 text-[34px] font-extrabold text-white shadow-float">
        G
      </div>
      <p className="mt-4 text-[20px] font-extrabold tracking-tight text-white">
        GLAM<span className="text-royal-300">LOOX</span>
      </p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-royal-200/70">
        Beauty · Academy · Community
      </p>
    </div>
  );
}

/** R42: Offline-Hinweis. */
export function OfflineBanner() {
  const { offline } = useApp();
  if (!offline) return null;
  return (
    <div className="anim-fade-in relative z-50 flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-[12px] font-bold text-deep-950">
      <WifiOff className="h-4 w-4" aria-hidden /> Kein Internet – Demo funktioniert weiter
    </div>
  );
}

/** R43: 404-Seite. */
export function NotFound() {
  return (
    <div className="anim-fade-up flex min-h-full flex-col items-center justify-center bg-mist-50 px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-royal-50 text-royal-500">
        <HomeIcon className="h-9 w-9" aria-hidden />
      </div>
      <h1 className="mt-5 text-[22px] font-extrabold tracking-tight text-deep-950">
        Seite nicht gefunden
      </h1>
      <p className="mt-1.5 max-w-[280px] text-[13.5px] leading-relaxed text-slate-500">
        Diese Ansicht gibt es im Prototyp nicht – zurück zur Startseite geht's schnell.
      </p>
      <Link
        to="/"
        className="tap mt-6 rounded-full bg-deep-900 px-7 py-3 text-[14px] font-bold text-white shadow-card"
      >
        Zur Startseite
      </Link>
    </div>
  );
}

/** R45: Demo-Feedback-Sheet. */
export function FeedbackSheet() {
  const { feedbackOpen, closeFeedback, toast } = useApp();
  const [kind, setKind] = useState<'like' | 'idee' | 'bug'>('like');
  const [text, setText] = useState('');
  if (!feedbackOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      <div className="anim-fade-in absolute inset-0 bg-deep-950/45 backdrop-blur-sm" onClick={closeFeedback} aria-hidden />
      <div className="anim-sheet relative mt-auto rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-float">
        <div className="flex items-center gap-3 border-b border-mist-200 px-5 pb-3.5 pt-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-royal-50 text-royal-600">
            <MessageSquareHeart className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="text-[16px] font-extrabold tracking-tight text-deep-950">Demo-Feedback</h2>
            <p className="text-[11px] text-slate-400">Wie gefällt dir der Prototyp?</p>
          </div>
          <button
            onClick={closeFeedback}
            aria-label="Feedback schließen"
            className="tap flex h-9 w-9 items-center justify-center rounded-full text-slate-400 active:bg-mist-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="flex gap-2">
            {(
              [
                ['like', '💙 Gefällt mir'],
                ['idee', '💡 Idee'],
                ['bug', '🐞 Fehler'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setKind(id)}
                className={`tap flex-1 rounded-xl border px-2 py-2.5 text-[12.5px] font-bold ${
                  kind === id ? 'border-royal-600 bg-royal-50 text-royal-700' : 'border-mist-200 bg-white text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Was soll ich ausprobieren? Was fehlt?"
            aria-label="Feedback-Text"
            className="mt-3 w-full resize-none rounded-xl border border-mist-200 bg-mist-50 p-3.5 text-[13px] leading-relaxed text-deep-950 outline-none placeholder:text-slate-400 focus:border-royal-400"
          />
          <button
            onClick={() => {
              closeFeedback();
              toast('Danke! Demo-Feedback „gesendet“ 💙', 'heart');
              setText('');
            }}
            className="tap mt-3 flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[14.5px] font-bold text-white shadow-float"
          >
            <SendHorizontal className="h-[18px] w-[18px]" aria-hidden /> Feedback senden (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
