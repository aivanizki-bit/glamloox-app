import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Lock, MapPin, PackageCheck, ChevronRight } from 'lucide-react';
import { useApp, eur, productById } from '../store/AppStore';
import { TopBar, SmartImage } from '../components/ui';

const steps = ['Adresse', 'Zahlung', 'Prüfen'] as const;

export default function Checkout() {
  const { cart, cartTotal, checkout, discount } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState<'paypal' | 'klarna' | 'card'>('paypal');
  const [terms, setTerms] = useState(false);
  const [saveDefault, setSaveDefault] = useState(true);
  const [addr, setAddr] = useState<'home' | 'studio'>('home');
  const [gift, setGift] = useState('');
  const [placing, setPlacing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-full bg-mist-50">
        <TopBar title="Checkout" back="/shop" />
        <div className="px-6 pt-16 text-center">
          <PackageCheck className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
          <p className="mt-3 text-[15px] font-semibold text-slate-500">
            Dein Warenkorb ist leer – lege Produkte hinein, um die Demo-Strecke zu testen.
          </p>
          <Link
            to="/shop"
            className="tap mt-5 inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
          >
            Zum Shop
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 100 ? 0 : 4.9;
  const discountAmount = discount ? (cartTotal * discount.pct) / 100 : 0;

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = checkout();
      navigate(`/checkout/success/${order.id}`, { replace: true });
    }, 1400);
  };

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-6">
      <TopBar
        title="Checkout"
        back={step === 0 ? '/cart' : undefined}
        right={
          step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="tap rounded-lg px-2 py-1 text-[13.5px] font-semibold text-royal-600 active:bg-royal-50"
            >
              Zurück
            </button>
          ) : undefined
        }
      />

      {/* Fortschritt */}
      <div className="flex items-center justify-center gap-2 px-4 pb-1 pt-4">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            aria-label={i < step ? `Zu Schritt ${s} zurückkehren` : undefined}
            className={`flex items-center gap-2 ${i < step ? 'tap' : 'cursor-default'}`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] font-bold ${
                i < step
                  ? 'bg-royal-600 text-white'
                  : i === step
                    ? 'bg-deep-900 text-white'
                    : 'bg-mist-200 text-slate-400'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </span>
            <span
              className={`text-[12px] font-semibold ${i === step ? 'text-deep-900' : 'text-slate-400'}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px w-5 bg-mist-200" aria-hidden />}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {/* ── Schritt 1: Adresse ── */}
        {step === 0 && (
          <div className="anim-slide-in space-y-3">
            <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
              <p className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
                <MapPin className="h-4 w-4 text-royal-600" aria-hidden /> Lieferadresse
              </p>
              <div className="mt-3 space-y-2.5">
                {(
                  [
                    ['home', 'Zuhause', 'Lena Meier · Belgianstraße 12, 50823 Köln'],
                    ['studio', 'Studio', 'Lash Lounge Lena · Friesenstraße 44, 50667 Köln'],
                  ] as const
                ).map(([id, label, line]) => (
                  <button
                    key={id}
                    onClick={() => setAddr(id)}
                    className={`tap flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left ${addr === id ? 'border-royal-600 bg-royal-50' : 'border-mist-200 bg-mist-50'}`}
                    aria-pressed={addr === id}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${addr === id ? 'border-royal-600' : 'border-slate-300'}`}
                    >
                      {addr === id && <span className="h-2.5 w-2.5 rounded-full bg-royal-600" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold text-deep-900">{label}</span>
                      <span className="block truncate text-[12px] text-slate-500">{line}</span>
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setSaveDefault((v) => !v)}
                  className="tap flex w-full items-center gap-2.5 rounded-xl bg-mist-50 px-3.5 py-2.5 text-left"
                  aria-pressed={saveDefault}
                >
                  <span
                    className={`relative h-[22px] w-[40px] shrink-0 rounded-full transition-colors ${saveDefault ? 'bg-royal-600' : 'bg-mist-200'}`}
                  >
                    <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${saveDefault ? 'left-[21px]' : 'left-[3px]'}`} />
                  </span>
                  <span className="text-[12.5px] font-semibold text-deep-900">Als Standard-Adresse speichern (Demo)</span>
                </button>
                <div className="rounded-xl border border-mist-200 bg-white p-3">
                  <p className="text-[12.5px] font-bold text-deep-900">Geschenknachricht (optional)</p>
                  <textarea
                    value={gift}
                    onChange={(e) => setGift(e.target.value)}
                    rows={2}
                    maxLength={120}
                    placeholder="„Viel Erfolg mit dem Studio! 💙“"
                    aria-label="Geschenknachricht"
                    className="mt-2 w-full resize-none rounded-lg border border-mist-200 bg-mist-50 p-2.5 text-[12.5px] text-deep-950 outline-none placeholder:text-slate-400 focus:border-royal-400"
                  />
                  <p className="mt-1 text-right text-[10px] text-slate-400">{gift.length}/120</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="tap h-[52px] w-full rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
            >
              Weiter zur Zahlung
            </button>
          </div>
        )}

        {/* ── Schritt 2: Zahlung ── */}
        {step === 1 && (
          <div className="anim-slide-in space-y-3">
            <div className="space-y-2 rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
              <p className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
                <CreditCard className="h-4 w-4 text-royal-600" aria-hidden /> Zahlungsart
              </p>
              {(
                [
                  ['paypal', 'PayPal', 'Sicher bezahlen mit PayPal'],
                  ['klarna', 'Klarna', 'Jetzt kaufen, später bezahlen*'],
                  ['card', 'Kreditkarte', 'Visa · Mastercard · Amex'],
                ] as const
              ).map(([id, label, hint]) => (
                <button
                  key={id}
                  onClick={() => setPay(id)}
                  className={`tap flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left ${
                    pay === id ? 'border-royal-600 bg-royal-50' : 'border-mist-200 bg-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      pay === id ? 'border-royal-600' : 'border-slate-300'
                    }`}
                  >
                    {pay === id && <span className="h-2.5 w-2.5 rounded-full bg-royal-600" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14px] font-bold text-deep-900">{label}</span>
                    <span className="block text-[11.5px] text-slate-400">{hint}</span>
                  </span>
                </button>
              ))}
              <p className="pt-1 text-[10px] leading-relaxed text-slate-400">
                * Hinweis: Im Prototyp wird keine Zahlung ausgeführt – alle Optionen sind simuliert.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="tap h-[52px] w-full rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
            >
              Weiter zur Prüfung
            </button>
          </div>
        )}

        {/* ── Schritt 3: Prüfen & Absenden ── */}
        {step === 2 && (
          <div className="anim-slide-in space-y-3">
            <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
              <p className="text-[13px] font-bold text-deep-900">
                Lieferadresse · <span className="font-semibold text-slate-500">{addr === 'home' ? 'Zuhause' : 'Studio'}</span>
              </p>
              {gift.trim() && (
                <p className="mt-1.5 rounded-xl bg-mist-50 px-3 py-2 text-[12px] italic text-slate-500">
                  „{gift.trim()}“
                </p>
              )}
              <p className="mt-3 text-[13px] font-bold text-deep-900">Deine Artikel</p>
              <div className="mt-3 space-y-3">
                {cart.map((c) => {
                  const p = productById(c.productId)!;
                  return (
                    <div key={c.productId + c.variantId} className="flex items-center gap-3">
                      <SmartImage src={p.images[0]} alt={p.title} className="h-12 w-12 rounded-xl" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-deep-900">
                          {p.shortTitle}
                        </p>
                        <p className="text-[11.5px] text-slate-400">
                          {c.qty}× {c.variantName || p.vendor}
                        </p>
                      </div>
                      <span className="text-[13.5px] font-bold text-deep-950">
                        {eur(c.price * c.qty)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5 border-t border-mist-200 pt-3 text-[13.5px] text-slate-500">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span className="font-semibold text-deep-900">{eur(cartTotal)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Rabatt ({discount.code})</span>
                    <span>−{eur(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Versand</span>
                  <span className="font-semibold text-deep-900">
                    {shipping === 0 ? 'Kostenlos' : eur(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-mist-200 pt-2">
                  <span className="text-[15px] font-bold text-deep-950">Gesamt</span>
                  <span className="text-[17px] font-extrabold text-deep-950">
                    {eur(cartTotal - discountAmount + shipping)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-mist-50 px-3.5 py-2.5">
                <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                <p className="text-[11px] leading-snug text-slate-500">
                  Verschlüsselte Demo-Zahlung via{' '}
                  {pay === 'paypal' ? 'PayPal' : pay === 'klarna' ? 'Klarna' : 'Kreditkarte'} ·
                  keine echten Zahlungsdaten
                </p>
              </div>
            </div>

            <button
              onClick={() => setTerms((v) => !v)}
              aria-pressed={terms}
              className="tap flex items-start gap-2.5 px-1 py-1 text-left"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${terms ? 'border-royal-600 bg-royal-600' : 'border-slate-300 bg-white'}`}
              >
                {terms && <span className="text-[10px] font-extrabold text-white">✓</span>}
              </span>
              <span className="text-[11.5px] leading-relaxed text-slate-500">
                Ich akzeptiere AGB &amp; Datenschutzhinweise der Demo (kein echter Rechtstext).
              </span>
            </button>
            {placing ? (
              <div className="flex h-[52px] items-center justify-center gap-3 rounded-2xl bg-deep-900 text-white">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-royal-300 border-t-transparent" />
                <span className="text-[14.5px] font-semibold">Bestellung wird simuliert…</span>
              </div>
            ) : (
              <button
                onClick={placeOrder}
                className="tap flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
              >
                Kostenpflichtig bestellen (Demo)
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
