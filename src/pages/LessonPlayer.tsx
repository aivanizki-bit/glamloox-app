import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Play,
  Pencil,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  FileText,
  ListChecks,
  Maximize2,
  Gauge,
} from 'lucide-react';
import { courses } from '../data/courses';
import { useApp } from '../store/AppStore';
import { SmartImage, ProgressBar, TopBar } from '../components/ui';

const parseDur = (d: string): number => {
  const m = d.match(/^(\d+):(\d{2})$/);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 600;
};
const fmt = (s: number): string =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// (R3) Speed ist jetzt Player-State

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  const { progress, toggleLesson, toast, lessonNotes, setLessonNote } = useApp();

  const flat = useMemo(
    () => (course ? course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id }))) : []),
    [course],
  );
  const lesson = flat.find((l) => l.id === lessonId);
  const idx = flat.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  const total = lesson ? parseDur(lesson.duration) : 600;
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(25);
  const [note, setNote] = useState(lessonNotes[lessonId ?? ''] ?? '');
  const barRef = useRef<HTMLDivElement>(null);
  const done = !!progress[lessonId ?? ''];

  // Demo-Wiedergabe (Zeitraffer)
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setTime((s) => {
        const next = s + speed;
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, total, speed]);

  // Automatisch abschließen
  useEffect(() => {
    if (time >= total && total > 0 && lessonId && !done) {
      toggleLesson(lessonId, true);
      toast('Lektion abgeschlossen ✓', 'check');
    }
  }, [time, total, lessonId, done, toggleLesson, toast]);

  // Space-Taste = Play/Pause (Desktop-Komfort)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
      e.preventDefault();
      setPlaying((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!course || !lesson) {
    return (
      <div>
        <TopBar title="Lektion" back="/academy" />
        <p className="mt-10 text-center text-slate-500">Lektion nicht gefunden.</p>
      </div>
    );
  }

  const seek = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setTime(Math.round(pct * total));
  };

  const moduleTitle = course.modules.find((m) => m.id === lesson.moduleId)?.title ?? '';

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-8">
      <TopBar title={course.shortTitle} back={`/academy/course/${course.id}`} />

      {/* ── PLAYER ── */}
      {lesson.type === 'video' && (
        <div className="relative select-none bg-deep-950">
          <SmartImage
            src={course.lessonPoster}
            alt={lesson.title}
            className="aspect-video w-full"
            imgClass={playing || time > 0 ? 'opacity-70' : 'opacity-100'}
          />
          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-950/80 via-transparent to-deep-950/30" />

          {/* Play-Overlay */}
          {!playing && (
            <button
              onClick={() => (time >= total ? (setTime(0), setPlaying(true)) : setPlaying(true))}
              aria-label={time > 0 && time < total ? 'Weiter abspielen' : 'Abspielen'}
              className="tap absolute inset-0 m-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/15 shadow-float ring-1 ring-white/40 backdrop-blur-md"
            >
              {time > 0 && time < total ? (
                <Play className="ml-1 h-9 w-9 fill-white text-white" aria-hidden />
              ) : (
                <Play className="ml-1 h-9 w-9 fill-white text-white" aria-hidden />
              )}
            </button>
          )}

          {/* Demo-Zeitraffer Badge */}
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-deep-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-royal-200 backdrop-blur">
            <Gauge className="h-3 w-3" aria-hidden /> Demo-Player · {speed}× Zeitraffer
          </span>

          {/* Controls */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5">
            {/* Timeline */}
            <div
              ref={barRef}
              onClick={(e) => seek(e.clientX)}
              className="group relative h-6 cursor-pointer"
              role="slider"
              aria-label="Abspielposition"
              aria-valuenow={Math.round((time / total) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="absolute inset-x-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-white/25">
                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-royal-400 to-royal-300"
                  style={{ width: `${(time / total) * 100}%` }}
                >
                  <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <button
                onClick={() => (time >= total ? setTime(0) : setPlaying((p) => !p))}
                aria-label={playing ? 'Pause' : 'Abspielen'}
                className="tap flex h-9 w-9 items-center justify-center rounded-full active:bg-white/15"
              >
                {playing ? (
                  <Pause className="h-5 w-5 fill-white" aria-hidden />
                ) : (
                  <Play className="h-5 w-5 fill-white" aria-hidden />
                )}
              </button>
              <button
                onClick={() => {
                  setTime(0);
                  setPlaying(false);
                }}
                aria-label="Von vorn"
                className="tap flex h-9 w-9 items-center justify-center rounded-full active:bg-white/15"
              >
                <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
              </button>
              <span className="text-[12px] font-semibold tabular-nums text-white/90">
                {fmt(time)} / {fmt(total)}
              </span>
              <button
                onClick={() => setSpeed((s) => (s === 25 ? 5 : s === 5 ? 1 : 25))}
                aria-label="Wiedergabegeschwindigkeit wechseln"
                className="tap flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold active:bg-white/15"
              >
                <Gauge className="h-4 w-4" aria-hidden /> {speed}×
              </button>
              <span className="ml-auto flex items-center gap-1 text-[10.5px] font-semibold text-white/60">
                <Maximize2 className="h-3.5 w-3.5" aria-hidden /> HD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── PDF ── */}
      {lesson.type === 'pdf' && (
        <div className="bg-deep-950 px-4 py-8">
          <div className="mx-auto flex aspect-[3/4] w-[210px] flex-col items-center justify-center rounded-xl bg-white shadow-float">
            <FileText className="h-10 w-10 text-royal-500" aria-hidden />
            <p className="mt-3 max-w-[150px] text-center text-[12.5px] font-bold leading-snug text-deep-900">
              {lesson.title}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{lesson.duration}</p>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {lesson.type === 'quiz' && <Quiz lessonId={lesson.id} />}

      {/* ── Info ── */}
      <div className="px-4 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-royal-600">{moduleTitle}</p>
        <h1 className="mt-1 text-[19px] font-extrabold leading-snug tracking-tight text-deep-950">
          {lesson.title}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{lesson.desc}</p>

        {/* Abschluss-Toggle */}
        <button
          onClick={() => {
            toggleLesson(lesson.id, !done);
            toast(done ? 'Als offen markiert' : 'Lektion abgeschlossen ✓', 'check');
          }}
          className={`tap mt-4 flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left shadow-card ${
            done ? 'border-royal-200 bg-royal-50' : 'border-mist-200 bg-white'
          }`}
        >
          {done ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-royal-600" aria-hidden />
          ) : (
            <Circle className="h-5 w-5 shrink-0 text-mist-200" strokeWidth={2.5} aria-hidden />
          )}
          <span className="flex-1 text-[13.5px] font-semibold text-deep-900">
            {done ? 'Abgeschlossen – tippe zum Rückgängig machen' : 'Als abgeschlossen markieren'}
          </span>
        </button>

        {/* Fortschritt im Kurs */}
        <Link
          to={`/academy/course/${course.id}`}
          className="tap mt-4 block rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card"
        >
          <div className="flex items-center justify-between text-[12.5px] font-semibold text-deep-900">
            <span>Kursfortschritt</span>
            <span className="text-royal-700">Zum Kurs →</span>
          </div>
          <ProgressBar
            pct={
              (flat.filter((l) => progress[l.id]).length / flat.length) * 100
            }
            className="mt-2.5"
          />
        </Link>

        {/* R23: Meine Notiz */}
        <div className="mt-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
          <p className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
            <Pencil className="h-4 w-4 text-royal-600" aria-hidden /> Meine Notiz zu dieser Lektion
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="Wichtige Einwirkzeiten, Fragen, Ideen…"
            aria-label="Lektionsnotiz"
            className="mt-2 w-full resize-none rounded-xl border border-mist-200 bg-mist-50 p-3 text-[12.5px] leading-relaxed text-deep-950 outline-none placeholder:text-slate-400 focus:border-royal-400"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[10px] text-slate-400">{note.length}/300 · lokal gespeichert</p>
            <button
              onClick={() => {
                setLessonNote(lesson.id, note);
                toast('Notiz gespeichert', 'check');
              }}
              className="tap rounded-full bg-royal-600 px-3.5 py-1.5 text-[11.5px] font-bold text-white shadow-card"
            >
              Speichern
            </button>
          </div>
        </div>

        {/* R24: Modul-Navigation */}
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Module</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {course.modules.map((m, mi) => {
              const doneCt = m.lessons.filter((l) => progress[l.id]).length;
              const firstOpen = m.lessons.find((l) => !progress[l.id]) ?? m.lessons[0];
              const complete = doneCt === m.lessons.length;
              return (
                <Link
                  key={m.id}
                  to={`/academy/course/${course.id}/lesson/${firstOpen.id}`}
                  className={`tap shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-bold ${complete ? 'border-royal-200 bg-royal-50 text-royal-700' : 'border-mist-200 bg-white text-slate-500'}`}
                >
                  M{mi + 1} {complete ? '✓' : `${doneCt}/${m.lessons.length}`}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Prev / Next */}
        <div className="mt-4 flex gap-2.5">
          {prev ? (
            <Link
              to={`/academy/course/${course.id}/lesson/${prev.id}`}
              className="tap flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-mist-200 bg-white text-[12.5px] font-bold text-deep-900 shadow-card"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Vorherige
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              to={`/academy/course/${course.id}/lesson/${next.id}`}
              className="tap flex h-11 flex-[1.6] items-center justify-center gap-1.5 rounded-xl bg-deep-900 text-[12.5px] font-bold text-white shadow-card"
            >
              Nächste Lektion <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <Link
              to={`/academy/course/${course.id}`}
              className="tap flex h-11 flex-[1.6] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-[12.5px] font-bold text-white shadow-card"
            >
              🏆 Kurs abschließen
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Interaktives Demo-Quiz ────────────────────────────
function Quiz({ lessonId }: { lessonId: string }) {
  const { toggleLesson, progress, toast } = useApp();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const questions = [
    {
      q: 'Was zeichnet den Korean Lash Lift gegenüber dem klassischen Lifting aus?',
      a: ['Mehr Schwung und längere Haltbarkeit', 'Er nutzt ausschließlich Wachs', 'Er dauert nur 10 Minuten'],
      correct: 0,
    },
    {
      q: 'Worauf solltest du bei sehr feinen Wimpern besonders achten?',
      a: ['Möglichst große Pads verwenden', 'Sanfte Fixierung, z. B. Ultra-Sticky-Pads', 'Step 2 doppelt so lange einwirken lassen'],
      correct: 1,
    },
    {
      q: 'Was gehört zu einer professionellen Aftercare-Beratung?',
      a: ['48 Stunden nicht waschen & Booster-Empfehlung', 'Direkt wieder Extensions setzen', 'Ölhaltige Produkte direkt danach'],
      correct: 0,
    },
  ];
  const answeredAll = Object.keys(answers).length === questions.length;
  const allCorrect = answeredAll && questions.every((q, i) => answers[i] === q.correct);
  const done = !!progress[lessonId];

  return (
    <div className="bg-white px-4 py-5">
      <div className="flex items-center gap-2 text-royal-600">
        <ListChecks className="h-5 w-5" aria-hidden />
        <p className="text-[13px] font-bold uppercase tracking-wide">Wissenscheck</p>
      </div>
      <div className="mt-4 space-y-4">
        {questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-[13.5px] font-semibold leading-snug text-deep-900">
              {qi + 1}. {q.q}
            </p>
            <div className="mt-2 space-y-1.5">
              {q.a.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const revealed = answers[qi] !== undefined;
                const isCorrect = oi === q.correct;
                return (
                  <button
                    key={oi}
                    disabled={revealed}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`tap w-full rounded-xl border px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors ${
                      revealed && isCorrect
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : selected
                          ? 'border-red-300 bg-red-50 text-red-700'
                          : 'border-mist-200 bg-white text-slate-600'
                    }`}
                  >
                    {opt}
                    {revealed && isCorrect && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {answeredAll && (
        <div
          className={`anim-pop mt-5 rounded-2xl p-4 text-center ${
            allCorrect ? 'bg-emerald-50' : 'bg-amber-50'
          }`}
        >
          <p className="text-[14px] font-bold text-deep-900">
            {allCorrect ? 'Perfekt! Alle Fragen richtig 🎉' : 'Fast! Schau dir die markierten Antworten an.'}
          </p>
          {!allCorrect && (
            <button
              onClick={() => setAnswers({})}
              className="tap mt-3 rounded-full bg-deep-900 px-5 py-2 text-[12.5px] font-bold text-white"
            >
              Nochmal versuchen
            </button>
          )}
          {allCorrect && !done && (
            <button
              onClick={() => {
                toggleLesson(lessonId, true);
                toast('Quiz bestanden – Lektion abgeschlossen ✓', 'star');
              }}
              className="tap mt-3 rounded-full bg-gradient-to-r from-royal-600 to-royal-700 px-5 py-2.5 text-[12.5px] font-bold text-white shadow-card"
            >
              Lektion abschließen
            </button>
          )}
        </div>
      )}
    </div>
  );
}
