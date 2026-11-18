import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { products, type Product } from '../data/products';
import { courses, totalLessons, allLessonIds } from '../data/courses';
import { posts as seedPosts, type Post, type Comment } from '../data/community';
import {
  demoUser,
  initialProgress,
  enrolledCourseIds,
  initiallyRegisteredEvents,
  initialOrders,
  certificates,
  type DemoOrder,
} from '../data/user';

export interface CartItem {
  productId: string;
  variantId: string;
  variantName: string;
  qty: number;
  price: number; // Stückpreis
}

export interface Toast {
  id: number;
  msg: string;
  icon?: 'check' | 'heart' | 'cart' | 'info' | 'star';
}

interface PersistedState {
  cart: CartItem[];
  favorites: string[];
  progress: Record<string, boolean>;
  enrolled: string[];
  eventRegs: string[];
  orders: DemoOrder[];
  likedPosts: string[];
  savedPosts: string[];
  comments: Record<string, Comment[]>;
  userPosts: Post[];
  rewardPoints: number;
  settings: { newsletter: boolean; pushEvents: boolean; darkPreview: boolean };
}

const DEFAULT_STATE: PersistedState = {
  cart: [],
  favorites: ['lash-booster'],
  progress: initialProgress,
  enrolled: enrolledCourseIds,
  eventRegs: initiallyRegisteredEvents,
  orders: initialOrders,
  likedPosts: [],
  savedPosts: [],
  comments: {},
  userPosts: [],
  rewardPoints: demoUser.rewardPoints,
  settings: { newsletter: true, pushEvents: true, darkPreview: false },
};

const KEY = 'glamloox-demo-v1';

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...parsed.settings } };
  } catch {
    return DEFAULT_STATE;
  }
}

