import { Link } from 'react-router-dom';
import { CalendarCheck, MapPin, ArrowRight, CalendarPlus } from 'lucide-react';
import { events, formatDate } from '../data/events';
import { useApp } from '../store/AppStore';
import { TopBar, SmartImage, EmptyState } from '../components/ui';

export default function MyEvents() {
  const { eventRegs } = useApp();
  const myEvents = events
    .filter((e) => eventRegs.includes(e.id))
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Meine Anmeldungen" back="/profile" />

      {myEvents.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="h-7 w-7" aria-hidden />}
          title="Keine Anmeldungen"
          text="Melde dich für ein Live-Webinar oder eine Masterclass an – deine Termine stehen dann hier."
          action={
            <Link
              to="/academy"
              className="tap inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
            >
              Live-Termine ansehen
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 px-4 pt-3">
          {myEvents.map((e) => (
            <Link
              key={e.id}
              to={`/academy/event/${e.id}`}
              className="tap block overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
            >
              <div className="relative">
                <SmartImage src={e.image} alt={e.title} className="aspect-[16/7] w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-950/70 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  ✓ Angemeldet
                </span>
                <p className="absolute bottom-2.5 left-3 right-3 text-[15px] font-extrabold leading-tight text-white">
                  {e.title}
                </p>
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-deep-900">
                    {formatDate(e.dateISO)}
                  </p>
                  <p className="flex items-center gap-1 text-[11.5px] text-slate-400">
                    <MapPin className="h-3 w-3" aria-hidden /> {e.location}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-royal-50 px-3 py-1.5 text-[11.5px] font-bold text-royal-700">
                  Details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}

          <Link
            to="/academy"
            className="tap flex items-center justify-between rounded-2xl border border-dashed border-royal-300 bg-royal-50/50 p-4"
          >
            <span className="flex items-center gap-2 text-[13.5px] font-bold text-royal-700">
              <CalendarPlus className="h-4 w-4" aria-hidden /> Weitere Termine entdecken
            </span>
            <ArrowRight className="h-4 w-4 text-royal-600" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
