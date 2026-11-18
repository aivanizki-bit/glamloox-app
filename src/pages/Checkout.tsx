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
          <div key={s} className="flex items-center gap-2">
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
          </div>
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
                <div className="rounded-xl bg-mist-50 px-3.5 py-3">
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                    Demo-Adresse
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-deep-950">Lena Meier</p>
                  <p className="text-[13px] text-slate-500">Lash Lounge Lena · Belgianstraße 12</p>
                  <p className="text-[13px] text-slate-500">50823 Köln</p>
                </div>
                <button className="tap w-full rounded-xl border border-dashed border-royal-300 bg-royal-50/50 py-2.5 text-[13px] font-semibold text-royal-700">
                  + Neue Adresse hinzufügen
                </button>
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
              <p className="text-[13px] font-bold text-deep-900">Deine Artikel</p>
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