export interface AppState extends PersistedState {
  // Cart
  addToCart: (p: Product, variantId?: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  // Favorites
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  // Academy
  toggleLesson: (lessonId: string, done?: boolean) => void;
  enrollCourse: (courseId: string) => void;
  courseProgress: (courseId: string) => { done: number; total: number; pct: number };
  registerEvent: (eventId: string) => void;
  unregisterEvent: (eventId: string) => void;
  // Checkout
  checkout: () => DemoOrder;
  // Community
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addUserPost: (post: Post) => void;
  allPosts: Post[];
  // Misc
  toasts: Toast[];
  toast: (msg: string, icon?: Toast['icon']) => void;
  resetDemo: () => void;
  updateSettings: (s: Partial<PersistedState['settings']>) => void;
  certificates: typeof certificates;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* Demo: Persistenz optional */
    }
  }, [state]);

  const toast = useCallback((msg: string, icon: Toast['icon'] = 'check') => {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // ── Cart ─────────────────────────────────────────────
  const addToCart = useCallback(
    (p: Product, variantId?: string, qty = 1) => {
      const v = p.variants.find((x) => x.id === variantId) ?? p.variants[0];
      const vid = v?.id ?? 'std';
      const vname = p.variants.length > 0 ? (v?.name ?? '') : '';
      const price = v?.price ?? p.price;
      setState((s) => {
        const existing = s.cart.find((c) => c.productId === p.id && c.variantId === vid);
        const cart = existing
          ? s.cart.map((c) =>
              c === existing ? { ...c, qty: Math.min(99, c.qty + qty) } : c,
            )
          : [...s.cart, { productId: p.id, variantId: vid, variantName: vname, qty, price }];
        return { ...s, cart };
      });
      toast(`${p.shortTitle} im Warenkorb`, 'cart');
    },
    [toast],
  );

  const setQty = useCallback((productId: string, variantId: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart:
        qty <= 0
          ? s.cart.filter((c) => !(c.productId === productId && c.variantId === variantId))
          : s.cart.map((c) =>
              c.productId === productId && c.variantId === variantId ? { ...c, qty } : c,
            ),
    }));
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setState((s) => ({
      ...s,
      cart: s.cart.filter((c) => !(c.productId === productId && c.variantId === variantId)),
    }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const cartCount = useMemo(() => state.cart.reduce((n, c) => n + c.qty, 0), [state.cart]);
  const cartTotal = useMemo(
    () => state.cart.reduce((n, c) => n + c.qty * c.price, 0),
    [state.cart],
  );

  // ── Favorites ────────────────────────────────────────
  const toggleFavorite = useCallback(
    (id: string) => {
      setState((s) => {
        const has = s.favorites.includes(id);
        const p = products.find((x) => x.id === id);
        toast(has ? `${p?.shortTitle ?? 'Produkt'} aus Favoriten entfernt` : `${p?.shortTitle ?? 'Produkt'} gemerkt`, 'heart');
        return {
          ...s,
          favorites: has ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
        };
      });
    },
    [toast],
  );
  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  // ── Academy ──────────────────────────────────────────
  const toggleLesson = useCallback((lessonId: string, done?: boolean) => {
    setState((s) => {
      const isDone = !!s.progress[lessonId];
      const next = done ?? !isDone;
      return { ...s, progress: { ...s.progress, [lessonId]: next } };
    });
  }, []);

  const enrollCourse = useCallback(
    (courseId: string) => {
      setState((s) =>
        s.enrolled.includes(courseId) ? s : { ...s, enrolled: [...s.enrolled, courseId] },
      );
      const c = courses.find((x) => x.id === courseId);
      toast(`Eingeschrieben: ${c?.shortTitle ?? 'Kurs'}`, 'star');
    },
    [toast],
  );

  const courseProgress = useCallback(
    (courseId: string) => {
      const c = courses.find((x) => x.id === courseId);
      if (!c) return { done: 0, total: 0, pct: 0 };
      const ids = allLessonIds(c);
      const done = ids.filter((i) => state.progress[i]).length;
      return { done, total: totalLessons(c), pct: Math.round((done / ids.length) * 100) };
    },
    [state.progress],
  );

  const registerEvent = useCallback(
    (eventId: string) => {
      setState((s) =>
        s.eventRegs.includes(eventId) ? s : { ...s, eventRegs: [...s.eventRegs, eventId] },
      );
    },
    [],
  );
  const unregisterEvent = useCallback((eventId: string) => {
    setState((s) => ({ ...s, eventRegs: s.eventRegs.filter((e) => e !== eventId) }));
  }, []);

  // ── Checkout (Demo) ──────────────────────────────────
  const checkout = useCallback((): DemoOrder => {
    const order: DemoOrder = {
      id: 'GLX-' + Math.floor(10300 + Math.random() * 800),
      dateISO: new Date().toISOString().slice(0, 10),
      status: 'unterwegs',
      items: state.cart.map((c) => ({
        productId: c.productId,
        qty: c.qty,
        price: c.price,
        variantName: c.variantName || undefined,
      })),
      total: state.cart.reduce((n, c) => n + c.qty * c.price, 0),
    };
    // Bestellung anlegen, Warenkorb leeren, +50 Reward-Punkte (Demo)
    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      cart: [],
      rewardPoints: s.rewardPoints + 50,
    }));
    return order;
  }, [state.cart]);

  // ── Community ────────────────────────────────────────
  const toggleLike = useCallback((postId: string) => {
    setState((s) => {
      const has = s.likedPosts.includes(postId);
      return {
        ...s,
        likedPosts: has ? s.likedPosts.filter((p) => p !== postId) : [...s.likedPosts, postId],
      };
    });
  }, []);

  const toggleSave = useCallback(
    (postId: string) => {
      setState((s) => {
        const has = s.savedPosts.includes(postId);
        toast(has ? 'Beitrag aus „Gespeichert“ entfernt' : 'Beitrag gespeichert', 'star');
        return {
          ...s,
          savedPosts: has ? s.savedPosts.filter((p) => p !== postId) : [...s.savedPosts, postId],
        };
      });
    },
    [toast],
  );

  const addComment = useCallback((postId: string, text: string) => {
    setState((s) => {
      const c: Comment = {
        id: 'uc' + Date.now(),
        authorId: 'm-lena',
        text,
        ago: 'gerade eben',
      };
      return { ...s, comments: { ...s.comments, [postId]: [...(s.comments[postId] ?? []), c] } };
    });
  }, []);

  const addUserPost = useCallback(
    (post: Post) => {
      setState((s) => ({ ...s, userPosts: [post, ...s.userPosts] }));
      toast('Beitrag veröffentlicht', 'check');
    },
    [toast],
  );

  const allPosts = useMemo(() => [...state.userPosts, ...seedPosts], [state.userPosts]);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(KEY);
    setState(DEFAULT_STATE);
    toast('Demo-Daten zurückgesetzt', 'info');
  }, [toast]);

  const updateSettings = useCallback((patch: Partial<PersistedState['settings']>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const value: AppState = {
    ...state,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    toggleFavorite,
    isFavorite,
    toggleLesson,
    enrollCourse,
    courseProgress,
    registerEvent,
    unregisterEvent,
    checkout,
    toggleLike,
    toggleSave,
    addComment,
    addUserPost,
    allPosts,
    toasts,
    toast,
    resetDemo,
    updateSettings,
    certificates,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp muss innerhalb von AppProvider verwendet werden');
  return ctx;
}

// ── Helfer ────────────────────────────────────────────
export const eur = (n: number): string =>
  n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

export const productById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);
