import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { products, categories, type CategoryId } from '../data/products';
import { useApp } from '../store/AppStore';
import { TopBar, CartButton, Chip, ProductCard, EmptyState } from '../components/ui';

const vendors = ['Alle Marken', ...Array.from(new Set(products.map((p) => p.vendor)))];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const catParam = (params.get('cat') as CategoryId | null) ?? 'alle';
  const [query, setQuery] = useState('');
  const [vendor, setVendor] = useState('Alle Marken');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<'beliebt' | 'preis-auf' | 'preis-ab'>('beliebt');
  const { favorites } = useApp();

  const filtered = useMemo(() => {
    let list = products;
    if (catParam !== 'alle') list = list.filter((p) => p.category === catParam);
    if (vendor !== 'Alle Marken') list = list.filter((p) => p.vendor === vendor);
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
  }, [catParam, vendor, query, sort]);

  const setCat = (c: string) => {
    if (c === 'alle') params.delete('cat');
    else params.set('cat', c);
    setParams(params, { replace: true });
  };

  return (
    <div className="anim-fade-in min-h-full bg-mist-50 pb-4">
      <TopBar
        title="Shop"
        right={<CartButton />}
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
            </Chip>
          ))}
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

      {/* Ergebniszähler */}
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
        {favorites.length > 0 && (
          <p className="text-[12.5px] font-medium text-slate-400">{favorites.length} gemerkt ♥</p>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-7 w-7" aria-hidden />}
          title="Nichts gefunden"
          text="Versuche einen anderen Suchbegriff oder setze die Filter zurück."
          action={
            <button
              onClick={() => {
                setQuery('');
                setVendor('Alle Marken');
                setCat('alle');
              }}
              className="tap rounded-full bg-deep-900 px-5 py-2.5 text-[14px] font-semibold text-white shadow-card"
            >
              Filter zurücksetzen
            </button>
          }
        />
      ) : (
        <div className="anim-fade-in grid grid-cols-2 gap-3 px-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
