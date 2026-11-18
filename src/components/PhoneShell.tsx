import { useEffect, useState, type ReactNode } from 'react';
import { Toasts } from './ui';
import { NotificationsSheet } from './Notifications';

/**
 * Desktop-Präsentation: zentriertes „iPhone“ mit hochwertigem Hintergrund.
 * Auf Smartphones füllt die App den ganzen Bildschirm.
 */
export function PhoneShell({ children }: { children: ReactNode }) {
  const isStandalone = useIsMobileScreen();

  useEffect(() => {
    document.documentElement.classList.add('glamloox');
  }, []);

  if (isStandalone) {
    return (
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-deep-950">
        {children}
        <Toasts />
        <NotificationsSheet />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-deep-950 p-6">
      {/* Präsentationshintergrund */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1100px 700px at 20% -10%, rgba(46,91,240,0.28), transparent 60%),' +
            'radial-gradient(900px 600px at 85% 110%, rgba(122,150,248,0.20), transparent 55%),' +
            'linear-gradient(160deg, #061238 0%, #0A1E5A 55%, #14267A 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
        aria-hidden
      />

      {/* Titel links vom Gerät */}
      <div className="relative z-10 mr-14 hidden max-w-sm flex-col xl:flex">
        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-royal-200 backdrop-blur">
          Interactive Concept Demo
        </p>
        <h1
          className="text-[44px] font-extrabold leading-[1.02] tracking-tight text-white"
          style={{ textShadow: '0 2px 30px rgba(46,91,240,0.45)' }}
        >
          GLAM<span className="text-royal-300">LOOX</span>
          <span className="mt-2 block text-[22px] font-semibold tracking-normal text-royal-100/90">
            Die Beauty-App für Lash- &amp; Brow-Profis
          </span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-royal-100/70">
          Shop, Academy und Community in einer App – kuratiert mit echten
          Produkten von glamloox.net. Klick dich durch alle Bereiche.
        </p>
        <div className="mt-6 flex gap-2.5">
          {['Shop', 'Academy', 'Community'].map((b) => (
            <span
              key={b}
              className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/85 backdrop-blur"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* iPhone-Frame */}
      <div className="relative z-10 h-[812px] max-h-[94vh] w-[390px] shrink-0">
        <div
          className="absolute -inset-[10px] rounded-[62px]"
          style={{
            background: 'linear-gradient(160deg, #3b5bdb 0%, #0a1633 40%, #1c3193 100%)',
            boxShadow: '0 50px 120px -20px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
          aria-hidden
        />
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[52px] bg-black p-[3px] shadow-2xl">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[49px] bg-white">
            {/* Dynamic Island */}
            <div
              className="pointer-events-none absolute left-1/2 top-[10px] z-50 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black"
              aria-hidden
            />
            <div className="flex h-full flex-col pt-[42px]">{children}</div>
            <Toasts />
        <NotificationsSheet />
          </div>
        </div>
      </div>

      {/* Demo-Badge unten (klein & unaufdringlich) */}
      <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[11px] font-medium tracking-wide text-white/35 xl:hidden">
        GLAMLOOX · Interactive Concept Demo
      </p>
    </div>
  );
}

function useIsMobileScreen(): boolean {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return mobile;
}
