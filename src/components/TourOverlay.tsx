import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, GraduationCap, Users, User, X, ArrowRight, Heart } from 'lucide-react';
import { useApp } from '../store/AppStore';

const steps = [
  {
    icon: Heart,
    title: 'Herzlich willkommen! 💙',
    text: 'Das ist der interaktive GLAMLOOX-Prototyp – alles ist wirklich anklickbar: Produkte in den Warenkorb, Lektionen abschließen, Beiträge liken.',
    cta: null as string | null,
  },
  {
    icon: ShoppingBag,
    title: 'Shop mit echten Produkten',
    text: '33 Produkte mit echten Preisen & Bildern von glamloox.net – inklusive Suche, Filtern, Favoriten und Demo-Checkout.',
    cta: '/shop',
    ctaLabel: 'Shop öffnen',
  },
  {
    icon: GraduationCap,
    title: 'Academy mit Lernfortschritt',
    text: 'Korean Lash Lift & mehr: Lektionen ansehen, Quiz bestehen, Zertifikat erhalten – probiere den kostenlosen Demo-Kurs!',
    cta: '/academy',
    ctaLabel: 'Academy öffnen',
  },
  {
    icon: Users,
    title: 'Community zum Mitmachen',
    text: 'Ergebnisse liken, kommentieren, speichern oder selbst posten – fühlt sich wie ein echtes kleines Netzwerk an.',
    cta: '/community',
    ctaLabel: 'Community öffnen',
  },
  {
    icon: User,
    title: 'Alles an einem Ort',
    text: 'Bestellungen, Favoriten, Lernfortschritt, Zertifikate, Rewards & Einstellungen – dein komplettes Demo-Konto.',
    cta: '/profile',
    ctaLabel: 'Profil öffnen',
  },
];

/** Онбординг-тур при первом визите + «Тур для клиентов» из настроек. */
export function TourOverlay() {
  const { tourOpen, closeTour, toast } = useApp();
  const navigate = useNavigate();
  const [firstRunDone, setFirstRunDone] = useState(() => !!localStorage.getItem('glx-onboarded'));
  const [step, setStep] = useState(0);

  if (!tourOpen && firstRunDone) return null;

  const close = () => {
    localStorage.setItem('glx-onboarded', '1');
    setFirstRunDone(true);
    closeTour();
  };

  const st = steps[step];
  const Icon = st.icon;

  return (
    <div className="absolute inset-0 z-[55] flex flex-col">
      <div className="anim-fade-in absolute inset-0 bg-deep-950/70 backdrop-blur-md" onClick={close} aria-hidden />
      <div className="anim-pop relative m-auto w-full max-w-[340px] px-5">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-deep-950 via-deep-900 to-royal-800 p-5 pt-4 shadow-float">
          {/* Прогресс-точки */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-royal-300' : 'w-1.5 bg-white/25'}`}
                  aria-hidden
                />
              ))}
            </div>
            <button
              onClick={close}
              aria-label="Tour schließen"
              className="tap flex h-8 w-8 items-center justify-center rounded-full text-white/50 active:bg-white/10"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-royal-400 to-royal-600 text-white shadow-float">
            <Icon className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="mt-4 text-[20px] font-extrabold leading-snug tracking-tight text-white">{st.title}</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-royal-100/75">{st.text}</p>

          <div className="mt-6 space-y-2.5">
            {st.cta && (
              <button
                onClick={() => {
                  close();
                  navigate(st.cta!);
                  toast('Probiere alles aus – es ist ein Demo 💙', 'heart');
                }}
                className="tap flex h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-white text-[14px] font-bold text-deep-900 shadow-card"
              >
                {st.ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            )}
            <button
              onClick={() => (step < steps.length - 1 ? setStep(step + 1) : close())}
              className="tap flex h-[46px] w-full items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-[13.5px] font-bold text-white backdrop-blur"
            >
              {step < steps.length - 1 ? 'Weiter' : 'Los geht’s! 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
