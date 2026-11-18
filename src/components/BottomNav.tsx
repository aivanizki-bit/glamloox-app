import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, GraduationCap, Users, User } from 'lucide-react';
import { useApp } from '../store/AppStore';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/academy', label: 'Academy', icon: GraduationCap },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const { cartCount } = useApp();
  return (
    <nav
      aria-label="Hauptnavigation"
      className="relative z-40 shrink-0 border-t border-mist-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="flex">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `tap relative flex flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2 ${
                isActive ? 'text-royal-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 h-[3px] w-9 rounded-b-full bg-royal-600" aria-hidden />
                )}
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 2} aria-hidden />
                  {to === '/shop' && cartCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-royal-600 px-1 text-[9.5px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
