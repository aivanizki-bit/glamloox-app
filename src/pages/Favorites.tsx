import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { products } from '../data/products';
import { useApp, eur } from '../store/AppStore';
import { TopBar, SmartImage, EmptyState, HeartButton } from '../components/ui';

export default function Favorites() {
  const { favorites, addToCart } = useApp();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="anim-slide-in min-h-full bg-mist-50 pb-6">
      <TopBar title="Meine Favoriten" back="/profile" />

      {favProducts.length === 0 ? (
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
