import { Link, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home',      path: '/dashboard',   icon: '🏠' },
    { label: 'My Farm',   path: '/farm-profile', icon: '🌾' },
    { label: 'Expenses',  path: '/expenses',     icon: '💸' },
    { label: 'Krishi',    path: '/community',    icon: '🤝' },
    { label: 'Profile',   path: '/profile',      icon: '👤' },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl flex items-center justify-around px-2 z-[100]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl transition-all ${
              isActive 
                ? 'bg-green-50 text-green-600 scale-110' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl drop-shadow-sm">{item.icon}</span>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
               {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
