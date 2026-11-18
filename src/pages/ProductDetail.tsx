import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronDown,
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
import { X, ZoomIn, Pencil } from 'lucide-react';
import { useApp, eur } from '../store/AppStore';
import { SmartImage, HeartButton, ProductCardMini, CartButton, TopBar } from '../components/ui';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);
  const { addToCart, toast, pushRecentlyViewed, recentlyViewed } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [variant, setVariant] = useState(product?.variants[0]?.id ?? 'std');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const track = document.querySelector('.snap-x');
    if (track) track.scrollTo({ left: imgIdx * (track as HTMLElement).clientWidth, behavior: 'smooth' });
  }, [imgIdx]);
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
            <button
              key={i}
              onClick={() => setLightbox(i)}
              aria-label={`${product.title} Bild ${i + 1} vergrößern`}
              className="relative w-full shrink-0 snap-center bg-mist-100"
            >
              <SmartImage src={img} alt={`${product.title} Bild ${i + 1}`} className="aspect-square w-full" />
              <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-deep-950/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                <ZoomIn className="h-3 w-3" aria-hidden /> Zoom
              </span>
            </button>
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

        {/* R1-2: Verfügbarkeit + Artikelnummer */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden /> Auf Lager
          </span>
          <span className="text-[11px] text-slate-400">Art.-Nr. GLX-{product.id.toUpperCase().slice(0, 8)}</span>
        </div>

        {/* R3: Patch-Test-Hinweis */}
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-amber-800">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          Profi-Hinweis: Hautverträglichkeit vor jeder Anwendung mit Patch-Test prüfen (24 Std.).
        </p>

        <p className="mt-3 rounded-2xl bg-mist-100 p-3.5 text-[13.5px] leading-relaxed text-slate-600">
          {product.blurb}
        </p>

        {/* Details & Anwendung (Accordion) */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-mist-200">
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="tap flex w-full items-center justify-between bg-mist-50 px-4 py-3 text-left"
            aria-expanded={detailsOpen}
          >
            <span className="text-[13.5px] font-bold text-deep-900">Details &amp; Anwendung</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {detailsOpen && (
            <div className="anim-fade-in bg-white px-4 py-3.5">
              <ul className="space-y-2">
                {(
                  {
                    pflege: ['Abends 2× täglich auf die saubere Haut auftragen', 'Erste Ergebnisse nach 4–6 Wochen, volle Wirkung nach ca. 12', 'Ohne Hormone & Prostaglandine – vegan formuliert'],
                    'lash-lifting': ['Profi-Qualität für Studio-Anwendungen', 'Einwirkzeiten stets laut Produkthanleitung', 'Kühl und trocken lagern, von Wärmequellen fernhalten'],
                    brow: ['Farbintensität steuerst du über die Einwirkzeit', 'Patch-Test vor der ersten Anwendung empfohlen', 'Kühl und trocken lagern'],
                    zubehoer: ['Perfekt für Studio & unterwegs', 'Leicht zu reinigen', 'Langlebige, hochwertige Materialien'],
                  } as Record<string, string[]>
                )[product.category].map((d) => (
                  <li key={d} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-slate-600">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-royal-500" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-[10px] text-slate-400">Demo-Inhalte für den Prototyp – Details je Produkt variieren.</p>
            </div>
          )}
        </div>

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
                  onClick={() => {
                    setVariant(v.id);
                    if (product.id === 'oko-undereye-pads') {
                      const imgIdx = product.images.findIndex((src) => src.toLowerCase().includes(v.id === 'v1' ? 'pink' : 'black'));
                      if (imgIdx >= 0) setImgIdx(imgIdx);
                    }
                  }}
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

      {/* R15: Studio-Deal-Hinweis */}
      <p className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-royal-50 px-3.5 py-2.5 text-[11.5px] font-semibold text-royal-700">
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Studio-Deal: Ab 3 Stück −10 % auf die Gesamtsumme (Demo-Hinweis)
      </p>

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

      {/* R13: Zuletzt angesehen */}
      {recentlyViewed.filter((id) => id !== product.id).length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between px-4">
            <h2 className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight text-deep-900">
              <Pencil className="h-4 w-4 text-royal-500" aria-hidden /> Zuletzt angesehen
            </h2>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {recentlyViewed.filter((id) => id !== product.id).slice(0, 6).map((id) => {
              const p = products.find((x) => x.id === id);
              return p ? <ProductCardMini key={id} product={p} /> : null;
            })}
          </div>
        </div>
      )}

      {/* R14: Passendes Zubehör */}
      {product.category !== 'zubehoer' && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between px-4">
            <h2 className="text-[15px] font-bold tracking-tight text-deep-900">Zubehör-Tipps dazu</h2>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4">
            {products.filter((p) => p.category === 'zubehoer').slice(0, 6).map((p) => (
              <ProductCardMini key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

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

      {/* R12: Lightbox */}
      {lightbox !== null && (
        <div className="anim-fade-in absolute inset-0 z-50 flex items-center justify-center bg-deep-950/95 p-4" onClick={() => setLightbox(null)}>
          <button
            aria-label="Zoom schließen"
            className="tap absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <img
            src={product.images[lightbox]}
            alt={`${product.title} vergrößert`}
            className="max-h-[75%] w-auto max-w-full rounded-2xl object-contain shadow-float"
          />
          <p className="absolute bottom-6 text-[12px] font-medium text-white/60">
            {lightbox + 1} / {product.images.length} · Tippen zum Schließen
          </p>
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
