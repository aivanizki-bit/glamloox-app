import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  GraduationCap,
  Radio,
  ArrowRight,
  Flame,
  ShieldCheck,
  Leaf,
  Heart,
} from 'lucide-react';
import { products } from '../data/products';
import { courses } from '../data/courses';
import { events, formatDateShort } from '../data/events';
import { memberById, posts as seedPosts } from '../data/community';
import { demoUser } from '../data/user';
import { useApp, eur } from '../store/AppStore';
import {
  SectionHeader,
  ProductCardMini,
  SmartImage,
  Avatar,
  CartButton,
  ProgressBar,
  BellButton,
} from '../components/ui';

const bestsellers = ['lash-booster', 'brow-booster', 'booster-set', 'peptide-mascara', 'elan-try-me', 'pads-fusion'];
const forYou = ['oko-undereye-pads', 'pads-teddy', 'noemi-dual-timer', 'oko-balm-glue', 'zola-jelly-glue'];
const catTiles = [
  { id: 'lash-lifting', label: 'Lash Lifting', img: products.find((p) => p.id === 'elan-try-me')!.images[0] },
  { id: 'brow', label: 'Brow & Farbe', img: products.find((p) => p.id === 'zola-brauenfarbe-03')!.images[0] },
  { id: 'pflege', label: 'Pflege', img: products.find((p) => p.id === 'lash-booster')!.images[0] },
  { id: 'zubehoer', label: 'Zubehör', img: products.find((p) => p.id === 'beauty-organizer')!.images[0] },
];

const heroSlides = [
  { kind: 'product' as const, id: 'lash-booster', badge: 'Bestseller', title: 'LASH BOOSTER Serum', sub: 'Wimpernserum ohne Hormone · 4 ml' },
  { kind: 'course' as const, id: 'korean-powder-2', badge: 'Academy', title: 'Korean Lash Lift', sub: 'Premium-Kurs mit Live-Coaching' },
  { kind: 'product' as const, id: 'beauty-organizer', badge: 'Neu im Shop', title: 'Beauty Organizer', sub: 'Dein mobiler Arbeitsplatz' },
];

