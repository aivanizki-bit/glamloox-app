import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useApp, eur, productById } from '../store/AppStore';
import { TopBar, SmartImage, EmptyState } from '../components/ui';

export default function Cart() {
  const { cart, setQty, removeFromCart, cartTotal, cartCount } = useApp();
  const navigate = useNavigate();
  const freeShipAt = 100;
  const missing = Math.max(0, freeShipAt - cartTotal);

  return (
    <div className="anim-fade-in min-h-full bg-mist-50">
      <TopBar title={`Warenkorb${cartCount > 0 ? ` (${cartCount})` : ''}`} back="/shop" />

      {cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" aria-hidden />}
          title="Dein Warenkorb ist leer"
          text="Stöbere im Shop und entdecke Booster, Lifting-Sets und Profi-Zubehör."
          action={
            <Link
              to="/shop"
              className="tap inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
            >
              Zum Shop
            </Link>
          }
        />
      ) : (
        <div className="pb-5">
          {/* Versandkosten-Fortschritt */}
          <div className="mx-4 mt-3 rounded-2xl border border-royal-100 bg-white p-3.5 shadow-card">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-deep-900">
              <Truck className="h-4 w-4 text-royal-600" aria-hidden />
              {missing > 0 ? (
                <>
                  Noch <span className="font-bold text-royal-700">{eur(missing)}</span> bis zum
                  Gratis-Versand
                </>
              ) : (
                <>Gratis-Versand freigeschaltet 🎉</>
              )}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-royal-400 to-royal-700 transition-all duration-700"
                style={{ width: `${Math.min(100, (cartTotal / freeShipAt) * 100)}%` }}
              />
            </div>
          </div>

          {/* Positionen */}
          <div className="mt-3 space-y-3 px-4">
            {cart.map((item) => {
              const p = productById(item.productId);
              if (!p) return null;
              return (
                <div
                  key={item.productId + item.variantId}
                  className="anim-fade-up flex gap-3 rounded-2xl border border-mist-200 bg-white p-3 shadow-card"
                >
                  <Link to={`/shop/p/${p.id}`} className="shrink-0">
                    <SmartImage
                      src={p.images[0]}
                      alt={p.title}
                      className="h-[84px] w-[84px] rounded-xl"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/shop/p/${p.id}`}
                          className="line-clamp-2 text-[13.5px] font-bold leading-snug text-deep-900"
                        >
                          {p.shortTitle}
                        </Link>
                        <p className="mt-0.5 text-[11.5px] text-slate-400">
                          {p.vendor}
                          {item.variantName ? ` · ${item.variantName}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        aria-label="Entfernen"
                        className="tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-300 active:bg-mist-100 active:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2.5 rounded-xl border border-mist-200 px-1.5 py-1">
                        <button
                          onClick={() => setQty(item.productId, item.variantId, item.qty - 1)}
                          aria-label="Menge verringern"
                          className="tap flex h-7 w-7 items-center justify-center rounded-lg text-deep-900 active:bg-mist-100"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <span className="w-5 text-center text-[13.5px] font-bold text-deep-950">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.productId, item.variantId, item.qty + 1)}
                          aria-label="Menge erhöhen"
                          className="tap flex h-7 w-7 items-center justify-center rounded-lg text-deep-900 active:bg-mist-100"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                      <span className="text-[14.5px] font-extrabold text-deep-950">
                        {eur(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zusammenfassung */}
          <div className="mx-4 mt-3 rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
            <div className="flex justify-between text-[13.5px] text-slate-500">
              <span>Zwischensumme</span>
              <span className="font-semibold text-deep-900">{eur(cartTotal)}</span>
            </div>
            <div className="mt-1.5 flex justify-between text-[13.5px] text-slate-500">
              <span>Versand</span>
              <span className="font-semibold text-deep-900">
                {missing > 0 ? eur(4.9) : 'Kostenlos'}
              </span>
            </div>
            <div className="mt-3 flex justify-between border-t border-mist-200 pt-3">
              <span className="text-[15px] font-bold text-deep-950">Gesamt</span>
              <span className="text-[17px] font-extrabold text-deep-950">
                {eur(cartTotal + (missing > 0 ? 4.9 : 0))}
              </span>
            </div>
          </div>

          <p className="mt-3 px-6 text-center text-[10.5px] leading-relaxed text-slate-400">
            Demo-Checkout · es wird keine echte Bestellung ausgelöst und keine
            Zahlung ausgeführt.
          </p>
        </div>
      )}

      {/* Sticky Checkout */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 z-30 border-t border-mist-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-xl">
          <button
            onClick={() => navigate('/checkout')}
            className="tap flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
          >
            Weiter zum Checkout
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
