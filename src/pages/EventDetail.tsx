import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  CalendarDays,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  Info,
  Radio,
  ChevronRight,
  Bell,
  BellOff,
} from 'lucide-react';
import { events, formatDate } from '../data/events';
import { members } from '../data/community';
import { useApp, eur } from '../store/AppStore';
import { TopBar, SmartImage, Avatar } from '../components/ui';

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === eventId);
  const { eventRegs, registerEvent, unregisterEvent, toast, reminders, toggleReminder } = useApp();
  const [signing, setSigning] = useState(false);
  const [justSigned, setJustSigned] = useState(false);

  if (!event) {
    return (
      <div>
        <TopBar title="Event" back="/academy" />
        <p className="mt-10 text-center text-slate-500">Event nicht gefunden.</p>
      </div>
    );
  }

  const registered = eventRegs.includes(event.id) || justSigned;
  const reminderSet = reminders.includes(event.id);

  const signUp = () => {
    setSigning(true);
    setTimeout(() => {
      registerEvent(event.id);
      setJustSigned(true);
      setSigning(false);
      toast('Anmeldung bestätigt – wir freuen uns auf dich!', 'star');
    }, 900);
  };

  return (
    <div className="anim-fade-in min-h-full bg-mist-50">
      {/* Hero */}
      <div className="relative">
        <SmartImage src={event.image} alt={event.title} className="aspect-[16/9] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-950/85 via-deep-950/20 to-deep-950/10" />
        <button
          onClick={() => navigate('/academy')}
          aria-label="Zurück"
          className="tap absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur"
        >
          <ChevronLeft className="h-5 w-5 text-deep-900" aria-hidden />
        </button>
        <span className="absolute left-3 top-14 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          <span className="anim-live h-1.5 w-1.5 rounded-full bg-white" aria-hidden /> Live-Format
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h1 className="text-[20px] font-extrabold leading-tight tracking-tight text-white">
            {event.title}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-white/80">{event.subtitle}</p>
        </div>
      </div>

      <div className="px-4 pb-6 pt-4">
        {/* Fakten */}
        <div className="space-y-2.5 rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
          <p className="flex items-center gap-3 text-[13.5px] text-slate-600">
            <CalendarDays className="h-[18px] w-[18px] shrink-0 text-royal-600" aria-hidden />
            <span>
              <span className="font-bold text-deep-900">{formatDate(event.dateISO)}</span> · {event.time}
            </span>
          </p>
          <p className="flex items-center gap-3 text-[13.5px] text-slate-600">
            {event.online ? (
              <Video className="h-[18px] w-[18px] shrink-0 text-royal-600" aria-hidden />
            ) : (
              <MapPin className="h-[18px] w-[18px] shrink-0 text-royal-600" aria-hidden />
            )}
            {event.location}
          </p>
          <p className="flex items-center gap-3 text-[13.5px] text-slate-600">
            <Users className="h-[18px] w-[18px] shrink-0 text-royal-600" aria-hidden />
            {event.seats}
          </p>
          <p className="flex items-center gap-3 text-[13.5px] text-slate-600">
            <Radio className="h-[18px] w-[18px] shrink-0 text-royal-600" aria-hidden />
            {event.host}
          </p>
        </div>

        {/* R25: Teilnehmer-Avatare */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
          <div className="flex -space-x-2.5">
            {members.slice(0, 4).map((m) => (
              <Avatar key={m.id} name={m.name} gradient={m.gradient} size={34} ring />
            ))}
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-mist-100 text-[10.5px] font-bold text-slate-500 ring-2 ring-white">
              +8
            </span>
          </div>
          <p className="text-[12px] leading-snug text-slate-500">
            <span className="font-bold text-deep-900">8 Kolleginnen</span> nehmen auch teil – tausch dich aus!
          </p>
        </div>

        {/* Beschreibung */}
        <p className="mt-4 text-[13.5px] leading-relaxed text-slate-600">{event.description}</p>

        {/* Agenda */}
        <h2 className="mt-5 text-[16px] font-bold tracking-tight text-deep-900">Ablauf</h2>
        <div className="mt-2.5 rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
          {event.agenda.map((a, i) => (
            <div key={i} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span className="flex h-7 w-12 shrink-0 items-center justify-center rounded-lg bg-royal-50 text-[11px] font-bold text-royal-700">
                  {a.time}
                </span>
                {i < event.agenda.length - 1 && (
                  <span className="my-1 w-px flex-1 bg-mist-200" aria-hidden />
                )}
              </div>
              <p className={`pb-4 text-[13px] leading-snug ${i < event.agenda.length - 1 ? 'pt-1' : ''} text-slate-600`}>
                {a.point}
              </p>
            </div>
          ))}
        </div>

        {/* Status / Anmeldung */}
        {registered ? (
          <div className="anim-pop mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500" aria-hidden />
            <p className="mt-2 text-[15px] font-bold text-deep-900">Du bist angemeldet! 🎉</p>
            <p className="mx-auto mt-1 max-w-[280px] text-[12px] leading-relaxed text-slate-500">
              Deine Teilnahmebestätigung und der Zugangslink würden per E-Mail
              kommen. Das Event erscheint auch unter „Profil → Meine Anmeldungen“.
            </p>
            <div className="mt-3 flex justify-center gap-2.5">
              <Link
                to="/profile/events"
                className="tap rounded-full bg-deep-900 px-4 py-2 text-[12.5px] font-bold text-white"
              >
                Zu meinen Anmeldungen
              </Link>
              <button
                onClick={() => {
                  unregisterEvent(event.id);
                  setJustSigned(false);
                  toast('Anmeldung zurückgezogen', 'info');
                }}
                className="tap rounded-full border border-mist-200 bg-white px-4 py-2 text-[12.5px] font-semibold text-slate-500"
              >
                Abmelden
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={signUp}
            disabled={signing}
            className="tap mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float disabled:opacity-70"
          >
            {signing ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Anmeldung läuft…
              </>
            ) : (
              <>Anmelden {event.price > 0 ? `· ${eur(event.price)}` : '· Kostenlos'}</>
            )}
          </button>
        )}

        {/* R26: Community-Cross-Link */}
        <Link
          to="/community"
          className="tap mt-3 flex items-center justify-between rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal-50 text-royal-600">
              <Users className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span>
              <span className="block text-[13px] font-bold text-deep-900">Im Community-Feed fragen</span>
              <span className="block text-[11px] text-slate-400">Wer nimmt sonst teil? Frag in der Runde</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
        </Link>

        {/* Erinnerung */}
        <button
          onClick={() => {
            toggleReminder(event.id);
            toast(reminderSet ? 'Erinnerung deaktiviert' : 'Erinnerung aktiviert – wir melden uns! 💌', 'info');
          }}
          className={`tap mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-[13px] font-bold shadow-card ${reminderSet ? 'border-royal-200 bg-royal-50 text-royal-700' : 'border-mist-200 bg-white text-slate-600'}`}
        >
          {reminderSet ? <Bell className="h-4 w-4" aria-hidden /> : <BellOff className="h-4 w-4" aria-hidden />}
          {reminderSet ? 'Erinnerung ist aktiv' : 'Erinnerung für dieses Event'}
        </button>

        {/* Demo-Hinweis */}
        <p className="mt-4 flex gap-2 rounded-2xl bg-white p-3.5 text-[10.5px] leading-relaxed text-slate-400 shadow-card">
          <Info className="h-3.5 w-3.5 shrink-0 text-royal-400" aria-hidden />
          {event.realBasis} Diese Anmeldung ist simuliert.
        </p>
      </div>
    </div>
  );
}
