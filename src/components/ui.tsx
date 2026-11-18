import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Check, Info, Star, Sparkles } from 'lucide-react';
import { useApp, eur } from '../store/AppStore';
import type { Product } from '../data/products';

// ── Bild mit Skeleton & Fallback ─────────────────────
export function SmartImage({
  src,
  alt,
  className = '',
  imgClass = '',
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClass?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      {!loaded && !error && <div className="absolute inset-0 skeleton" />}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-royal-50 to-mist-200">
          <Sparkles className="h-6 w-6 text-royal-300" aria-hidden />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClass}`}
        />
      )}
    </div>
  );
}

// ── Sektions-Header ───────────────────────────────────
export function SectionHeader({
  title,
  sub,
  to,
  toLabel = 'Alle',
}: {
  title: string;
  sub?: string;
  to?: string;
  toLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-4">
      <div>
        <h2 className="text-[19px] font-bold leading-tight tracking-tight text-deep-900">{title}</h2>
        {sub && <p className="mt-0.5 text-[13px] text-slate-500">{sub}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="tap flex shrink-0 items-center gap-0.5 rounded-lg py-1 pl-2 text-[13.5px] font-semibold text-royal-600 active:bg-royal-50"
        >
          {toLabel}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

// ── Top-Bar der App ───────────────────────────────────
export function TopBar({
  title,
  back,
  right,
  transparent,
}: {
  title: ReactNode;
  back?: string;
  right?: ReactNode;
  transparent?: boolean;
}) {
  return (
    <header
      className={`sticky top-0 z-30 flex h-[54px] items-center gap-2 px-3 ${
        transparent
          ? ''
          : 'border-b border-mist-200 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70'
      }`}
    >
      {back && (
        <Link
          to={back}
          aria-label="Zurück"
          className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep-900 active:bg-mist-100"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </Link>
      )}
      <h1 className="min-w-0 flex-1 truncate text-[17px] font-bold tracking-tight text-deep-900">{title}</h1>
      {right && <div className="flex shrink-0 items-center gap-1">{right}</div>}
    </header>
  );
}

// ── Favoriten-/Warenkorb-Buttons ──────────────────────
export function HeartButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { toggleFavorite, isFavorite } = useApp();
  const active = isFavorite(productId);
  return (
    <button
      aria-label={active ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={`tap flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur ${className}`}
    >
      <Heart
        className={`h-[18px] w-[18px] transition-colors ${active ? 'fill-royal-600 text-royal-600' : 'text-slate-500'}`}
        aria-hidden
      />
    </button>
  );
}

export function CartButton() {
  const { cartCount } = useApp();
  return (
    <Link
      to="/cart"
      aria-label="Warenkorb"
      className="tap relative flex h-9 w-9 items-center justify-center rounded-full text-deep-900 active:bg-mist-100"
    >
      <ShoppingBag className="h-[21px] w-[21px]" aria-hidden />
      {cartCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-royal-600 px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

// ── Produktkarte (Grid) ───────────────────────────────
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/shop/p/${product.id}`}
      className="tap group flex flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
    >
      <div className="relative aspect-square bg-white">
        <SmartImage src={product.images[0]} alt={product.title} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-mist-100/70 to-transparent" aria-hidden />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-deep-900/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {product.badge}
          </span>
        )}
        <div className="absolute right-2.5 top-2.5">
          <HeartButton productId={product.id} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-royal-600">{product.vendor}</span>
        <span className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-deep-900">
          {product.shortTitle}
        </span>
        <span className="mt-auto pt-1 text-[15px] font-bold text-deep-950">{eur(product.price)}</span>
      </div>
    </Link>
  );
}

// ── Produktkarte (horizontal, kompakt) ────────────────
export function ProductCardMini({ product }: { product: Product }) {
  return (
    <Link
      to={`/shop/p/${product.id}`}
      className="tap w-[150px] shrink-0 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-card"
    >
      <div className="relative aspect-square bg-white">
        <SmartImage src={product.images[0]} alt={product.title} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-mist-100/60 to-transparent" aria-hidden />
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-deep-900/90 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-royal-600">{product.vendor}</p>
        <p className="line-clamp-1 text-[13px] font-semibold text-deep-900">{product.shortTitle}</p>
        <p className="mt-0.5 text-[13.5px] font-bold text-deep-950">{eur(product.price)}</p>
      </div>
    </Link>
  );
}

// ── Chip / Filter-Pille ───────────────────────────────
export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`tap shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? 'bg-deep-900 text-white shadow-card'
          : 'border border-mist-200 bg-white text-slate-600 active:bg-mist-100'
      }`}
    >
      {children}
    </button>
  );
}

// ── Empty State ───────────────────────────────────────
export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="anim-fade-up flex flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-royal-50 text-royal-500">
        {icon}
      </div>
      <h3 className="text-[16.5px] font-bold text-deep-900">{title}</h3>
      <p className="mt-1 max-w-[260px] text-[13.5px] leading-relaxed text-slate-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Toasts ────────────────────────────────────────────
export function Toasts() {
  const { toasts } = useApp();
  const icons = { check: Check, heart: Heart, cart: ShoppingBag, info: Info, star: Star };
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[92px] z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const I = icons[t.icon ?? 'check'];
        return (
          <div
            key={t.id}
            className="anim-toast flex max-w-full items-center gap-2 rounded-2xl bg-deep-950/92 px-4 py-2.5 text-white shadow-float backdrop-blur"
          >
            <I className="h-4 w-4 shrink-0 text-royal-300" aria-hidden />
            <span className="truncate text-[13.5px] font-medium">{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Avatar mit Initialen ──────────────────────────────
export function Avatar({
  name,
  gradient,
  size = 40,
  ring,
}: {
  name: string;
  gradient: string;
  size?: number;
  ring?: boolean;
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${ring ? 'ring-2 ring-white' : ''}`}
      style={{
        width: size,
        height: size,
        background: gradient,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

// ── Fortschrittsbalken ────────────────────────────────
export function ProgressBar({ pct, className = '' }: { pct: number; className?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-mist-200 ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-royal-500 to-royal-700 transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
