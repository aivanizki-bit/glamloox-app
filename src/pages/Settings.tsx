import {
  Bell,
  Mail,
  Globe,
  RotateCcw,
  Info,
  ShieldCheck,
  ChevronRight,
  Sun,
  FileText,
  Languages,
  Database,
} from 'lucide-react';
import { useApp } from '../store/AppStore';
import { TopBar } from '../components/ui';
import { MessageSquareHeart } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, resetDemo, allPosts, likedPosts, savedPosts, openFeedback, profile, updateProfile } = useApp();

  const Toggle = ({
    on,
    onChange,
    label,
    desc,
    icon: Icon,
  }: {
    on: boolean;
    onChange: (v: boolean) => void;
    label: string;
    desc: string;
    icon: typeof Bell;
  }) => (
    <button
      onClick={() => onChange(!on)}
      className="tap flex w-full items-center gap-3.5 border-t border-mist-100 px-4 py-3.5 text-left first:border-0"
      aria-pressed={on}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block text-[14px] font-semibold text-deep-900">{label}</span>
        <span className="block text-[11.5px] text-slate-400">{desc}</span>
      </span>
      <span
        className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors ${
          on ? 'bg-royal-600' : 'bg-mist-200'
        }`}
      >
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? 'left-[23px]' : 'left-[3px]'
          }`}
        />
      </span>
    </button>
  );

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Einstellungen" back="/profile" />

      <div className="space-y-4 px-4 pt-4">
        {/* Benachrichtigungen */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <p className="border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Benachrichtigungen
          </p>
          <Toggle
            on={settings.pushEvents}
            onChange={(v) => updateSettings({ pushEvents: v })}
            label="Live-Event-Erinnerungen"
            desc="Push vor Webinaren & Masterclasses"
            icon={Bell}
          />
          <Toggle
            on={settings.newsletter}
            onChange={(v) => updateSettings({ newsletter: v })}
            label="Newsletter"
            desc="Beauty-Hacks, Trends & Rabatte"
            icon={Mail}
          />
        </div>

        {/* Erscheinungsbild */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
              <Sun className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-deep-900">Erscheinungsbild</span>
              <span className="block text-[11.5px] text-slate-400">Hell · passend zum Brand-Design</span>
            </span>
            <span className="rounded-full bg-mist-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-500">Demo</span>
          </div>
        </div>

        {/* R48: Profil bearbeiten */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <p className="border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Profil (Demo)
          </p>
          {(
            [
              ['name', 'Name', profile.name],
              ['studio', 'Studio', profile.studio],
              ['city', 'Stadt', profile.city],
            ] as const
          ).map(([field, label, value]) => (
            <label key={field} className="flex items-center gap-3 border-b border-mist-100 px-4 py-3 last:border-0">
              <span className="w-14 shrink-0 text-[12px] font-semibold text-slate-400">{label}</span>
              <input
                defaultValue={value}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== value) updateProfile({ [field]: v });
                }}
                aria-label={`Demo-${label} ändern`}
                className="w-full bg-transparent text-[13.5px] font-semibold text-deep-950 outline-none"
              />
            </label>
          ))}
          <p className="px-4 pb-3 pt-1 text-[10px] text-slate-400">Änderungen werden lokal gespeichert (Demo-Konto).</p>
        </div>

        {/* R49: Changelog */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <p className="border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Neuerungen im Prototyp
          </p>
          <div className="space-y-2 px-4 py-3.5">
            {[
              ['2.0', 'Globale Suche, Undo, Quiz-Feedback, ICS-Kalender, Profil-Editor & 100+ Verbesserungen'], ['1.9', 'Event-Countdown, Lernstreak, Notizen, globale Suche, Konfetti & mehr'],
              ['1.1', 'Hero-Slider, Rabattcodes, Achievements, Adresswahl'],
              ['1.0', 'Erste Version: Shop, Academy, Community, Profil'],
            ].map(([v, d]) => (
              <div key={v} className="flex gap-2.5">
                <span className="shrink-0 rounded-full bg-royal-50 px-2 py-0.5 text-[10px] font-bold text-royal-700">v{v}</span>
                <p className="text-[11.5px] leading-relaxed text-slate-500">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* R44: Sprache + Demo-Statistik */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
              <Languages className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-deep-900">Sprache</span>
              <span className="block text-[11.5px] text-slate-400">Deutsch (weitere folgen)</span>
            </span>
            <span className="rounded-full bg-mist-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-500">DE</span>
          </div>
          <div className="flex items-center gap-3.5 border-t border-mist-100 px-4 py-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
              <Database className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-deep-900">Lokale Demo-Daten</span>
              <span className="block text-[11.5px] text-slate-400">
                {allPosts.length} Beiträge · {likedPosts.length} Likes · {savedPosts.length} gespeichert
              </span>
            </span>
          </div>
        </div>

        {/* Demo-Daten */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <p className="border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Demo-Daten
          </p>
          <button
            onClick={() => {
              if (confirm('Alle Demo-Daten zurücksetzen? Warenkorb, Favoriten, Fortschritte & Beiträge werden auf den Auslieferungszustand zurückgesetzt.')) {
                resetDemo();
              }
            }}
            className="tap flex w-full items-center gap-3.5 border-t border-mist-100 px-4 py-3.5 text-left first:border-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-deep-900">Demo zurücksetzen</span>
              <span className="block text-[11.5px] text-slate-400">
                Lokalen Browser-Speicher zurücksetzen
              </span>
            </span>
          </button>
        </div>

        {/* R45: Demo-Feedback */}
        <button
          onClick={openFeedback}
          className="tap flex w-full items-center gap-3.5 rounded-2xl border border-mist-200 bg-white px-4 py-3.5 shadow-card"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
            <MessageSquareHeart className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold text-deep-900">Demo-Feedback geben</span>
            <span className="block text-[11.5px] text-slate-400">Was gefällt dir? Was soll rein?</span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
        </button>

        {/* Über den Prototyp */}
        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <p className="border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Über diese Demo
          </p>
          <div className="px-4 py-4">
            <p className="flex items-center gap-2 text-[14px] font-bold text-deep-900">
              <Info className="h-4 w-4 text-royal-600" aria-hidden /> GLAMLOOX App – Concept Demo
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">
              Dies ist ein interaktiver High-Fidelity-Prototyp. Produktnamen,
              Preise und Bilder stammen von glamloox.net; Community-Beiträge,
              Termine, Bestellungen & Fortschritte sind Demo-Daten. Es finden
              keine echten Bestellungen oder Zahlungen statt.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Version 2.0', 'React + Vite', 'Lokaler Demo-Speicher'].map((t) => (
                <span key={t} className="rounded-full bg-mist-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-500">
                  {t}
                </span>
              ))}
            </div>
          </div>
          {[
            { icon: Globe, label: 'glamloox.net öffnen', href: 'https://glamloox.net' },
            { icon: ShieldCheck, label: 'Datenschutz (Website)', href: 'https://glamloox.net/policies/privacy-policy' },
            { icon: FileText, label: 'AGB (Website)', href: 'https://glamloox.net/policies/terms-of-service' },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="tap flex items-center gap-3.5 border-t border-mist-100 px-4 py-3.5"
            >
              <Icon className="h-[18px] w-[18px] text-slate-400" aria-hidden />
              <span className="flex-1 text-[13.5px] font-semibold text-deep-900">{label}</span>
              <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
            </a>
          ))}
        </div>

        <p className="pb-2 text-center text-[10.5px] text-slate-400">
          Konzept-Prototyp · keine Verbindung zum GLAMLOOX-Shop-System
        </p>
      </div>
    </div>
  );
}
