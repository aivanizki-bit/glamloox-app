import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, GraduationCap, Home as HomeIcon } from 'lucide-react';
import { useApp, eur, productById } from '../store/AppStore';
import { TopBar, SmartImage } from '../components/ui';

export default function CheckoutSuccess() {
  const { orderId } = useParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  return (
    <div className="anim-fade-in min-h-full bg-mist-50">
      <TopBar title="Bestellung abgeschlossen" back="/shop" />

      <div className="px-4 py-6">
        <div className="anim-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-deep-900 shadow-float">
          <CheckCircle2 className="h-10 w-10 text-white" aria-hidden />
        </div>
        <h2 className="mt-4 text-center text-[22px] font-extrabold tracking-tight text-deep-950">
          Danke, Lena! 💙
        </h2>
        <p className="mx-auto mt-1.5 max-w-[280px] text-center text-[13.5px] leading-relaxed text-slate-500">
          Deine Demo-Bestellung <span className="font-bold text-deep-900">{order?.id}</span> ist
          eingegangen. Eine Bestätigung würde an deine E-Mail gehen.
        </p>

        {order && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-mist-200 bg-mist-50 px-4 py-3">
              <span className="flex items-center gap-2 text-[13px] font-bold text-deep-900">
                <Package className="h-4 w-4 text-royal-600" aria-hidden /> Bestellung {order.id}
              </span>
              <span className="rounded-full bg-royal-100 px-2.5 py-1 text-[11px] font-bold text-royal-700">
                {order.status}
              </span>
            </div>
            <div className="space-y-3 p-4">
              {order.items.map((it, i) => {
                const p = productById(it.productId);
                return (
                  <div key={i} className="flex items-center gap-3">
                    {p && <SmartImage src={p.images[0]} alt={p.title} className="h-11 w-11 rounded-xl" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-deep-900">
                        {p?.shortTitle ?? it.productId}
                      </p>
                      <p className="text-[11.5px] text-slate-400">
                        {it.qty}× {it.variantName || p?.vendor}
                      </p>
                    </div>
                    <span className="text-[13.5px] font-bold text-deep-950">
                      {eur(it.price * it.qty)}
                    </span>
                  </div>
                );
              })}
              <div className="flex justify-between border-t border-mist-200 pt-3">
                <span className="text-[14px] font-bold text-deep-950">Gesamt</span>
                <span className="text-[16px] font-extrabold text-deep-950">{eur(order.total)}</span>
              </div>
            </div>
            <div className="border-t border-mist-200 bg-mist-50 px-4 py-3">
              <p className="text-[11.5px] leading-relaxed text-slate-500">
                ✨ <span className="font-semibold text-deep-900">+50 Reward-Punkte</span> gutgeschrieben
                – schau in deinem Profil vorbei.
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-2.5">
          <Link
            to="/profile/orders"
            className="tap flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-deep-900 text-[14.5px] font-bold text-white shadow-card"
          >
            <Package className="h-[18px] w-[18px]" aria-hidden /> Meine Bestellungen
          </Link>
          <div className="flex gap-2.5">
            <Link
              to="/academy"
              className="tap flex h-[46px] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-royal-200 bg-royal-50 text-[13px] font-bold text-royal-700"
            >
              <GraduationCap className="h-4 w-4" aria-hidden /> Academy
            </Link>
            <Link
              to="/"
              className="tap flex h-[46px] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-mist-200 bg-white text-[13px] font-bold text-deep-900"
            >
              <HomeIcon className="h-4 w-4" aria-hidden /> Startseite
            </Link>
          </div>
        </div>

        <p className="mt-5 text-center text-[10.5px] leading-relaxed text-slate-400">
          Dies ist ein simulierter Checkout des GLAMLOOX-Konzept-Prototyps.
          <br />
          Es wurde keine echte Bestellung ausgelöst.
        </p>
      </div>
    </div>
  );
}
