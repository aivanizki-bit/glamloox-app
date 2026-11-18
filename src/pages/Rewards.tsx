import { useEffect, useState } from 'react';
import { Gift, Sparkles, Percent, Truck, BadgeCheck, ShoppingBag, GraduationCap, PenSquare, Heart } from 'lucide-react';
import { demoUser } from '../data/user';
import { useApp } from '../store/AppStore';
import { TopBar } from '../components/ui';

const perks = [
  { icon: Percent, title: '5% Dauerbonus', desc: 'Auf alle Eigenprodukte von GLAMLOOX®', need: 'Ab 300 P.' },
  { icon: Truck, title: 'Gratis-Versand', desc: 'Frei Versand ab 50 € Bestellwert', need: 'Ab 400 P.' },
  { icon: Sparkles, title: 'Early Access', desc: 'Neuheiten & Sale zuerst shoppen', need: 'Ab 500 P.' },
  { icon: BadgeCheck, title: 'Profi-Badge', desc: 'Verifiziertes Profil in der Community', need: 'Ab 600 P.' },
];

export default function Rewards() {
  const { rewardPoints, orders, enrolled, favorites, userPosts, pointsLog } = useApp();
  const [displayPts, setDisplayPts] = useState(0);

  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const dur = 900;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setDisplayPts(Math.round(rewardPoints * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [rewardPoints]);

  const achievements = [
    { icon: ShoppingBag, title: 'Erste Bestellung', desc: 'Willkommen im Club', unlocked: orders.length >= 1 },
    { icon: GraduationCap, title: 'Academy-Fan', desc: '2+ Kurse eingeschrieben', unlocked: enrolled.length >= 2 },
    { icon: PenSquare, title: 'Community-Stimme', desc: 'Erster eigener Beitrag', unlocked: userPosts.length >= 1 },
    { icon: Heart, title: 'Booster-Profi', desc: '3+ Favoriten gemerkt', unlocked: favorites.length >= 3 },
  ];
  const pct = Math.min(100, (rewardPoints / demoUser.nextTierAt) * 100);

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Rewards & Vorteile" back="/profile" />

      {/* Punkte-Karte */}
      <div className="mx-4 mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 p-5 shadow-float">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-card">
            <Gift className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-400">
              GLAMLOOX Rewards · {demoUser.rewardTier}
            </p>
            <p className="text-[24px] font-extrabold leading-tight text-white">
              {displayPts} <span className="text-[14px] font-semibold text-white/60">Punkte</span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] font-semibold text-white/50">
            <span>{demoUser.rewardTier}</span>
            <span>
              {Math.max(0, demoUser.nextTierAt - rewardPoints)} Punkte bis Platin
            </span>
          </div>
        </div>
        <p className="mt-3.5 rounded-xl bg-white/10 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-white/75">
          💙 Du sammelst automatisch: 1 Punkt pro 1 € Bestellung, +50 Punkte pro
          Bestellung und +25 Punkte pro veröffentlichtem Community-Beitrag (Demo).
        </p>
      </div>

      {/* Vorteile */}
      <h2 className="px-4 pb-2 pt-6 text-[16px] font-bold tracking-tight text-deep-900">
        Deine Vorteile
      </h2>
      <div className="space-y-2.5 px-4">
        {perks.map(({ icon: Icon, title, desc, need }) => {
          const threshold = parseInt(need.replace(/\D/g, ''));
          const unlocked = rewardPoints >= threshold;
          return (
            <div
              key={title}
              className={`flex items-center gap-3.5 rounded-2xl border p-3.5 shadow-card ${
                unlocked ? 'border-royal-100 bg-white' : 'border-mist-200 bg-white/60'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  unlocked ? 'bg-royal-600 text-white' : 'bg-mist-100 text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[13.5px] font-bold ${unlocked ? 'text-deep-900' : 'text-slate-400'}`}>
                  {title}
                </p>
                <p className="text-[11.5px] text-slate-400">{desc}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${
                  unlocked ? 'bg-emerald-50 text-emerald-700' : 'bg-mist-100 text-slate-400'
                }`}
              >
                {unlocked ? 'Aktiv ✓' : need}
              </span>
            </div>
          );
        })}
      </div>

      {/* R40: Punkteverlauf */}
      <h2 className="px-4 pb-2 pt-6 text-[16px] font-bold tracking-tight text-deep-900">Punkteverlauf</h2>
      <div className="divide-y divide-mist-100 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
        {pointsLog.slice(0, 6).map((l) => (
          <div key={l.id} className="flex items-center justify-between px-4 py-3">
            <p className="min-w-0 truncate pr-3 text-[12.5px] font-semibold text-deep-900">{l.title}</p>
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-bold text-emerald-700">
              +{l.delta} P.
            </span>
          </div>
        ))}
      </div>

      {/* Erfolge */}
      <h2 className="px-4 pb-2 pt-6 text-[16px] font-bold tracking-tight text-deep-900">Deine Erfolge</h2>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {achievements.map(({ icon: Icon, title, desc, unlocked }) => (
          <div
            key={title}
            className={`rounded-2xl border p-3.5 shadow-card ${unlocked ? 'border-royal-100 bg-white' : 'border-mist-200 bg-white/50'}`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${unlocked ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-white' : 'bg-mist-100 text-slate-300'}`}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <p className={`mt-2 text-[12.5px] font-bold leading-tight ${unlocked ? 'text-deep-900' : 'text-slate-400'}`}>
              {title}
            </p>
            <p className="text-[10.5px] text-slate-400">{desc}</p>
            <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-wide ${unlocked ? 'text-emerald-600' : 'text-slate-300'}`}>
              {unlocked ? 'Freigeschaltet ✓' : 'Gesperrt'}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 px-8 text-center text-[10.5px] leading-relaxed text-slate-400">
        Demo-Rewards-System zur Veranschaulichung – Punkte & Vorteile sind
        Beispieldaten und werden lokal im Browser gespeichert.
      </p>
    </div>
  );
}
