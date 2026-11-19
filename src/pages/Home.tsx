import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Bell,
  X,
  Timer,
  Truck,
  RotateCcw,
  Globe,
  ArrowUp,
  Mail,
  TrendingUp,
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
import { events, formatDateShort, isPastEvent } from '../data/events';
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
  const { courseProgress, enrolled, pushHintDismissed, dismissPushHint, toast, rewardPoints, recentlyViewed, openSearch, promotions } = useApp();
  const [mail, setMail] = useState('');
  const [showTop, setShowTop] = useState(false);
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

  // R1: nächstes Event + Countdown
  const futureEvents = events.filter((e) => !isPastEvent(e.dateISO));
  const upcoming = (futureEvents.length > 0 ? futureEvents : [...events].sort((a, b) => b.dateISO.localeCompare(a.dateISO)))[0];
  useEffect(() => {
    const el = document.querySelector('main');
    const onScroll = () => setShowTop((el?.scrollTop ?? 0) > 600);
    el?.addEventListener('scroll', onScroll, { passive: true });
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);
  const daysLeft = Math.max(0, Math.round((new Date(upcoming.dateISO + 'T00:00').getTime() - new Date(new Date().toISOString().slice(0, 10) + 'T00:00').getTime()) / 86400000));
  // R2: Trending-Posts (Top 3 nach Likes)
  const trending = [...seedPosts].sort((a, b) => b.likes - a.likes).slice(0, 3);

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
          <button
            onClick={openSearch}
            aria-label="Alles durchsuchen"
            className="tap mr-1 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-mist-100 px-3.5 text-slate-400"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium">Produkte suchen…</span>
          </button>
          <CartButton />
        </div>
      </header>

      {/* ── Aktions-Banner (aus der Admin-Konsole) ── */}
      {(() => {
        const today = new Date().toISOString().slice(0, 10);
        const promo = promotions
          .filter((p) => p.active && p.startDate <= today && p.endDate >= today && p.type !== 'bundle')
          .sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
        if (!promo) return null;
        const endMs = new Date(promo.endDate + 'T23:59').getTime() - Date.now();
        const days = Math.max(0, Math.floor(endMs / 86400000));
        const hours = Math.max(0, Math.floor((endMs % 86400000) / 3600000));
        return (
          <Link
            to="/shop"
            className="tap relative block overflow-hidden bg-gradient-to-r from-deep-950 via-deep-900 to-royal-800"
          >
            <div
              className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
              style={{ background: 'radial-gradient(circle, #7A96F8, transparent 70%)' }}
              aria-hidden
            />
            <div className="relative flex items-center gap-3.5 px-4 py-3">
              <span className="text-[24px]">{promo.emoji || '✨'}</span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[13.5px] font-leading-snug font-extrabold leading-snug text-white">
                  {promo.bannerText.replace('X', String(promo.value))}
                </p>
                <p className="text-[10.5px] text-royal-100/70">
                  {days === 0 ? 'Nur noch heute!' : days === 1 ? 'Nur noch 1 Tag!' : 'Noch ' + days + ' Tage ' + hours + ' Std · bis ' + new Date(promo.endDate + 'T12:00').toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}
                  {promo.type === 'code' && promo.code ? ' · Code: ' + promo.code : ''}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-extrabold text-deep-900 shadow-card">
                Jetzt sparen
              </span>
            </div>
          </Link>
        );
      })()}

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
        <div className="mt-4 flex flex-wrap gap-2">
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

      {/* R8: Push-Demo-Hinweis */}
      {!pushHintDismissed && (
        <div className="anim-fade-up mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-royal-100 bg-white p-3.5 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-600 text-white">
            <Bell className="h-[17px] w-[17px]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-deep-900">Verpasse keine Live-Events</p>
            <p className="text-[11.5px] text-slate-400">Demo: Erinnerungen aktivieren</p>
          </div>
          <button
            onClick={() => {
              dismissPushHint();
              toast('Demo-Erinnerungen aktiviert 💙', 'star');
            }}
            className="tap shrink-0 rounded-full bg-royal-600 px-3.5 py-2 text-[12px] font-bold text-white shadow-card"
          >
            Aktivieren
          </button>
          <button
            onClick={dismissPushHint}
            aria-label="Hinweis ausblenden"
            className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 active:bg-mist-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {/* R1: Event-Countdown */}
      <Link
        to={`/academy/event/${upcoming.id}`}
        className="tap mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-3.5 shadow-card"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white">
          <Timer className="h-[17px] w-[17px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-bold text-deep-900">Nur noch {daysLeft} Tage</p>
          <p className="truncate text-[11.5px] text-slate-500">{upcoming.title}</p>
        </div>
        <span className="shrink-0 rounded-full border border-deep-900/25 bg-white px-3 py-1.5 text-[11px] font-bold text-deep-900">Ansehen</span>
      </Link>

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

      {/* R57: Lernstreak + R61: Zuletzt angesehen */}
      <section className="pt-6">
        <div className="grid grid-cols-2 gap-3 px-4">
          <Link to="/academy/my" className="tap flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-[18px]">🔥</span>
            <span className="min-w-0">
              <span className="block text-[15px] font-extrabold leading-none text-deep-950">4 Tage</span>
              <span className="block truncate text-[10.5px] font-semibold text-slate-400">Lernstreak · Demo</span>
            </span>
          </Link>
          <Link to="/profile/rewards" className="tap flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 text-[18px]">⭐</span>
            <span className="min-w-0">
              <span className="block text-[15px] font-extrabold leading-none text-deep-950">{rewardPoints}</span>
              <span className="block truncate text-[10.5px] font-semibold text-slate-400">Reward-Punkte</span>
            </span>
          </Link>
        </div>
        {recentlyViewed.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between px-4 pb-2">
              <h2 className="text-[14px] font-bold text-deep-900">Zuletzt angesehen</h2>
              <Link to="/shop" className="text-[12px] font-semibold text-royal-600">Shop →</Link>
            </div>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
              {recentlyViewed.slice(0, 6).map((id) => {
                const p = products.find((x) => x.id === id);
                return p ? <ProductCardMini key={id} product={p} /> : null;
              })}
            </div>
          </div>
        )}
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

      {/* R5: Kurs der Woche */}
      <section className="pt-7">
        <SectionHeader title="Kurs der Woche" sub="Empfehlung der Academy" to="/academy" />
        <div className="px-4">
          <Link
            to="/academy/course/reanimation"
            className="tap flex gap-3.5 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card"
          >
            <SmartImage
              src={courses[1].image}
              alt={courses[1].title}
              className="h-[72px] w-[108px] shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <span className="flex w-fit items-center gap-1 rounded-full bg-gold-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-500">
                ⭐ Empfehlung
              </span>
              <p className="mt-1 line-clamp-1 text-[14px] font-bold text-deep-900">{courses[1].title}</p>
              <p className="line-clamp-1 text-[11.5px] text-slate-400">{courses[1].hours} Std. · {courses[1].level}</p>
              <p className="mt-0.5 text-[13.5px] font-extrabold text-deep-950">{eur(courses[1].price)}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* R2: Trending in der Community */}
      <section className="pt-7">
        <SectionHeader title="Trending 🔥" sub="Die meist gelikten Beiträge" to="/community" />
        <div className="px-4">
          <div className="divide-y divide-mist-100 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
            {trending.map((post, i) => {
              const a = memberById(post.authorId);
              return (
                <Link key={post.id} to={`/community/post/${post.id}`} className="tap flex items-center gap-3 p-3.5">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${i === 0 ? 'bg-gold-400 text-white' : 'bg-mist-200 text-slate-500'}`}>
                    {i + 1}
                  </span>
                  <Avatar name={a.name} gradient={a.gradient} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-deep-900">{post.title ?? post.text}</p>
                    <p className="truncate text-[11px] text-slate-400">{a.name}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[12px] font-bold text-royal-600">
                    <TrendingUp className="h-3.5 w-3.5" aria-hidden /> {post.likes}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* R3: Trust-Section */}
      <section className="pt-7">
        <div className="grid grid-cols-3 gap-2 px-4">
          {[
            { icon: Truck, t: 'Gratis-Versand', s: 'ab 100 € in DE' },
            { icon: RotateCcw, t: '14 Tage', s: 'Rückgaberecht' },
            { icon: Globe, t: '11 Länder', s: 'DE · AT · CH & mehr' },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex flex-col items-center rounded-2xl border border-mist-200 bg-white px-2 py-4 text-center shadow-card">
              <Icon className="h-5 w-5 text-royal-600" aria-hidden />
              <p className="mt-1.5 text-[12px] font-bold leading-tight text-deep-900">{t}</p>
              <p className="text-[10px] text-slate-400">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* О бренде */}
      <section className="pt-7">
        <div className="mx-4 text-center">
          <p className="text-[22px] font-extrabold tracking-tight text-deep-950">
            GLAM<span className="text-royal-600">LOOX</span>
            <span className="ml-0.5 align-super text-[9px] font-bold text-royal-500">®</span>
          </p>
          <p className="mt-1 text-[12.5px] font-semibold text-slate-500">Natürlich. Sicher. Einfach du.</p>
          <p className="mx-auto mt-2 max-w-[300px] text-[12px] leading-relaxed text-slate-400">
            Профессиональный уход за ресницами и бровями без гормонов —
            разработано для студий и ценителей. С любовью из Германии 💙
          </p>
        </div>
      </section>

      {/* R60: Warum GLAMLOOX */}
      <section className="pt-7">
        <div className="mx-4 rounded-3xl border border-royal-100 bg-white p-4 shadow-card">
          <p className="text-[15px] font-extrabold tracking-tight text-deep-950">Warum GLAMLOOX?</p>
          {[
            ['💙', 'Hormonfreie Formeln', 'auch für Schwangere geeignet'],
            ['🌱', 'Vegan & tierversuchsfrei', 'ohne Kompromisse bei der Wirkung'],
            ['👩‍🏫', 'Academy & Community', 'Wissen von Profis, für Profis'],
          ].map(([e, t, s]) => (
            <div key={t} className="mt-3 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-[16px]">{e}</span>
              <span>
                <span className="block text-[13px] font-bold text-deep-900">{t}</span>
                <span className="block text-[11.5px] text-slate-400">{s}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* R6: Newsletter-Card */}
      <section className="pt-7">
        <div className="mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 p-5 shadow-float">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.2em] text-royal-300">
            <Mail className="h-4 w-4" aria-hidden /> Newsletter
          </p>
          <h3 className="mt-2 text-[18px] font-extrabold leading-snug tracking-tight text-white">
            Beauty-Hacks & Trends<br />als Erste:r erfahren
          </h3>
          <div className="mt-3.5 flex gap-2">
            <input
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              type="email"
              placeholder="deine@email.de"
              aria-label="Newsletter-E-Mail"
              className="h-11 min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-3.5 text-[13px] font-medium text-white outline-none backdrop-blur placeholder:text-white/40 focus:border-royal-300"
            />
            <button
              onClick={() => {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
                  toast('Demo: Anmeldung erfasst 💙', 'star');
                  setMail('');
                } else {
                  toast('Bitte gültige E-Mail eingeben', 'info');
                }
              }}
              className="tap h-11 shrink-0 rounded-xl bg-royal-500 px-4 text-[13px] font-bold text-white shadow-card"
            >
              Los
            </button>
          </div>
          <p className="mt-2.5 text-[10px] text-white/50">Demo-Formular · keine echte Anmeldung</p>
        </div>
      </section>

      {/* ── Brand-Streifen ─────────────────────── */}
      {/* R7: Scroll-to-Top */}
      {showTop && (
        <button
          onClick={() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Nach oben"
          className="anim-pop fixed bottom-[86px] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-deep-900 text-white shadow-float"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </button>
      )}

      <section className="mt-8 bg-white px-4 py-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Partner-Brands im Shop
        </p>
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {['BRONSUN', 'ÉLAN', 'InLei', 'MAXYMOVA', 'Noemi', 'OkO', 'ZOLA', 'A.DAN'].map((b) => {
            const count = products.filter((p) => p.vendor.toLowerCase() === b.toLowerCase()).length;
            return (
              <Link
                key={b}
                to={`/shop?brand=${encodeURIComponent(b)}`}
                className="tap shrink-0 rounded-full border border-mist-200 bg-mist-50 px-3.5 py-2 text-[12.5px] font-bold tracking-wide text-slate-500 active:bg-royal-50 active:text-royal-700"
              >
                {b} <span className="font-semibold text-slate-300">· {count}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center gap-4">
          {[
            ['Impressum', 'https://glamloox.net/policies/legal-notice'],
            ['Datenschutz', 'https://glamloox.net/policies/privacy-policy'],
            ['AGB', 'https://glamloox.net/policies/terms-of-service'],
          ].map(([l, href]) => (
            <a key={l} href={href} target="_blank" rel="noreferrer" className="text-[10.5px] font-semibold text-slate-300 underline">
              {l}
            </a>
          ))}
        </div>
        <p className="mt-3 text-center text-[10.5px] leading-relaxed text-slate-300">
          Interactive Concept Demo · Produkte & Preise von glamloox.net ·
          Community-Beiträge & Termine sind Beispieldaten
        </p>
      </section>
    </div>
  );
}