export default function Home() {
  const { courseProgress, enrolled } = useApp();
  const slideRef = useRef<HTMLDivElement>(null);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;
    const t = setInterval(() => {
      const step = (el.querySelector('a')?.clientWidth ?? el.clientWidth) + 12;
      const next = (Math.round(el.scrollLeft / step) + 1) % heroSlides.length;
      el.scrollTo({ left: next * step, behavior: 'smooth' });
    }, 5200);
    return () => clearInterval(t);
  }, []);
  const heroCourse = courses[0];
  const heroPost = seedPosts[0];
  const heroPostAuthor = memberById(heroPost.authorId);
  const inProgress = courses.find((c) => c.id === 'korean-powder-2')!;

  return (
    <div className="anim-fade-in pb-6">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-[54px] items-center justify-between border-b border-mist-200 bg-white/85 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-royal-500 to-deep-900 text-[15px] font-extrabold text-white shadow-card">
            G
          </div>
          <div className="leading-none">
            <span className="text-[17px] font-extrabold tracking-tight text-deep-950">
              GLAM<span className="text-royal-600">LOOX</span>
            </span>
            <span className="ml-1 align-super text-[8px] font-bold tracking-widest text-royal-500">®</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <BellButton />
          <Link
            to="/shop"
            aria-label="Suche"
            className="tap mr-1 flex h-9 items-center gap-2 rounded-full bg-mist-100 px-3.5 text-slate-400"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="text-[13px] font-medium">Produkte suchen…</span>
          </Link>
          <CartButton />
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className="anim-fade-up relative overflow-hidden bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 px-4 pb-6 pt-6">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-2xl"
          style={{ background: 'radial-gradient(circle, #7A96F8, transparent 70%)' }}
          aria-hidden
        />
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-royal-300">
          Hi {demoUser.name.split(' ')[0]} 👋
        </p>
        <h2
          className="mt-2 max-w-[270px] text-[27px] font-extrabold leading-[1.12] tracking-tight text-white"
          style={{ textShadow: '0 2px 24px rgba(46,91,240,0.35)' }}
        >
          Natürlich. Sicher.
          <br />
          Einfach du.
        </h2>
        <p className="mt-2.5 max-w-[290px] text-[13.5px] leading-relaxed text-royal-100/80">
          Pflegt sanft, wirkt sichtbar – hormonfreie Lash- & Brow-Pflege und
          Profi-Material für dein Studio.
        </p>

        {/* USP-Zeile */}
        <div className="mt-4 flex gap-2">
          {[
            { icon: ShieldCheck, label: 'Ohne Hormone' },
            { icon: Leaf, label: 'Vegan' },
            { icon: Sparkles, label: 'Tierversuchsfrei' },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11.5px] font-semibold text-white/90 backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5 text-royal-300" aria-hidden />
              {label}
            </span>
          ))}
        </div>

        {/* Hero-Slider */}
        <div
          ref={slideRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            const step = (el.querySelector('a')?.clientWidth ?? el.clientWidth) + 12;
            setSlideIdx(Math.min(heroSlides.length - 1, Math.round(el.scrollLeft / step)));
          }}
          className="no-scrollbar mt-5 flex snap-x snap-mandatory overflow-x-auto"
        >
          {heroSlides.map((s) => {
            const p = s.kind === 'product' ? products.find((x) => x.id === s.id) : null;
            const c = s.kind === 'course' ? courses.find((x) => x.id === s.id) : null;
            const img = s.kind === 'product' ? p!.images[0] : c!.image;
            const to = s.kind === 'product' ? `/shop/p/${s.id}` : `/academy/course/${s.id}`;
            const priceLine = s.kind === 'product' ? eur(p!.price) : `ab ${eur(c!.price)} · Kurs`;
            return (
              <Link
                key={s.kind + s.id}
                to={to}
                className="tap relative flex w-full shrink-0 snap-center items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-md"
              >
                <SmartImage
                  src={img}
                  alt={s.title}
                  eager
                  className="h-[84px] w-[84px] shrink-0 rounded-2xl bg-white shadow-float ring-1 ring-white/50"
                />
                <div className="min-w-0 flex-1">
                  <span className="flex w-fit items-center gap-1 rounded-full bg-royal-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-royal-100">
                    <Flame className="h-3 w-3" aria-hidden /> {s.badge}
                  </span>
                  <p className="mt-1 truncate text-[15px] font-bold text-white">{s.title}</p>
                  <p className="truncate text-[12px] text-royal-100/70">{s.sub}</p>
                  <p className="mt-0.5 text-[15px] font-extrabold text-white">{priceLine}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-white/60" aria-hidden />
              </Link>
            );
          })}
        </div>
        {/* Slider-Punkte */}
        <div className="mt-3 flex justify-center gap-1.5">
          {heroSlides.map((_, i) => (
            <button
              key={'dot' + i}
              onClick={() => {
                const el = slideRef.current;
                if (!el) return;
                const step = (el.querySelector('a')?.clientWidth ?? el.clientWidth) + 12;
                el.scrollTo({ left: i * step, behavior: 'smooth' });
              }}
              aria-label={`Slide ${i + 1} von ${heroSlides.length}`}
              className={`tap h-1.5 rounded-full transition-all ${i === slideIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Kategorien ─────────────────────────── */}
      <section className="pt-6">
        <SectionHeader title="Kategorien" sub="Finde genau, was dein Studio braucht" to="/shop" />
        <div className="grid grid-cols-2 gap-3 px-4">
          {catTiles.map((c) => (
            <Link
              key={c.id}
              to={`/shop?cat=${c.id}`}
              className="tap relative overflow-hidden rounded-2xl shadow-card"
            >
              <SmartImage src={c.img} alt={c.label} eager className="aspect-[16/10] w-full bg-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-950/90 via-deep-950/35 to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-[14.5px] font-bold text-white" style={{ textShadow: '0 1px 8px rgba(6,18,56,0.55)' }}>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Bestseller ─────────────────────────── */}
      <section className="pt-7">
        <SectionHeader title="Bestseller" sub="Die Lieblinge der Community" to="/shop" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {bestsellers.map((id) => {
            const p = products.find((x) => x.id === id)!;
            return <ProductCardMini key={id} product={p} />;
          })}
        </div>
      </section>

      {/* ── Academy-Empfehlung ─────────────────── */}
      <section className="pt-7">
        <SectionHeader title="GLAMLOOX Academy" sub="Werde Wimpernprofi" to="/academy" />
        <div className="px-4">
          <Link
            to={`/academy/course/${heroCourse.id}`}
            className="tap relative block overflow-hidden rounded-3xl shadow-card"
          >
            <SmartImage
              src={heroCourse.image}
              alt={heroCourse.title}
              className="aspect-[16/9] w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-950/90 via-deep-950/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="flex w-fit items-center gap-1 rounded-full bg-royal-600 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden /> Premium-Kurs
              </span>
              <p className="mt-2 text-[17.5px] font-extrabold leading-snug tracking-tight text-white">
                {heroCourse.title}
              </p>
              <p className="mt-1 text-[12.5px] text-white/75">
                {heroCourse.format} · {heroCourse.hours} Std. · ab {eur(heroCourse.price)}
              </p>
            </div>
          </Link>
        </div>

        {/* Lernfortschritt (personalisiert) */}
        {enrolled.includes(inProgress.id) && (
          <Link
            to={`/academy/course/${inProgress.id}`}
            className="tap mx-4 mt-3 block rounded-2xl border border-royal-100 bg-white p-3.5 shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-deep-900">📍 Dein Lernfortschritt</p>
              <span className="text-[12px] font-semibold text-royal-600">Weiterlernen</span>
            </div>
            <p className="mt-1 truncate text-[12.5px] text-slate-500">{inProgress.shortTitle}</p>
            <ProgressBar pct={courseProgress(inProgress.id).pct} className="mt-2.5" />
            <p className="mt-1.5 text-[11.5px] font-medium text-slate-400">
              {courseProgress(inProgress.id).done} von {courseProgress(inProgress.id).total} Lektionen
              abgeschlossen
            </p>
          </Link>
        )}
      </section>

      {/* ── Live-Trainings ─────────────────────── */}
      <section className="pt-7">
        <SectionHeader title="Live dabei" sub="Kommende Trainings & Webinare" to="/academy" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {events.map((e) => (
            <Link
              key={e.id}
              to={`/academy/event/${e.id}`}
              className="tap flex w-[230px] shrink-0 flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
            >
              <div className="relative">
                <SmartImage src={e.image} alt={e.title} className="aspect-[16/9] w-full" />
                <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  <span className="anim-live h-1.5 w-1.5 rounded-full bg-white" aria-hidden /> Live
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="flex items-center gap-1 text-[11.5px] font-bold text-royal-600">
                  <Radio className="h-3.5 w-3.5" aria-hidden />
                  {formatDateShort(e.dateISO)} · {e.online ? 'Online' : 'Vor Ort'}
                </p>
                <p className="mt-1 line-clamp-2 text-[13.5px] font-bold leading-snug text-deep-900">
                  {e.title}
                </p>
                <p className="mt-auto pt-2 text-[13px] font-bold text-deep-950">
                  {e.price === 0 ? 'Kostenlos' : eur(e.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Community-Highlight ────────────────── */}
      <section className="pt-7">
        <SectionHeader title="Aus der Community" sub="Vorher · Nachher & Tipps" to="/community" />
        <div className="px-4">
          <Link
            to={`/community/post/${heroPost.id}`}
            className="tap block overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
          >
            <div className="relative">
              <SmartImage src={heroPost.images[0]} alt={heroPost.title ?? ''} className="aspect-[16/9] w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-950/60 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-deep-900 backdrop-blur">
                {heroPost.tag}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3.5">
              <Avatar name={heroPostAuthor.name} gradient={heroPostAuthor.gradient} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-deep-900">{heroPost.title}</p>
                <p className="text-[12px] text-slate-500">
                  {heroPostAuthor.name} · {heroPost.likes} <Heart className="inline h-3 w-3" aria-hidden /> ·{' '}
                  {heroPost.ago}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            </div>
          </Link>
        </div>
      </section>

      {/* ── Für dich ───────────────────────────── */}
      <section className="pt-7">
        <SectionHeader title="Für dich empfohlen" sub="Basierend auf deinen Favoriten" to="/shop" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {forYou.map((id) => {
            const p = products.find((x) => x.id === id)!;
            return <ProductCardMini key={id} product={p} />;
          })}
        </div>
      </section>

      {/* ── Brand-Streifen ─────────────────────── */}
      <section className="mt-8 bg-white px-4 py-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Partner-Brands im Shop
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {['BRONSUN', 'ÉLAN', 'InLei', 'MAXYMOVA', 'Noemi', 'OkO', 'ZOLA', 'A.DAN'].map((b) => (
            <span key={b} className="text-[13px] font-bold tracking-wide text-slate-400">
              {b}
            </span>
          ))}
        </div>
        <p className="mt-5 text-center text-[10.5px] leading-relaxed text-slate-300">
          Interactive Concept Demo · Produkte & Preise von glamloox.net ·
          Community-Beiträge & Termine sind Beispieldaten
        </p>
      </section>
    </div>
  );
}
