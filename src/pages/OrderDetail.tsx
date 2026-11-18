import { Link, useParams } from 'react-router-dom';
import { Truck, CheckCircle2, Package } from 'lucide-react';
import { useApp, eur, productById } from '../store/AppStore';
import { TopBar, SmartImage, EmptyState } from '../components/ui';

export default function OrderDetail() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div>
        <TopBar title="Bestellung" back="/profile/orders" />
        <EmptyState
          icon={<Package className="h-7 w-7" aria-hidden />}
          title="Bestellung nicht gefunden"
          text="Diese Bestellung existiert im Demo-Konto nicht (mehr)."
          action={
            <Link to="/profile/orders" className="tap rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card">
              Zu meinen Bestellungen
            </Link>
          }
        />
      </div>
    );
  }

  const steps = ['Bestellt', 'Zahlung bestätigt', 'Versandt', 'Geliefert'];
  const currentStep = order.status === 'geliefert' ? 3 : 2;

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title={`Bestellung ${order.id}`} back="/profile/orders" />

      <div className="px-4 pt-3">
        {/* Tracking */}
        <div className="rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
          <p className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
            <Truck className="h-4 w-4 text-royal-600" aria-hidden /> Sendungsstatus
          </p>
          <div className="mt-4 flex items-center">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                      i <= currentStep ? 'bg-royal-600 text-white' : 'bg-mist-200 text-slate-400'
                    }`}
                  >
                    {i < currentStep ? <CheckCircle2 className="h-4 w-4" aria-hidden /> : i + 1}
                  </span>
                  <span
                    className={`mt-1.5 w-16 text-center text-[9.5px] font-semibold leading-tight ${
                      i <= currentStep ? 'text-deep-900' : 'text-slate-400'
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span
                    className={`-mt-5 h-[3px] flex-1 rounded-full ${
                      i < currentStep ? 'bg-royal-600' : 'bg-mist-200'
                    }`}
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Artikel */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
          <p className="border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-[13px] font-bold text-deep-900">
            Artikel
          </p>
          {order.items.map((it, i) => {
            const p = productById(it.productId);
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-mist-100' : ''}`}
              >
                {p && (
                  <Link to={`/shop/p/${p.id}`} className="tap shrink-0">
                    <SmartImage src={p.images[0]} alt={p.title} className="h-12 w-12 rounded-xl" />
                  </Link>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-deep-900">
                    {p?.shortTitle ?? it.productId}
                  </p>
                  <p className="text-[11.5px] text-slate-400">
                    {it.qty}× {it.variantName || p?.vendor}
                  </p>
                </div>
                <span className="text-[13.5px] font-bold text-deep-950">{eur(it.price * it.qty)}</span>
              </div>
            );
          })}
          <div className="space-y-1.5 border-t border-mist-200 px-4 py-3 text-[13px] text-slate-500">
            <div className="flex justify-between">
              <span>Zwischensumme</span>
              <span className="font-semibold text-deep-900">{eur(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Versand</span>
              <span className="font-semibold text-deep-900">
                {order.total >= 100 ? 'Kostenlos' : eur(4.9)}
              </span>
            </div>
            <div className="flex justify-between border-t border-mist-200 pt-2">
              <span className="text-[14.5px] font-bold text-deep-950">Gesamt</span>
              <span className="text-[16px] font-extrabold text-deep-950">
                {eur(order.total + (order.total >= 100 ? 0 : 4.9))}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-white p-3.5 text-[10.5px] leading-relaxed text-slate-400 shadow-card">
          Demo-Bestellung des GLAMLOOX Prototyps – keine echte Transaktion.
        </p>
      </div>
    </div>
  );
}
