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
import { events as staticEvents } from '../data/events';
import { posts as seedPosts, type Post, type Comment } from '../data/community';
import {
  demoUser,
  initialProgress,
  enrolledCourseIds,
  initiallyRegisteredEvents,
  initialOrders,
  type DemoOrder,
} from '../data/user';

export interface ClientPromo {
  id: string;
  name: string;
  type: 'prozent' | 'fix' | 'code' | 'versand' | 'bundle';
  value: number;
  code: string;
  scope: 'alles' | 'kategorie' | 'eigenmarken';
  category: string;
  startDate: string;
  endDate: string;
  active: boolean;
  bannerText: string;
  emoji: string;
  bundleProduct?: string;
  bundleCourse?: string;
}

/** Aktive, zeitlich gültige Aktionen (aus der Admin-Konsole übernommen). */
export const isPromoRunning = (p: ClientPromo): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  return p.active && p.startDate <= today && p.endDate >= today;
};

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

export interface ToastAction {
  label: string;
  run: () => void;
}
export interface Toast {
  id: number;
  msg: string;
  icon?: 'check' | 'heart' | 'cart' | 'info' | 'star' | 'undo';
  action?: ToastAction;
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
  lessonNotes: Record<string, string>;
  pointsLog: { id: string; title: string; delta: number }[];
  earnedCerts: string[];
  pushHintDismissed: boolean;
  profile: { name: string; studio: string; city: string };
  favoriteCourses: string[];
  comments: Record<string, Comment[]>;
  userPosts: Post[];
  rewardPoints: number;
  promotions: ClientPromo[];
  adminApplied: string;
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
  lessonNotes: {},
  pointsLog: [
    { id: 'pl1', title: 'Willkommensbonus', delta: 150 },
    { id: 'pl2', title: 'Kurs abgeschlossen: REANIMATION DER WIMPERN™', delta: 100 },
    { id: 'pl3', title: 'Community-Beitrag veröffentlicht', delta: 25 },
  ],
  earnedCerts: ['reanimation'],
  pushHintDismissed: false,
  profile: { name: demoUser.name, studio: demoUser.studio, city: demoUser.city },
  favoriteCourses: [],
  comments: {},
  userPosts: [],
  rewardPoints: demoUser.rewardPoints,
  promotions: [],
  adminApplied: '',
  notifications: SEED_NOTIFS,
  follows: [],
  reminders: [],
  recentlyViewed: [],
  discount: null,
  notifOpen: false,
  settings: { newsletter: true, pushEvents: true, darkPreview: false },
};

