import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, LayoutGrid, List as ListIcon, Heart } from 'lucide-react';
import { products, categories, type CategoryId } from '../data/products';
import { useApp } from '../store/AppStore';
import { TopBar, CartButton, Chip, ProductCard, ProductCardMini, EmptyState, BellButton, SmartImage, HeartButton } from '../components/ui';
import { eur } from '../store/AppStore';

const vendors = ['Alle Marken', ...Array.from(new Set(products.map((p) => p.vendor)))];

/** Brand-Param (z. B. „ZOLA“ aus dem Home-Carousel) auf den exakten Vendor-Namen auflösen */
const resolveVendor = (b: string | null | undefined): string => {
  if (!b) return 'Alle Marken';
  return vendors.find((v) => v.toLowerCase() === b.toLowerCase()) ?? 'Alle Marken';
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const catParam = (params.get('cat') as CategoryId | null) ?? 'alle';
  const brandParam = params.get('brand');
  const [query, setQuery] = useState('');
  const [vendor, setVendor] = useState(() => resolveVendor(brandParam));
  const [neuOnly, setNeuOnly] = useState(false);
  const [listView, setListView] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<'beliebt' | 'preis-auf' | 'preis-ab'>('beliebt');
  const [favOnly, setFavOnly] = useState(false);
  const { favorites, recentlyViewed } = useApp();

  const filtered = useMemo(() => {
    let list = products;
    if (catParam !== 'alle') list = list.filter((p) => p.category === catParam);
    if (favOnly) list = list.filter((p) => favorites.includes(p.id));
    if (vendor !== 'Alle Marken') list = list.filter((p) => p.vendor === vendor);
    if (neuOnly) list = list.filter((p) => p.badge === 'Neu');
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortTitle.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q),
      );
    }
    if (sort === 'preis-auf') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'preis-ab') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [catParam, vendor, query, sort, favOnly, favorites, neuOnly]);

  const setCat = (c: string) => {
    if (c === 'alle') params.delete('cat');
    else params.set('cat', c);
    setParams(params, { replace: true });
  };

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-4">
      <TopBar
        title="Shop"
        right={
          <>
            <Link
              to="/profile/favorites"
              aria-label="Favoriten"
              className="tap relative flex h-9 w-9 items-center justify-center rounded-full text-deep-900 active:bg-mist-100"
            >
              <Heart className={`h-[20px] w-[20px] ${favorites.length > 0 ? 'fill-royal-600 text-royal-600' : ''}`} aria-hidden />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-royal-600 px-1 text-[9.5px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <BellButton />
            <CartButton />
          </>
        }
      />

      {/* Suche */}
      <div className="sticky top-[54px] z-20 border-b border-mist-200 bg-mist-50/95 px-4 pb-3 pt-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-mist-200 bg-white px-3 shadow-card focus-within:border-royal-400">
            <Search className="h-[17px] w-[17px] shrink-0 text-slate-400" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Produkte, Marken, Kategorien…"
              className="w-full bg-transparent text-[14px] font-medium text-deep-950 outline-none placeholder:text-slate-400"
              aria-label="Produkte durchsuchen"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Suche löschen"
                className="tap flex h-6 w-6 items-center justify-center rounded-full bg-mist-100 text-slate-400"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Filter & Sortierung"
            className={`tap flex h-10 w-10 items-center justify-center rounded-xl shadow-card ${
              filterOpen || vendor !== 'Alle Marken' || sort !== 'beliebt'
                ? 'bg-deep-900 text-white'
                : 'border border-mist-200 bg-white text-deep-900'
            }`}
          >
            <SlidersHorizontal className="h-[17px] w-[17px]" aria-hidden />
          </button>
        </div>

        {/* Kategorien-Chips */}
        <div className="no-scrollbar -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4">
          {categories.map((c) => (
            <Chip key={c.id} active={catParam === c.id} onClick={() => setCat(c.id)}>
              {c.label}
              <span className={"ml-1 text-[10.5px] font-bold " + (catParam === c.id ? 'text-royal-200' : 'text-slate-300')}>
                {c.id === 'alle' ? products.length : products.filter((p) => p.category === c.id).length}
              </span>
            </Chip>
          ))}
          <Chip active={favOnly} onClick={() => setFavOnly((v) => !v)}>
            ♥ Favoriten{favorites.length > 0 ? ` · ${favorites.length}` : ''}
          </Chip>
          <Chip active={neuOnly} onClick={() => setNeuOnly((v) => !v)}>
            ✦ Neu
          </Chip>
          {(query || vendor !== 'Alle Marken' || catParam !== 'alle' || favOnly || neuOnly || sort !== 'beliebt') && (
            <button
              onClick={() => {
                setQuery('');
                setVendor('Alle Marken');
                setCat('alle');
                setFavOnly(false);
                setNeuOnly(false);
                setSort('beliebt');
              }}
              className="tap shrink-0 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-[12.5px] font-bold text-red-500"
            >
              ⟲ Zurücksetzen
            </button>
          )}
        </div>

        {/* Filter-Panel */}
        {filterOpen && (
          <div className="anim-fade-up mt-3 rounded-2xl border border-mist-200 bg-white p-3.5 shadow-card">
            <p className="text-[12px] font-bold uppercase tracking-wide text-slate-400">Marke</p>
            <div className="no-scrollbar -mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
              {vendors.map((v) => (
                <Chip key={v} active={vendor === v} onClick={() => setVendor(v)}>
                  {v}
                </Chip>
              ))}
            </div>
            <p className="mt-3 text-[12px] font-bold uppercase tracking-wide text-slate-400">Sortieren</p>
            <div className="mt-2 flex gap-2">
              {(
                [
                  ['beliebt', 'Beliebt'],
                  ['preis-auf', 'Preis ↑'],
                  ['preis-ab', 'Preis ↓'],
                ] as const
              ).map(([k, label]) => (
                <Chip key={k} active={sort === k} onClick={() => setSort(k)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kürzlich angesehen */}
      {recentlyViewed.length > 0 && (
        <section className="pt-3">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-[14px] font-bold text-deep-900">Kürzlich angesehen</h2>
          </div>
          <div className="no-scrollbar mt-2 flex gap-3 overflow-x-auto px-4 pb-1">
            {recentlyViewed.slice(0, 6).map((id) => {
              const p = products.find((x) => x.id === id);
              return p ? <ProductCardMini key={id} product={p} /> : null;
            })}
          </div>
        </section>
      )}

      {/* R7: Aktive Filter-Chips */}
      {(vendor !== 'Alle Marken' || catParam !== 'alle' || favOnly || neuOnly) && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-1 pt-2">
          {[
            catParam !== 'alle' ? { key: 'cat', label: categories.find((c) => c.id === catParam)!.label, clear: () => setCat('alle') } : null,
            vendor !== 'Alle Marken' ? { key: 'v', label: vendor, clear: () => setVendor('Alle Marken') } : null,
            favOnly ? { key: 'f', label: '♥ Favoriten', clear: () => setFavOnly(false) } : null,
            neuOnly ? { key: 'n', label: '✦ Neu', clear: () => setNeuOnly(false) } : null,
          ]
            .filter(Boolean)
            .map((chip) => (
              <button
                key={chip!.key}
                onClick={chip!.clear}
                className="tap flex items-center gap-1 rounded-full bg-deep-900 px-2.5 py-1 text-[11px] font-bold text-white"
              >
                {chip!.label}
                <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
        </div>
      )}

      {/* Ergebniszähler + Ansicht */}
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <p className="text-[12.5px] font-medium text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'Produkt' : 'Produkte'}
          {query && (
            <>
              {' '}
              für „<span className="font-semibold text-deep-900">{query}</span>“
            </>
          )}
        </p>
        <div className="flex items-center gap-2.5">
          {favorites.length > 0 && <p className="text-[12.5px] font-medium text-slate-400">{favorites.length} ♥</p>}
          <button
            onClick={() => setListView((v) => !v)}
            aria-label={listView ? 'Grid-Ansicht' : 'Listen-Ansicht'}
            className="tap flex h-8 w-8 items-center justify-center rounded-lg border border-mist-200 bg-white text-deep-900 shadow-card"
          >
            {listView ? <LayoutGrid className="h-4 w-4" aria-hidden /> : <ListIcon className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <>
        {query && (
          <div className="flex flex-wrap justify-center gap-2 px-4 pb-1">
            {['Booster', 'Pads', 'Timer', 'Farbe', 'Kleber'].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="tap rounded-full border border-royal-200 bg-royal-50 px-3.5 py-1.5 text-[12px] font-bold text-royal-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <EmptyState
          icon={<Search className="h-7 w-7" aria-hidden />}
          title="Nichts gefunden"
          text="Versuche einen anderen Suchbegriff oder setze die Filter zurück. Beliebte Suchbegriffe:"
          // Vorschlags-Chips nach EmptyState (siehe unten)
          action={
            <button
              onClick={() => {
                setQuery('');
                setVendor('Alle Marken');
                setCat('alle');
                setFavOnly(false);
              }}
              className="tap rounded-full bg-deep-900 px-5 py-2.5 text-[14px] font-semibold text-white shadow-card"
            >
              Filter zurücksetzen
            </button>
          }
        />
        </>
      ) : (
        <>
          {listView ? (
            <div className="anim-fade-in space-y-2.5 px-4">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  to={`/shop/p/${p.id}`}
                  className="tap flex items-center gap-3 rounded-2xl border border-mist-200 bg-white p-3 shadow-card"
                >
                  <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl bg-white">
                    <SmartImage src={p.images[0]} alt={p.title} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-royal-600">{p.vendor}</p>
                    <p className="line-clamp-1 text-[13.5px] font-bold text-deep-900">{p.shortTitle}</p>
                    <p className="mt-0.5 text-[14px] font-extrabold text-deep-950">{eur(p.price)}</p>
                  </div>
                  <HeartButton productId={p.id} className="!bg-white" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="anim-fade-in grid grid-cols-2 gap-3 px-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
