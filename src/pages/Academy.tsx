import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GraduationCap, Radio, PlayCircle, Clock, Users, ArrowRight, Award, CalendarDays } from 'lucide-react';
import { courses, type Course } from '../data/courses';
import { events, formatDate, formatDateShort, isPastEvent } from '../data/events';
import { useApp, eur } from '../store/AppStore';
import { TopBar, SmartImage, SectionHeader, ProgressBar, Chip } from '../components/ui';

export default function Academy() {
  const { enrolled, courseProgress, favoriteCourses, toggleCourseFav } = useApp();
  const [level, setLevel] = useState<'alle' | 'Einsteiger' | 'Fortgeschritten' | 'Profi'>('alle');
  const [q, setQ] = useState('');
  const shownCourses = courses
    .filter((c) => (c as Course & { published?: boolean }).published !== false)
    .filter((c) => level === 'alle' || c.level === level)
    .filter((c) => {
      const query = q.trim().toLowerCase();
      return !query || c.title.toLowerCase().includes(query) || c.shortTitle.toLowerCase().includes(query) || c.subtitle.toLowerCase().includes(query);
    });
  const continueCourse = courses.find((c) => c.id === 'korean-powder-2')!;

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-6">
      <TopBar
        title="Academy"
        right={
          <Link
            to="/academy/my"
            className="tap flex h-9 items-center gap-1.5 rounded-full bg-royal-50 px-3 text-[12.5px] font-bold text-royal-700"
          >
            <GraduationCap className="h-4 w-4" aria-hidden /> Meine Kurse
          </Link>
        }
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 px-4 pb-5 pt-5">
        <div
          className="pointer-events-none absolute -left-10 -top-14 h-44 w-44 rounded-full opacity-25 blur-2xl"
          style={{ background: 'radial-gradient(circle, #7A96F8, transparent 70%)' }}
          aria-hidden
        />
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-royal-300">
          <GraduationCap className="h-4 w-4" aria-hidden /> GLAMLOOX Academy
        </p>
        <h2 className="mt-2 text-[24px] font-extrabold leading-tight tracking-tight text-white">
          Werde Wimpernprofi –<br />in deinem Tempo.
        </h2>
        <p className="mt-2 max-w-[300px] text-[13px] leading-relaxed text-royal-100/75">
          Videokurse, Live-Webinare und Masterclasses für Lash & Brow – mit
          Zertifikat.
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            to="#kurse"
            className="tap rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-deep-900 shadow-card"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('kurse')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Kurse entdecken
          </Link>
          <Link
            to="#live"
            className="tap rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12.5px] font-bold text-white backdrop-blur"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('live')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Live-Termine
          </Link>
        </div>
      </div>

      {/* Weiterlernen */}
      {enrolled.includes(continueCourse.id) && (
        <section className="px-4 pt-5">
          <div className="rounded-2xl border border-royal-100 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold uppercase tracking-wide text-royal-600">
                ▶︎ Weiterlernen
              </p>
              <span className="text-[12px] font-bold text-deep-900">
                {courseProgress(continueCourse.id).pct}%
              </span>
            </div>
            <Link to={`/academy/course/${continueCourse.id}`} className="tap mt-2.5 flex gap-3">
              <SmartImage
                src={continueCourse.image}
                alt={continueCourse.title}
                className="h-16 w-24 shrink-0 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[14px] font-bold leading-snug text-deep-900">
                  {continueCourse.title}
                </p>
                <p className="mt-1 text-[11.5px] text-slate-400">
                  {courseProgress(continueCourse.id).done} von{' '}
                  {courseProgress(continueCourse.id).total} Lektionen
                </p>
                <ProgressBar pct={courseProgress(continueCourse.id).pct} className="mt-1.5" />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* R17: Lernstreak */}
      <section className="px-4 pt-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-card">
            🔥
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-bold text-deep-900">Lernstreak: 4 Tage</p>
            <p className="text-[11.5px] text-slate-400">Jeden Tag 10 Minuten – du bist auf Kurs! (Demo-Streak)</p>
          </div>
          <span className="shrink-0 rounded-full bg-royal-50 px-3 py-1.5 text-[11.5px] font-bold text-royal-700">
            {enrolled.length} Kurse
          </span>
        </div>
      </section>

      {/* Kurse */}
      <section id="kurse" className="scroll-mt-20 pt-6">
        <SectionHeader title="Videokurse" sub="Zertifizierte Online-Ausbildungen" />
        <div className="mb-3 px-4">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-mist-200 bg-white px-3 shadow-card focus-within:border-royal-400">
            <Search className="h-[16px] w-[16px] shrink-0 text-slate-400" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Kurse suchen…"
              aria-label="Kurse suchen"
              className="w-full bg-transparent text-[13.5px] font-medium text-deep-950 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="no-scrollbar -mx-0 mb-3 flex gap-2 overflow-x-auto px-4">
          {(['alle', 'Einsteiger', 'Fortgeschritten', 'Profi'] as const).map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
              {l === 'alle' ? 'Alle Levels' : l}
            </Chip>
          ))}
        </div>
        <div className="space-y-3 px-4">
          {shownCourses.map((c) => (
            <Link
              key={c.id}
              to={`/academy/course/${c.id}`}
              className="tap block overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
            >
              <div className="relative">
                <SmartImage src={c.image} alt={c.title} className="aspect-[16/8] w-full" />
                {enrolled.includes(c.id) && (
                  <span className="absolute left-3 top-3 rounded-full bg-royal-600 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white">
                    Einschreibung aktiv
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCourseFav(c.id);
                  }}
                  aria-label={`${c.title} merken`}
                  className="tap absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur"
                >
                  <Heart
                    className={`h-[18px] w-[18px] ${favoriteCourses.includes(c.id) ? 'anim-pop fill-royal-600 text-royal-600' : 'text-slate-400'}`}
                    aria-hidden
                  />
                </button>
                <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-deep-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                  <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                  {c.hours} Std.
                </span>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-royal-600">
                  <span className="rounded-full bg-royal-50 px-2 py-0.5">{c.level}</span>
                  <span className="text-slate-400">{c.format}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">🎓 inkl. Zertifikat</span>
                  <span className="text-slate-400">{c.modules.reduce((n, m) => n + m.lessons.length, 0)} Lektionen</span>
                </div>
                <p className="mt-1.5 text-[16px] font-bold leading-snug tracking-tight text-deep-950">
                  {c.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
                  {c.description}
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11.5px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden /> {c.hours} Std.
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" aria-hidden />
                      {c.students.toLocaleString('de-DE')}
                    </span>
                  </div>
                  <span className="text-[15.5px] font-extrabold text-deep-950">{eur(c.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Live-Events */}
      <section id="live" className="scroll-mt-20 pt-7">
        <SectionHeader title="Live & vor Ort" sub="Webinare, Masterclasses, Meet-ups" />
        <div className="space-y-3 px-4">
          {[...events].filter((e) => !isPastEvent(e.dateISO)).sort((a, b) => a.dateISO.localeCompare(b.dateISO)).map((e) => (
            <Link
              key={e.id}
              to={`/academy/event/${e.id}`}
              className="tap flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3 shadow-card"
            >
              {/* Datums-Badge */}
              <div className="flex h-[58px] w-[52px] shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-royal-600 to-deep-900 text-white">
                <span className="text-[9.5px] font-bold uppercase tracking-wide opacity-80">
                  {new Date(e.dateISO + 'T12:00').toLocaleDateString('de-DE', { month: 'short' })}
                </span>
                <span className="text-[19px] font-extrabold leading-none">
                  {e.dateISO.slice(-2)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-royal-600">
                  <Radio className="h-3.5 w-3.5" aria-hidden />
                  {e.online ? 'Online' : 'Vor Ort'} · {formatDateShort(e.dateISO)}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[14px] font-bold text-deep-900">{e.title}</p>
                <p className="line-clamp-1 text-[11.5px] text-slate-400">{formatDate(e.dateISO)} · {e.time}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

        {/* R56: Archiv */}
        {[...events].filter((e) => isPastEvent(e.dateISO)).length > 0 && (
          <div className="px-4 pt-4">
            <p className="pb-2 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">Archiv</p>
            {[...events].filter((e) => isPastEvent(e.dateISO)).map((e) => (
              <Link
                key={e.id}
                to={'/academy/event/' + e.id}
                className="tap mb-2.5 flex items-center gap-3 rounded-2xl border border-mist-200 bg-white/60 p-3 opacity-80"
              >
                <div className="flex h-[58px] w-[52px] shrink-0 flex-col items-center justify-center rounded-xl bg-mist-200 text-slate-500">
                  <span className="text-[9.5px] font-bold uppercase tracking-wide opacity-80">
                    {new Date(e.dateISO + 'T12:00').toLocaleDateString('de-DE', { month: 'short' })}
                  </span>
                  <span className="text-[19px] font-extrabold leading-none">{e.dateISO.slice(-2)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[14px] font-bold text-slate-600">{e.title}</p>
                  <p className="text-[11.5px] text-slate-400">Archiv · Recap-Fotos folgen</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
              </Link>
            ))}
          </div>
        )}

      {/* Zertifikats-Teaser */}
      <section className="px-4 pt-7">
        <Link
          to="/profile/certificates"
          className="tap flex items-center gap-3.5 rounded-2xl border border-gold-400/40 bg-gradient-to-r from-amber-50 to-white p-4 shadow-card"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-white">
            <Award className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-deep-900">Deine Zertifikate</p>
            <p className="text-[12px] text-slate-500">Abschlüsse & Nachweise an einem Ort</p>
          </div>
          <CalendarDays className="h-4 w-4 text-slate-300" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