const KEY = 'glamloox-demo-v1';
export const APP_VERSION = '2.0';

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
  setLessonNote: (lessonId: string, text: string) => void;
  updateProfile: (patch: Partial<{ name: string; studio: string; city: string }>) => void;
  toggleCourseFav: (courseId: string) => void;
  isCourseFav: (courseId: string) => boolean;
  redeemPerk: (title: string, cost: number) => boolean;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  lightboxClose: () => void;
  tourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;
  dismissPushHint: () => void;
  setOffline: (v: boolean) => void;
  offline: boolean;
  feedbackOpen: boolean;
  openFeedback: () => void;
  closeFeedback: () => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  isCommentLiked: (postId: string, commentId: string) => boolean;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  addUserPost: (post: Post) => void;
  updateUserPost: (postId: string, patch: { title?: string; text: string }) => void;
  deleteUserPost: (postId: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
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
  bestAutoPromo: ClientPromo | null;
  freeShippingPromo: ClientPromo | null;
  applyAdminData: (json: string, silent?: boolean) => boolean;
  // Misc
  toasts: Toast[];
  dismissToast: (id: number) => void;
  toast: (msg: string, icon?: Toast['icon'], action?: ToastAction) => void;
  resetDemo: () => void;
  updateSettings: (s: Partial<PersistedState['settings']>) => void;
  certificates: { id: string; courseId: string; issuedISO: string; certId: string }[];
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [offline, setOfflineState] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const setOffline = useCallback((v: boolean) => setOfflineState(v), []);
  const openFeedback = useCallback(() => setFeedbackOpen(true), []);
  const closeFeedback = useCallback(() => setFeedbackOpen(false), []);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    const last = localStorage.getItem('glx-last-version');
    if (last && last !== APP_VERSION) {
      setTimeout(() => {
        setToasts((t) => [
          ...t,
          {
            id: toastId.current++,
            msg: 'Обновлено до v' + APP_VERSION + ' – новинки в настройках',
            icon: 'star' as const,
          },
        ]);
      }, 2200);
    }
    localStorage.setItem('glx-last-version', APP_VERSION);
  }, []);
  const toastId = useRef(1);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* Demo: Persistenz optional */
    }
  }, [state]);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback((msg: string, icon: Toast['icon'] = 'check', action?: ToastAction) => {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, msg, icon, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 5200 : 2600);
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

  const removeFromCart = useCallback(
    (productId: string, variantId: string) => {
      const removed = stateRef.current.cart.find(
        (c) => c.productId === productId && c.variantId === variantId,
      );
      setState((s) => ({
        ...s,
        cart: s.cart.filter((c) => !(c.productId === productId && c.variantId === variantId)),
      }));
      if (removed) {
        setTimeout(() => {
          toast('Position entfernt', 'undo', {
            label: 'Rückgängig',
            run: () =>
              setState((s) =>
                s.cart.some((c) => c.productId === removed.productId && c.variantId === removed.variantId)
                  ? s
                  : { ...s, cart: [...s.cart, removed] },
              ),
          });
        }, 60);
      }
    },
    [toast],
  );

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
      const progress = { ...s.progress, [lessonId]: next };
      // Auto-Zertifikat: eingeschriebene Kurse bei 100 % abschließen
      let earnedCerts = s.earnedCerts;
      let newCert: string | null = null;
      for (const cid of s.enrolled) {
        const c = courses.find((x) => x.id === cid);
        if (!c || s.earnedCerts.includes(cid)) continue;
        const all = allLessonIds(c);
        if (all.length > 0 && all.every((id) => progress[id])) {
          earnedCerts = [...s.earnedCerts, cid];
          newCert = c.shortTitle;
        }
      }
      const notifications = newCert
        ? [
            {
              id: 'nc' + Date.now(),
              kind: 'course' as const,
              title: 'Zertifikat freigeschaltet 🏆',
              body: newCert + ' abgeschlossen – dein Zertifikat wartet im Profil.',
              ago: 'gerade eben',
              read: false,
              link: '/profile/certificates',
            },
            ...s.notifications,
          ].slice(0, 20)
        : s.notifications;
      const pointsLog = newCert
        ? [{ id: 'pl' + Date.now(), title: 'Zertifikat: ' + newCert, delta: 100 }, ...s.pointsLog]
        : s.pointsLog;
      return { ...s, progress, earnedCerts, notifications, pointsLog };
    });
  }, []);

  const enrollCourse = useCallback(
    (courseId: string) => {
      setState((s) => {
        if (s.enrolled.includes(courseId)) return s;
        const c = courses.find((x) => x.id === courseId);
        // Auto-Zertifikat: bereits komplett abgeschlossene Kurse bekommen direkt das Zertifikat
        const all = c ? allLessonIds(c) : [];
        const alreadyDone = all.length > 0 && all.every((id) => s.progress[id]);
        return {
          ...s,
          enrolled: [...s.enrolled, courseId],
          earnedCerts: alreadyDone && !s.earnedCerts.includes(courseId) ? [...s.earnedCerts, courseId] : s.earnedCerts,
          notifications:
            alreadyDone && !s.earnedCerts.includes(courseId)
              ? [
                  {
                    id: 'nc' + Date.now(),
                    kind: 'course' as const,
                    title: 'Zertifikat freigeschaltet 🏆',
                    body: (c?.shortTitle ?? 'Kurs') + ' abgeschlossen – dein Zertifikat wartet im Profil.',
                    ago: 'gerade eben',
                    read: false,
                    link: '/profile/certificates',
                  },
                  ...s.notifications,
                ].slice(0, 20)
              : s.notifications,
          pointsLog:
            alreadyDone && !s.earnedCerts.includes(courseId)
              ? [{ id: 'pl' + Date.now(), title: 'Zertifikat: ' + (c?.shortTitle ?? 'Kurs'), delta: 100 }, ...s.pointsLog]
              : s.pointsLog,
        };
      });
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
      pointsLog: [{ id: 'pl' + Date.now(), title: 'Bestellbonus ' + order.id, delta: 50 }, ...s.pointsLog].slice(0, 12),
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

  const setLessonNote = useCallback((lessonId: string, text: string) => {
    setState((s) => ({ ...s, lessonNotes: { ...s.lessonNotes, [lessonId]: text } }));
  }, []);
  const dismissPushHint = useCallback(() => setState((s) => ({ ...s, pushHintDismissed: true })), []);
  const updateProfile = useCallback((patch: Partial<{ name: string; studio: string; city: string }>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
    toast('Profil gespeichert', 'check');
  }, []);
  const toggleCourseFav = useCallback((courseId: string) => {
    setState((s) => ({
      ...s,
      favoriteCourses: s.favoriteCourses.includes(courseId)
        ? s.favoriteCourses.filter((f) => f !== courseId)
        : [...s.favoriteCourses, courseId],
    }));
  }, []);
  const isCourseFav = useCallback((courseId: string) => state.favoriteCourses.includes(courseId), [state.favoriteCourses]);
  const redeemPerk = useCallback(
    (title: string, cost: number) => {
      if (stateRef.current.rewardPoints < cost) {
        toast('Noch nicht genug Punkte', 'info');
        return false;
      }
      setState((s) => ({
        ...s,
        rewardPoints: s.rewardPoints - cost,
        pointsLog: [{ id: 'pl' + Date.now(), title: 'Eingelöst: ' + title, delta: -cost }, ...s.pointsLog].slice(0, 12),
      }));
      toast(title + ' eingelöst 🎁', 'star');
      return true;
    },
    [toast],
  );
  const lightboxClose = useCallback(() => {
    (document.querySelector('button[aria-label="Zoom schließen"]') as HTMLElement | null)?.click();
  }, []);
  const [tourOpen, setTourOpen] = useState(false);
  const openTour = useCallback(() => setTourOpen(true), []);
  const closeTour = useCallback(() => setTourOpen(false), []);
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

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

  const updateUserPost = useCallback((postId: string, patch: { title?: string; text: string }) => {
    setState((s) => ({
      ...s,
      userPosts: s.userPosts.map((p) => (p.id === postId ? { ...p, ...patch } : p)),
    }));
    toast('Beitrag aktualisiert', 'check');
  }, [toast]);
  const deleteUserPost = useCallback(
    (postId: string) => {
      setState((s) => ({ ...s, userPosts: s.userPosts.filter((p) => p.id !== postId) }));
      toast('Beitrag gelöscht', 'info');
    },
    [toast],
  );
  const deleteComment = useCallback(
    (postId: string, commentId: string) => {
      setState((s) => {
        const list = (s.comments[postId] ?? []).filter((c) => c.id !== commentId);
        return { ...s, comments: { ...s.comments, [postId]: list } };
      });
      toast('Kommentar gelöscht', 'info');
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
      // 1) Admin-Kampagnen-Codes (aus der Admin-Konsole übernommen)
      const promo = state.promotions.find((p) => isPromoRunning(p) && p.type === 'code' && p.code.toUpperCase() === c);
      if (promo) {
        setState((s) => ({ ...s, discount: { code: c, pct: promo.value } }));
        toast(`Aktion ${promo.name}: −${promo.value} % aktiviert 🎉`, 'star');
        return true;
      }
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

  // Admin-Brücke: JSON aus der Admin-Konsole auf den Datenlayer anwenden
  const applyAdminDataInternal = useCallback((json: string, silent: boolean) => {
      try {
        const d = JSON.parse(json) as {
          products?: { id: string; price: number; badge: string | null; active: boolean }[];
          events?: { id: string; dateISO: string; price: number; published: boolean }[];
          courses?: { id: string; price: number; published: boolean }[];
          posts?: { id: string; hidden: boolean }[];
          outbox?: { id: string; title: string; body: string; target: string; sentISO: string }[];
          rewardPoints?: number;
          promotions?: ClientPromo[];
        };
        if (!d.products || !d.events) return false;
        let changed = 0;
        for (const ap of d.products) {
          const p = products.find((x) => x.id === ap.id);
          if (p) {
            if (typeof ap.price === 'number') { p.price = ap.price; changed++; }
            if (ap.badge !== undefined) p.badge = ap.badge;
          }
        }
        for (const ae of d.events ?? []) {
          const e = staticEvents.find((x) => x.id === ae.id);
          if (e) {
            if (typeof ae.dateISO === 'string') e.dateISO = ae.dateISO;
            if (typeof ae.price === 'number') e.price = ae.price;
            changed++;
          } else if (ae.published !== false) {
            staticEvents.push(ae as unknown as (typeof staticEvents)[number]);
            changed++;
          }
        }
        for (const ac of d.courses ?? []) {
          const c = courses.find((x) => x.id === ac.id);
          if (c && typeof ac.price === 'number') { c.price = ac.price; changed++; }
        }
        for (const ph of d.posts ?? []) {
          const p = seedPosts.find((x) => x.id === ph.id);
          if (p) { (p as Post & { hidden?: boolean }).hidden = ph.hidden; changed++; }
        }
        setState((s) => ({
          ...s,
          promotions: d.promotions ?? [],
        }));
        setState((s) => {
          const newNotifs = (d.outbox ?? []).map((n) => ({
            id: 'admin-' + n.id,
            kind: 'system' as const,
            title: n.title,
            body: n.body,
            ago: 'gerade eben (Admin)',
            read: false,
          }));
          const existing = new Set(s.notifications.map((n) => n.id));
          return {
            ...s,
            rewardPoints: typeof d.rewardPoints === 'number' ? d.rewardPoints : s.rewardPoints,
            notifications: [...newNotifs.filter((n) => !existing.has(n.id)), ...s.notifications].slice(0, 20),
          };
        });
        if (changed > 0 && !silent) {
          toast('Admin-Daten übernommen (' + changed + ' Änderungen) ✓', 'star');
        }
        setState((s) => ({ ...s, adminApplied: json }));
        return true;
      } catch {
        return false;
      }
    },
    [toast],
  );
  const applyAdminData = useCallback((json: string, silent?: boolean) => applyAdminDataInternal(json, !!silent), [applyAdminDataInternal]);

  // Bei jedem Start: gespeicherte Admin-Daten anwenden ( silent )
  useEffect(() => {
    if (state.adminApplied) {
      applyAdminDataInternal(state.adminApplied, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Aktions-Engine: beste Auto-Aktion & Gratis-Versand ──
  const bestAutoPromo = useMemo(() => {
    return (
      state.promotions
        .filter((p) => isPromoRunning(p) && p.type === 'prozent' && p.scope === 'alles')
        .sort((a, b) => b.value - a.value)[0] ?? null
    );
  }, [state.promotions]);
  const freeShippingPromo = useMemo(() => state.promotions.filter((p) => isPromoRunning(p) && p.type === 'versand')[0] ?? null, [state.promotions]);

  // Zertifikate dynamisch aus earnedCerts generieren
  const certificates = useMemo(
    () =>
      state.earnedCerts.map((cid, i) => ({
        id: 'cert-' + cid,
        courseId: cid,
        issuedISO: i === 0 ? '2026-09-12' : new Date().toISOString().slice(0, 10),
        certId: 'GLX-AC-' + cid.slice(0, 4).toUpperCase() + '-' + (2026 + i),
      })),
    [state.earnedCerts],
  );

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
    setLessonNote,
    updateProfile,
    toggleCourseFav,
    isCourseFav,
    redeemPerk,
    searchOpen,
    openSearch,
    closeSearch,
    lightboxClose,
    tourOpen,
    openTour,
    closeTour,
    dismissPushHint,
    setOffline,
    offline,
    feedbackOpen,
    openFeedback,
    closeFeedback,
    toggleSave,
    addComment,
    addUserPost,
    updateUserPost,
    deleteUserPost,
    deleteComment,
    allPosts,
    toasts,
    dismissToast,
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
    bestAutoPromo,
    freeShippingPromo,
    applyAdminData,
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
