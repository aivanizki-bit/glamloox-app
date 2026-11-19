import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Share2, ShoppingBasket } from 'lucide-react';
import { products } from '../data/products';
import { useApp, eur } from '../store/AppStore';
import { TopBar, SmartImage, EmptyState, HeartButton, ProductCardMini } from '../components/ui';

export default function Favorites() {
  const { favorites, addToCart, toast } = useApp();
  const [sort, setSort] = useState<'neueste' | 'preis' | 'name'>('neueste');
  const favProducts = useMemo(() => {
    const list = products.filter((p) => favorites.includes(p.id));
    if (sort === 'preis') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'name') return [...list].sort((a, b) => a.shortTitle.localeCompare(b.shortTitle));
    return [...list].sort((a, b) => favorites.indexOf(a.id) - favorites.indexOf(b.id));
  }, [favorites, products, sort]);

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Meine Favoriten" back="/profile" />

      {favProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-1 pt-3">
          {(['neueste', 'preis', 'name'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={'tap rounded-full px-3 py-1.5 text-[12px] font-bold ' + (sort === s ? 'bg-deep-900 text-white' : 'border border-mist-200 bg-white text-slate-500')}
            >
              {s === 'neueste' ? 'Zuletzt gemerkt' : s === 'preis' ? 'Preis ↑' : 'A–Z'}
            </button>
          ))}
        </div>
      )}

      {favProducts.length > 0 && (
        <div className="flex gap-2 px-4 pb-1 pt-3">
          <button
            onClick={() => {
              favProducts.forEach((p) => addToCart(p));
              toast(favProducts.length + ' Favoriten im Warenkorb', 'cart');
            }}
            className="tap flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-deep-900 text-[13px] font-bold text-white shadow-card"
          >
            <ShoppingBasket className="h-4 w-4" aria-hidden /> Alle in den Warenkorb
          </button>
          <button
            onClick={async () => {
              try { await navigator.clipboard.writeText(location.href); } catch { /* Demo */ }
              toast('Wunschliste-Link kopiert (Demo)', 'star');
            }}
            aria-label="Wunschliste teilen"
            className="tap flex h-11 w-11 items-center justify-center rounded-xl border border-mist-200 bg-white text-deep-900 shadow-card"
          >
            <Share2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {favProducts.length === 0 ? (
        <>
          <EmptyState
            icon={<Heart className="h-7 w-7" aria-hidden />}
            title="Noch keine Favoriten"
            text="Tippe beim Produkt auf das ♥, um es hier zu merken."
            action={
              <Link
                to="/shop"
                className="tap inline-block rounded-full bg-deep-900 px-6 py-3 text-[14px] font-semibold text-white shadow-card"
              >
                Produkte entdecken
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
        <div className="space-y-3 px-4 pt-3">
          {favProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3 shadow-card"
            >
              <Link to={`/shop/p/${p.id}`} className="tap shrink-0">
                <SmartImage src={p.images[0]} alt={p.title} className="h-[72px] w-[72px] rounded-xl" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-[10.5px] font-bold uppercase tracking-wide text-royal-600">
                  {p.vendor}
                </p>
                <Link to={`/shop/p/${p.id}`} className="tap">
                  <p className="line-clamp-2 text-[13.5px] font-bold leading-snug text-deep-900">
                    {p.shortTitle}
                  </p>
                </Link>
                <p className="mt-1 text-[14.5px] font-extrabold text-deep-950">{eur(p.price)}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => addToCart(p)}
                  aria-label={`${p.shortTitle} in den Warenkorb`}
                  className="tap flex h-9 w-9 items-center justify-center rounded-full bg-royal-600 text-white shadow-card"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden />
                </button>
                <HeartButton productId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
