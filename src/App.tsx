import { Component, useEffect, useRef, type ReactNode } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './store/AppStore';
import { PhoneShell } from './components/PhoneShell';
import { BottomNav } from './components/BottomNav';
import { NotFound } from './components/GlobalOverlays';
import { useApp } from './store/AppStore';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Academy from './pages/Academy';
import CourseDetail from './pages/CourseDetail';
import LessonPlayer from './pages/LessonPlayer';
import MyCourses from './pages/MyCourses';
import EventDetail from './pages/EventDetail';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import MemberProfile from './pages/MemberProfile';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Favorites from './pages/Favorites';
import Certificates from './pages/Certificates';
import MyEvents from './pages/MyEvents';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';

/** R70: Scroll-Positionen pro Route merken und wiederherstellen. */
const scrollMap = new Map<string, number>();

function ScrollContainer() {
  const ref = useRef<HTMLElement>(null);
  const location = useLocation();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => scrollMap.set(location.pathname, el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [location.pathname]);
  useEffect(() => {
    ref.current?.scrollTo({ top: scrollMap.get(location.pathname) ?? 0 });
  }, [location.pathname]);
  return (
    <main ref={ref} className="app-scroll relative flex-1 bg-mist-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/p/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success/:orderId" element={<CheckoutSuccess />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/academy/my" element={<MyCourses />} />
        <Route path="/academy/course/:courseId" element={<CourseDetail />} />
        <Route path="/academy/course/:courseId/lesson/:lessonId" element={<LessonPlayer />} />
        <Route path="/academy/event/:eventId" element={<EventDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/new" element={<CreatePost />} />
        <Route path="/community/post/:postId" element={<PostDetail />} />
        <Route path="/community/member/:memberId" element={<MemberProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/orders" element={<Orders />} />
        <Route path="/profile/orders/:orderId" element={<OrderDetail />} />
        <Route path="/profile/favorites" element={<Favorites />} />
        <Route path="/profile/certificates" element={<Certificates />} />
        <Route path="/profile/events" element={<MyEvents />} />
        <Route path="/profile/rewards" element={<Rewards />} />
        <Route path="/profile/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

function OfflineListener() {
  const { setOffline } = useApp();
  useEffect(() => {
    const off = () => setOffline(true);
    const on = () => setOffline(false);
    window.addEventListener('offline', off);
    window.addEventListener('online', on);
    return () => {
      window.removeEventListener('offline', off);
      window.removeEventListener('online', on);
    };
  }, [setOffline]);
  return null;
}

/** R91: Freundliche Error-Boundary für die Demo. */
class ErrorBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  componentDidCatch() {
    /* Demo: keine externen Logs */
  }
  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 32, textAlign: 'center', fontFamily: 'system-ui' }}>
          <p style={{ fontSize: 20, fontWeight: 800 }}>Ups – hier hat etwas gehakt 💙</p>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>
            Die Demo läuft weiter – bitte Seite neu laden.
          </p>
          <button
            onClick={() => location.reload()}
            style={{ marginTop: 16, padding: '10px 24px', borderRadius: 999, background: '#0A1E5A', color: '#fff', border: 'none', fontWeight: 700 }}
          >
            Neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
    <AppProvider>
      <OfflineListener />
      <HashRouter>
        <PhoneShell>
          <ScrollContainer />
          <BottomNav />
        </PhoneShell>
      </HashRouter>
    </AppProvider>
    </ErrorBoundary>
  );
}
