import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Tag, X, CalendarClock } from 'lucide-react';
import { useApp, eur, productById } from '../store/AppStore';
import { products } from '../data/products';
import { TopBar, SmartImage, EmptyState, ProductCardMini } from '../components/ui';

export default function Cart() {
  const { cart, setQty, removeFromCart, cartTotal, cartCount, discount, applyDiscount, clearDiscount, bestAutoPromo, freeShippingPromo } = useApp();
  const navigate = useNavigate();
  const [codeInput, setCodeInput] = useState('');
  // ── Aktions-Engine: Code-Rabatt + Auto-Aktion + Gratis-Versand ──
  const codePct = discount?.pct ?? 0;
  const autoPct = bestAutoPromo?.value ?? 0;
  const totalPct = Math.min(60, codePct + autoPct);
  const discountAmount = (cartTotal * totalPct) / 100;
  const freeShipAt = 100;
  const promoFreeShip = !!freeShippingPromo && cartTotal >= freeShippingPromo.value;
  const freeShip = promoFreeShip || cartTotal >= freeShipAt;
  const missing = Math.max(0, freeShipAt - cartTotal);

  return (
    <div className="anim-fade-in min-h-full bg-mist-50">
      <TopBar title={`Warenkorb${cartCount > 0 ? ` (${cartCount})` : ''}`} back="/shop" />

      {cart.length === 0 ? (
        <>
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
          <section className="pt-2">
          <div className="px-4 pb-2">
            <h2 className="text-[15px] font-bold text-deep-900">Beliebte Produkte</h2>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
            {products
              .filter((p) => ['lash-booster', 'brow-booster', 'booster-set', 'peptide-mascara', 'elan-try-me', 'pads-fusion'].includes(p.id))
              .map((p) => (
                <ProductCardMini key={p.id} product={p} />
              ))}
          </div>
        </section>
        </>
      ) : (
        <div className="pb-5">
          {/* Versandkosten-Fortschritt */}
          <div className="mx-4 mt-3 rounded-2xl border border-royal-100 bg-white p-3.5 shadow-card">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-deep-900">
              <Truck className="h-4 w-4 text-royal-600" aria-hidden />
              {promoFreeShip ? (
                <>Gratis-Versand durch Aktion 🎉</>
              ) : missing > 0 ? (
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
                        <input
                          value={item.qty}
                          onChange={(e) => {
                            const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                            if (!Number.isNaN(n)) setQty(item.productId, item.variantId, Math.min(99, Math.max(1, n)));
                          }}
                          aria-label="Menge direkt ändern"
                          className="w-8 rounded-lg border border-mist-200 bg-white text-center text-[13.5px] font-bold text-deep-950 outline-none focus:border-royal-400"
                        />
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

          {/* Laufende Aktion (Auto-Rabatt) */}
          {bestAutoPromo && (
            <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-deep-950 to-royal-800 p-3.5 shadow-card">
              <span className="text-[22px]">{bestAutoPromo.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-extrabold text-white">
                  {bestAutoPromo.bannerText.replace('X', String(bestAutoPromo.value))}
                </p>
                <p className="text-[11px] text-royal-100/70">
                  Aktionsrabatt −{bestAutoPromo.value} % · automatisch im Warenkorb aktiv
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-gold-400 px-3 py-1.5 text-[12px] font-extrabold text-deep-950">
                −{bestAutoPromo.value} %
              </span>
            </div>
          )}

          {promoFreeShip && (
            <p className="mx-4 mt-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[11.5px] font-bold text-emerald-700">
              🚚 Gratis-Versand-Aktion aktiv (ab {freeShippingPromo.value.toString().replace('.', ',')} €)
            </p>
          )}

          {/* R16: Das passt dazu */}
          {(() => {
            const cartCats = new Set(cart.map((it) => productById(it.productId)?.category));
            const suggestions = products.filter((p) => !cartCats.has(p.category) && !cart.some((it) => it.productId === p.id)).slice(0, 4);
            return suggestions.length > 0 ? (
              <div className="mx-4 mt-3">
                <p className="mb-2 text-[14px] font-bold text-deep-900">Das passt dazu</p>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {suggestions.map((p) => (
                    <ProductCardMini key={p.id} product={p} />
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* R17: Lieferdatum-Schätzung */}
          <p className="mx-4 mt-3 flex items-center gap-2 rounded-2xl border border-mist-200 bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 shadow-card">
            <CalendarClock className="h-4 w-4 shrink-0 text-royal-600" aria-hidden />
            Voraussichtliche Lieferung:{' '}
            <span className="font-bold text-deep-900">
              {new Date(Date.now() + 3 * 86400000).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </p>

          {/* Rabattcode */}
          <div className="mx-4 mt-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
            {discount ? (
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Tag className="h-4 w-4" aria-hidden />
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-deep-900">Code {discount.code} aktiv</p>
                  <p className="text-[11px] text-slate-400">{discount.pct} % Rabatt auf deine Bestellung</p>
                </div>
                <button
                  onClick={clearDiscount}
                  aria-label="Rabattcode entfernen"
                  className="tap flex h-8 w-8 items-center justify-center rounded-full text-slate-400 active:bg-mist-100"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Rabattcode eingeben…"
                    aria-label="Rabattcode"
                    className="h-10 flex-1 rounded-xl border border-mist-200 bg-mist-50 px-3.5 text-[13px] font-semibold uppercase text-deep-950 outline-none placeholder:font-normal placeholder:normal-case placeholder:text-slate-400 focus:border-royal-400"
                  />
                  <button
                    onClick={() => applyDiscount(codeInput) && setCodeInput('')}
                    className="tap h-10 rounded-xl bg-deep-900 px-4 text-[13px] font-bold text-white shadow-card"
                  >
                    Einlösen
                  </button>
                </div>
                <p className="mt-2 text-[10.5px] text-slate-400">
                  Demo-Codes: GLAM10 (−10 %) · GLAM5 (−5 %){bestAutoPromo ? ' · Aktionscode aus der Admin-Konsole gilt ebenfalls' : ''}
                </p>
              </>
            )}
          </div>

          {/* Zusammenfassung */}
          <div className="mx-4 mt-3 rounded-2xl border border-mist-200 bg-white p-4 shadow-card">
            <div className="flex justify-between text-[13.5px] text-slate-500">
              <span>Zwischensumme</span>
              <span className="font-semibold text-deep-900">{eur(cartTotal)}</span>
            </div>
            {codePct > 0 && (
              <div className="mt-1.5 flex justify-between text-[13.5px] font-semibold text-emerald-600">
                <span>Code {discount?.code} (−{codePct} %)</span>
                <span>−{eur((cartTotal * codePct) / 100)}</span>
              </div>
            )}
            {autoPct > 0 && (
              <div className="mt-1.5 flex justify-between text-[13.5px] font-semibold text-emerald-600">
                <span>
                  Aktion {bestAutoPromo?.emoji} {bestAutoPromo?.name} (−{autoPct} %)
                </span>
                <span>−{eur((cartTotal * autoPct) / 100)}</span>
              </div>
            )}
            <div className="mt-1.5 flex justify-between text-[13.5px] text-slate-500">
              <span>Versand</span>
              <span className="font-semibold text-deep-900">
                {freeShip ? 'Kostenlos' : eur(4.9)}
              </span>
            </div>
            <div className="mt-3 flex justify-between border-t border-mist-200 pt-3">
              <span className="text-[15px] font-bold text-deep-950">Gesamt</span>
              <span className="text-[17px] font-extrabold text-deep-950">
                {eur(cartTotal - discountAmount + (freeShip ? 0 : 4.9))}
              </span>
            </div>
            {(totalPct > 0 || freeShip) && (
              <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-[11.5px] font-bold text-emerald-700">
                🎉 Deine Ersparnis: {totalPct > 0 ? eur(discountAmount) + ' Rabatt' : ''}
                {totalPct > 0 && freeShip ? ' + ' : ''}
                {freeShip ? 'Gratis-Versand' : ''}
              </p>
            )}
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
