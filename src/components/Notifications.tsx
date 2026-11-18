import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Package,
  GraduationCap,
  CalendarDays,
  Heart,
  Info,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../store/AppStore';

const kindIcon = {
  order: Package,
  course: GraduationCap,
  event: CalendarDays,
  community: Heart,
  system: Info,
};
const kindColor = {
  order: 'bg-royal-50 text-royal-600',
  course: 'bg-emerald-50 text-emerald-600',
  event: 'bg-red-50 text-red-500',
  community: 'bg-pink-50 text-pink-500',
  system: 'bg-mist-100 text-slate-500',
};

/** Unteres Sheet mit Demo-Mitteilungen – wird auf PhoneShell-Ebene gerendert. */
export function NotificationsSheet() {
  const { notifOpen, closeNotifs, notifications, markAllNotifsRead } = useApp();
  const navigate = useNavigate();

  if (!notifOpen) return null;

  const open = (link?: string) => {
    closeNotifs();
    if (link) navigate(link);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      <div
        className="anim-fade-in absolute inset-0 bg-deep-950/45 backdrop-blur-sm"
        onClick={closeNotifs}
        aria-hidden
      />
      <div className="anim-sheet relative mt-auto flex max-h-[78%] flex-col rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-float">
        {/* Kopf */}
        <div className="flex items-center gap-3 border-b border-mist-200 px-5 pb-3.5 pt-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-royal-50 text-royal-600">
            <Bell className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="text-[16px] font-extrabold tracking-tight text-deep-950">Mitteilungen</h2>
            <p className="text-[11px] text-slate-400">Demo-Benachrichtigungen</p>
          </div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllNotifsRead}
              className="tap flex h-8 items-center gap-1.5 rounded-full bg-royal-50 px-3 text-[11.5px] font-bold text-royal-700"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden /> Gelesen
            </button>
          )}
          <button
            onClick={closeNotifs}
            aria-label="Schließen"
            className="tap flex h-9 w-9 items-center justify-center rounded-full text-slate-400 active:bg-mist-100"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Liste */}
        <div className="app-scroll flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-6 py-12 text-center text-[13.5px] text-slate-400">
              Keine Mitteilungen – alles ruhig hier. 💙
            </p>
          ) : (
            notifications.map((n) => {
              const Icon = kindIcon[n.kind];
              return (
                <button
                  key={n.id}
                  onClick={() => open(n.link)}
                  className={`tap flex w-full items-start gap-3.5 border-b border-mist-100 px-5 py-3.5 text-left last:border-0 ${
                    n.read ? '' : 'bg-royal-50/50'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${kindColor[n.kind]}`}
                  >
                    <Icon className="h-[17px] w-[17px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-bold text-deep-900">{n.title}</span>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-royal-600" aria-hidden />}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-slate-500">{n.body}</span>
                    <span className="mt-1 block text-[10.5px] font-medium text-slate-400">{n.ago}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/** Glocken-Button mit Unread-Badge (für TopBars). */
export function BellButton() {
  const { openNotifs, unreadNotifs } = useApp();
  return (
    <button
      onClick={openNotifs}
      aria-label={`Mitteilungen${unreadNotifs > 0 ? ` (${unreadNotifs} neu)` : ''}`}
      className="tap relative flex h-9 w-9 items-center justify-center rounded-full text-deep-900 active:bg-mist-100"
    >
      <Bell className="h-[20px] w-[20px]" aria-hidden />
      {unreadNotifs > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-royal-600 px-1 text-[9.5px] font-bold text-white">
          {unreadNotifs}
        </span>
      )}
    </button>
  );
}
