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

export interface NotifItem {
  id: string;
  kind: 'order' | 'course' | 'event' | 'community' | 'system';
  title: string;
  body: string;
  ago: string;
  read: boolean;
  link?: string;
}

const SEED_NOTIFS: NotifItem[] = [
  { id: 'n1', kind: 'order', title: 'Bestellung GLX-10247 unterwegs', body: 'Deine Lash Booster sind auf dem Weg – voraussichtlich morgen bei dir.', ago: 'vor 3 Std.', read: false, link: '/profile/orders' },
  { id: 'n2', kind: 'course', title: 'Nur noch 4 Lektionen!', body: 'Du bist dem Korean-Lift-Zertifikat ganz nah – weiter so!', ago: 'vor 1 Tag', read: false, link: '/academy/course/korean-powder-2' },
  { id: 'n3', kind: 'event', title: 'Webinar-Erinnerung', body: 'BIG KOREAN Lashlift Webinar am 3. Dez. um 19:00 Uhr.', ago: 'vor 2 Tagen', read: true, link: '/academy/event/ev-big-korean-webinar' },
  { id: 'n4', kind: 'community', title: 'Neue Reaktion', body: 'Jules Berger gefällt dein Lifting-Ergebnis.', ago: 'vor 3 Tagen', read: true, link: '/community/post/p1' },
];

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
  likedComments: string[];
  comments: Record<string, Comment[]>;
  userPosts: Post[];
  rewardPoints: number;
  notifications: NotifItem[];
  follows: string[];
  reminders: string[];
  recentlyViewed: string[];
  discount: { code: string; pct: number } | null;
  notifOpen: boolean;
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
  likedComments: [],
  comments: {},
  userPosts: [],
  rewardPoints: demoUser.rewardPoints,
  notifications: SEED_NOTIFS,
  follows: [],
  reminders: [],
  recentlyViewed: [],
  discount: null,
  notifOpen: false,
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
  toggleCommentLike: (postId: string, commentId: string) => void;
  isCommentLiked: (postId: string, commentId: string) => boolean;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addUserPost: (post: Post) => void;
  allPosts: Post[];
  // Notifications
  unreadNotifs: number;
  openNotifs: () => void;
  closeNotifs: () => void;
  markAllNotifsRead: () => void;
  toggleFollow: (memberId: string) => void;
  isFollowing: (memberId: string) => boolean;
  toggleReminder: (eventId: string) => void;
  pushRecentlyViewed: (productId: string) => void;
  applyDiscount: (code: string) => boolean;
  clearDiscount: () => void;
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
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
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
    const latest = stateRef.current;
    const order: DemoOrder = {
      id: 'GLX-' + Math.floor(10300 + Math.random() * 800),
      dateISO: new Date().toISOString().slice(0, 10),
      status: 'unterwegs',
      items: latest.cart.map((c) => ({
        productId: c.productId,
        qty: c.qty,
        price: c.price,
        variantName: c.variantName || undefined,
      })),
      total: Math.round(latest.cart.reduce((n, c) => n + c.qty * c.price, 0) * (1 - (latest.discount?.pct ?? 0) / 100) * 100) / 100,
    };
    // Bestellung anlegen, Warenkorb leeren, +50 Reward-Punkte (Demo)
    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      cart: [],
      discount: null,
      rewardPoints: s.rewardPoints + 50,
      notifications: [
        { id: 'no' + Date.now(), kind: 'order' as const, title: 'Bestellung ' + order.id + ' bestätigt', body: 'Danke! Deine Bestellung ist bei uns eingegangen.', ago: 'gerade eben', read: false, link: '/profile/orders' },
        ...s.notifications,
      ].slice(0, 20),
    }));
    return order;
  }, []);

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

  const toggleCommentLike = useCallback((postId: string, commentId: string) => {
    setState((s) => {
      const key = postId + ':' + commentId;
      const has = s.likedComments.includes(key);
      return {
        ...s,
        likedComments: has ? s.likedComments.filter((k) => k !== key) : [...s.likedComments, key],
      };
    });
  }, []);
  const isCommentLiked = useCallback(
    (postId: string, commentId: string) => state.likedComments.includes(postId + ':' + commentId),
    [state.likedComments],
  );

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

  // ── Notifications & neue Features ────────────────────
  const unreadNotifs = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );
  const openNotifs = useCallback(() => setState((s) => ({ ...s, notifOpen: true })), []);
  const closeNotifs = useCallback(() => setState((s) => ({ ...s, notifOpen: false })), []);
  const markAllNotifsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const toggleFollow = useCallback(
    (memberId: string) => {
      setState((s) => {
        const has = s.follows.includes(memberId);
        return { ...s, follows: has ? s.follows.filter((f) => f !== memberId) : [...s.follows, memberId] };
      });
    },
    [],
  );
  const isFollowing = useCallback((memberId: string) => state.follows.includes(memberId), [state.follows]);

  const toggleReminder = useCallback(
    (eventId: string) => {
      setState((s) => {
        const has = s.reminders.includes(eventId);
        if (has) return { ...s, reminders: s.reminders.filter((r) => r !== eventId) };
        return {
          ...s,
          reminders: [...s.reminders, eventId],
          notifications: [
            { id: 'nr' + Date.now(), kind: 'event' as const, title: 'Erinnerung aktiviert', body: 'Wir erinnern dich vor dem Live-Event.', ago: 'gerade eben', read: false },
            ...s.notifications,
          ].slice(0, 20),
        };
      });
    },
    [],
  );

  const pushRecentlyViewed = useCallback((productId: string) => {
    setState((s) => ({
      ...s,
      recentlyViewed: [productId, ...s.recentlyViewed.filter((id) => id !== productId)].slice(0, 8),
    }));
  }, []);

  const applyDiscount = useCallback(
    (code: string): boolean => {
      const c = code.trim().toUpperCase();
      if (c === 'GLAM10') {
        setState((s) => ({ ...s, discount: { code: 'GLAM10', pct: 10 } }));
        toast('Rabattcode GLAM10 aktiviert – 10 %', 'star');
        return true;
      }
      if (c === 'GLAM5') {
        setState((s) => ({ ...s, discount: { code: 'GLAM5', pct: 5 } }));
        toast('Rabattcode GLAM5 aktiviert – 5 %', 'star');
        return true;
      }
      toast('Code ungültig – probiere GLAM10', 'info');
      return false;
    },
    [toast],
  );
  const clearDiscount = useCallback(() => setState((s) => ({ ...s, discount: null })), []);

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
    toggleCommentLike,
    isCommentLiked,
    toggleSave,
    addComment,
    addUserPost,
    allPosts,
    toasts,
    toast,
    resetDemo,
    updateSettings,
    certificates,
    unreadNotifs,
    openNotifs,
    closeNotifs,
    markAllNotifsRead,
    toggleFollow,
    isFollowing,
    toggleReminder,
    pushRecentlyViewed,
    applyDiscount,
    clearDiscount,
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
