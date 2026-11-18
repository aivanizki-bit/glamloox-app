import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Package,
  Heart,
  GraduationCap,
  Award,
  CalendarCheck,
  Gift,
  Settings,
  MapPin,
  Star,
  Bookmark,
} from 'lucide-react';
import { demoUser } from '../data/user';
import { courses } from '../data/courses';
import { useApp } from '../store/AppStore';
import { TopBar, Avatar, ProgressBar, BellButton } from '../components/ui';
import { events } from '../data/events';

export default function Profile() {
  const { orders, favorites, enrolled, certificates, eventRegs, courseProgress, rewardPoints, savedPosts, allPosts, lessonNotes, profile, toast } = useApp();
  const activeCourse = courses.find((c) => c.id === 'korean-powder-2')!;
  const prog = courseProgress(activeCourse.id);
  const nextEvents = events.filter((e) => eventRegs.includes(e.id));

  const items = [
    { to: '/profile/orders', icon: Package, label: 'Meine Bestellungen', value: `${orders.length}` },
    { to: '/profile/favorites', icon: Heart, label: 'Meine Favoriten', value: `${favorites.length}` },
    { to: '/community?filter=gespeichert', icon: Bookmark, label: 'Gespeicherte Beiträge', value: `${savedPosts.length}` },
    { to: '/academy/my', icon: GraduationCap, label: 'Meine Kurse', value: `${enrolled.length}` },
    { to: '/profile/certificates', icon: Award, label: 'Meine Zertifikate', value: `${certificates.length}` },
    { to: '/profile/events', icon: CalendarCheck, label: 'Live-Anmeldungen', value: `${nextEvents.length}` },
    { to: '/profile/rewards', icon: Gift, label: 'Rewards & Vorteile', value: `${rewardPoints} P.` },
    { to: '/profile/settings', icon: Settings, label: 'Einstellungen', value: '' },
  ];

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Profil" right={<BellButton />} />

      {/* Kopfbereich */}
      <div className="bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 px-4 pb-5 pt-3">
        <div className="flex items-center gap-4">
          <Avatar name={demoUser.name} gradient={demoUser.gradient} size={68} ring />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[20px] font-extrabold tracking-tight text-white">
              {profile.name}
            </h2>
            <p className="truncate text-[12.5px] text-royal-100/80">{demoUser.role}</p>
            <p className="mt-1 flex items-center gap-1 text-[11.5px] text-royal-100/60">
              <MapPin className="h-3 w-3" aria-hidden /> {profile.studio} · {demoUser.city}
            </p>
          </div>
        </div>

        {/* Rewards-Karte */}
        <Link
          to="/profile/rewards"
          className="tap mt-4 flex items-center gap-3.5 rounded-2xl border border-gold-400/30 bg-gradient-to-r from-white/12 to-white/5 p-3.5 backdrop-blur"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-card">
            <Star className="h-5 w-5" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-gold-400">
              {demoUser.rewardTier}-Status
            </p>
            <p className="text-[15px] font-extrabold text-white">{rewardPoints} Punkte</p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500"
                style={{ width: `${Math.min(100, (rewardPoints / demoUser.nextTierAt) * 100)}%` }}
              />
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white/50" aria-hidden />
        </Link>
      </div>

      {/* Lernfortschritt */}
      <div className="px-4 pt-4">
        <Link
          to={`/academy/course/${activeCourse.id}`}
          className="tap block rounded-2xl border border-mist-200 bg-white p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-deep-900">Lernfortschritt</p>
            <span className="text-[12px] font-bold text-royal-700">{prog.pct}%</span>
          </div>
          <p className="mt-1 truncate text-[13px] font-semibold text-slate-500">
            {activeCourse.title}
          </p>
          <ProgressBar pct={prog.pct} className="mt-2.5" />
          <p className="mt-1.5 text-[11.5px] text-slate-400">
            {prog.done} von {prog.total} Lektionen · {certificates.length} Zertifikat(e)
          </p>
        </Link>
      </div>

      {/* R36: Statistik-Reihe */}
      <div className="grid grid-cols-4 gap-2 px-4 pt-4">
        {[
          ['Bestellungen', orders.length.toString()],
          ['Beiträge', allPosts.filter((p) => p.authorId === 'm-lena').length.toString()],
          ['Kurse', enrolled.length.toString()],
          ['Favoriten', favorites.length.toString()],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-mist-200 bg-white py-3 text-center shadow-card">
            <p className="text-[19px] font-extrabold text-deep-950">{value}</p>
            <p className="text-[9.5px] font-semibold text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* R41: Abzeichen-Vorschau */}
      <div className="mx-4 mt-3 flex items-center justify-between rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
        <div className="flex -space-x-2">
          {['🏆', '🎓', '💬', '🥇'].map((e) => (
            <span key={e} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-gold-400 to-gold-500 text-[14px] shadow-card">
              {e}
            </span>
          ))}
        </div>
        <Link to="/profile/rewards" className="tap text-[12.5px] font-bold text-royal-700">
          Alle ansehen →
        </Link>
      </div>

      {/* R50: Notizen-Export */}
      <button
        onClick={async () => {
          const notes = Object.entries(lessonNotes);
          const text = notes.map(([k, v]) => '• ' + k + ': ' + v).join('\n') || 'Noch keine Notizen';
          try { await navigator.clipboard.writeText('Meine Academy-Notizen:\n' + text); } catch { /* Demo */ }
          toast('Notizen kopiert (' + notes.length + ')', 'star');
        }}
        className="tap mx-4 mt-3 flex w-[calc(100%-32px)] items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
          ✏️
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[13.5px] font-bold text-deep-900">Academy-Notizen exportieren</span>
          <span className="block text-[11.5px] text-slate-400">{Object.keys(lessonNotes).length} Notizen · kopiert in Zwischenablage</span>
        </span>
      </button>

      {/* R37: Studio-Card */}
      <Link
        to="/community/member/m-lena"
        className="tap mx-4 mt-3 flex items-center gap-3.5 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
          <MapPin className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-bold text-deep-900">{demoUser.studio}</span>
          <span className="block text-[11.5px] text-slate-400">{profile.city} · Di–Sa 9–18 Uhr (Demo)</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
      </Link>

      {/* Menü */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
        {items.map(({ to, icon: Icon, label, value }, i) => (
          <Link
            key={to}
            to={to}
            className={`tap flex items-center gap-3.5 px-4 py-3.5 ${i > 0 ? 'border-t border-mist-100' : ''}`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="flex-1 text-[14.5px] font-semibold text-deep-900">{label}</span>
            {value && <span className="text-[13px] font-bold text-slate-400">{value}</span>}
            <ChevronRight className="h-[18px] w-[18px] text-slate-300" aria-hidden />
          </Link>
        ))}
      </div>

      <p className="mt-5 px-8 text-center text-[10.5px] leading-relaxed text-slate-400">
        Demo-Konto „{demoUser.name}“ · Concept-Prototyp der GLAMLOOX App.
        <br />
        Alle Daten liegen nur lokal in deinem Browser.
      </p>
    </div>
  );
}
