import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { useApp, eur, productById } from '../store/AppStore';
import { TopBar, SmartImage, EmptyState } from '../components/ui';

export default function Orders() {
  const { orders } = useApp();

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Meine Bestellungen" back="/profile" />

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-7 w-7" aria-hidden />}
          title="Noch keine Bestellungen"
          text="Sobald du im Demo-Shop bestellst, erscheinen deine Bestellungen hier."
          action={
            <Link
              to="/shop"
              className="tap inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
            >
              Jetzt stöbern
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 px-4 pt-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/profile/orders/${o.id}`}
              className="tap block overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
            >
              <div className="flex items-center justify-between border-b border-mist-200 bg-mist-50 px-4 py-2.5">
                <div>
                  <p className="text-[13.5px] font-bold text-deep-900">{o.id}</p>
                  <p className="text-[11.5px] text-slate-400">
                    {new Date(o.dateISO + 'T12:00').toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    o.status === 'geliefert'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-royal-100 text-royal-700'
                  }`}
                >
                  {o.status === 'geliefert' ? '✓ Geliefert' : 'Unterwegs'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-4">
                <div className="flex -space-x-2.5">
                  {o.items.slice(0, 3).map((it, i) => {
                    const p = productById(it.productId);
                    return p ? (
                      <SmartImage
                        key={i}
                        src={p.images[0]}
                        alt={p.title}
                        className="h-11 w-11 rounded-xl border-2 border-white bg-white"
                      />
                    ) : null;
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold text-slate-500">
                    {o.items.reduce((n, it) => n + it.qty, 0)} Artikel
                  </p>
                  <p className="text-[15px] font-extrabold text-deep-950">{eur(o.total)}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
