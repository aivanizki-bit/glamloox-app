import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Leaf,
  Sparkles,
} from 'lucide-react';
import { products } from '../data/products';
import { useApp, eur } from '../store/AppStore';
import { SmartImage, HeartButton, ProductCardMini, CartButton, TopBar } from '../components/ui';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);
  const { addToCart, toast, pushRecentlyViewed } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [variant, setVariant] = useState(product?.variants[0]?.id ?? 'std');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) pushRecentlyViewed(product.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const related = useMemo(
    () =>
      product
        ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6)
        : [],
    [product],
  );

  if (!product) {
    return (
      <div className="p-6">
        <TopBar title="Produkt" back="/shop" />
        <p className="mt-10 text-center text-slate-500">Produkt nicht gefunden.</p>
      </div>
    );
  }

  const activeVariant = product.variants.find((v) => v.id === variant);
  const price = activeVariant?.price ?? product.price;
  const vendorCount = products.filter((p) => p.vendor === product.vendor).length;

  return (
    <div className="anim-fade-in min-h-full bg-white pb-28">
      {/* Galerie */}
      <div className="relative">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setImgIdx(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {product.images.map((img, i) => (
            <div key={i} className="w-full shrink-0 snap-center bg-mist-100">
              <SmartImage src={img} alt={`${product.title} Bild ${i + 1}`} className="aspect-square w-full" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Zurück"
            className="tap flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur"
          >
            <ChevronLeft className="h-5 w-5 text-deep-900" aria-hidden />
          </button>
          <div className="flex items-center gap-2">
            <HeartButton productId={product.id} />
            <CartButton />
          </div>
        </div>
        {/* Bildpunkte */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {product.images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === imgIdx ? 'w-5 bg-deep-900' : 'w-1.5 bg-deep-900/25'
              }`}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/shop`}
              className="text-[11.5px] font-bold uppercase tracking-wide text-royal-600"
            >
              {product.vendor}
            </Link>
            <h1 className="mt-1 text-[21px] font-extrabold leading-tight tracking-tight text-deep-950">
              {product.shortTitle}
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{product.title}</p>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[26px] font-extrabold tracking-tight text-deep-950">{eur(price)}</span>
          <span className="text-[12px] font-medium text-slate-400">inkl. MwSt.</span>
        </div>

        <p className="mt-3 rounded-2xl bg-mist-100 p-3.5 text-[13.5px] leading-relaxed text-slate-600">
          {product.blurb}
        </p>

        {/* Varianten */}
        {product.variants.length > 0 && (
          <div className="mt-5">
            <p className="text-[13px] font-bold text-deep-900">
              Variante <span className="font-medium text-slate-400">· {activeVariant?.name}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v.id)}
                  className={`tap rounded-xl border px-4 py-2.5 text-[13.5px] font-semibold ${
                    variant === v.id
                      ? 'border-royal-600 bg-royal-50 text-royal-700'
                      : 'border-mist-200 bg-white text-slate-600'
                  }`}
                >
                  {v.name}
                  {v.price != null && v.price !== product.price && (
                    <span className="ml-1.5 text-[12px] font-bold">{eur(v.price)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menge */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-[13px] font-bold text-deep-900">Menge</p>
          <div className="flex items-center gap-3 rounded-xl border border-mist-200 px-2 py-1.5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Menge verringern"
              className="tap flex h-8 w-8 items-center justify-center rounded-lg text-deep-900 active:bg-mist-100 disabled:opacity-30"
              disabled={qty <= 1}
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <span className="w-6 text-center text-[15px] font-bold text-deep-950">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Menge erhöhen"
              className="tap flex h-8 w-8 items-center justify-center rounded-lg text-deep-900 active:bg-mist-100"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Service-Versprechen */}
      <div className="mt-6 grid grid-cols-3 gap-2 px-4">
        {[
          { icon: Truck, t: 'Schneller Versand', s: 'kostenlos ab 100 €' },
          { icon: RotateCcw, t: '14 Tage Rückgabe', s: 'unkompliziert' },
          { icon: ShieldCheck, t: 'Sichere Zahlung', s: 'PayPal, Klarna & Co.' },
        ].map(({ icon: Icon, t, s }) => (
          <div
            key={t}
            className="flex flex-col items-center rounded-2xl border border-mist-200 bg-mist-50 px-2 py-3.5 text-center"
          >
            <Icon className="h-5 w-5 text-royal-600" aria-hidden />
            <p className="mt-1.5 text-[11.5px] font-bold leading-tight text-deep-900">{t}</p>
            <p className="text-[10px] text-slate-400">{s}</p>
          </div>
        ))}
      </div>

      {/* Marken-Hinweis */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between rounded-2xl border border-royal-100 bg-royal-50/60 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-royal-600" aria-hidden />
            <p className="text-[12.5px] font-semibold text-deep-900">
              {vendorCount} Produkte von {product.vendor} im Shop
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-royal-400" aria-hidden />
        </div>
        {product.vendor === 'GLAMLOOX®' && (
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-mist-200 bg-white px-4 py-3">
            <Leaf className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
            <p className="text-[12px] leading-relaxed text-slate-500">
              GLAMLOOX Eigenprodukte: ohne Hormone, vegan & tierversuchsfrei.
            </p>
          </div>
        )}
      </div>

      {/* Ähnliche Produkte */}
      {related.length > 0 && (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between px-4">
            <h2 className="text-[17px] font-bold tracking-tight text-deep-900">Das passt dazu</h2>
            <Link to="/shop" className="text-[13px] font-semibold text-royal-600">
              Alles ansehen
            </Link>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {related.map((p) => (
              <ProductCardMini key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Add-to-Cart */}
      <div className="sticky bottom-0 z-30 mt-4 border-t border-mist-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        <button
          onClick={() => {
            addToCart(product, variant, qty);
            toast(`${qty}× ${product.shortTitle} – bereit zum Checkout`, 'cart');
          }}
          className="tap flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-royal-600 to-royal-700 text-[15.5px] font-bold text-white shadow-float"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden />
          In den Warenkorb · {eur(price * qty)}
        </button>
        <p className="mt-1.5 text-center text-[10.5px] text-slate-400">
          Demo-Prototyp · keine echte Bestellung
        </p>
      </div>
    </div>
  );
}
