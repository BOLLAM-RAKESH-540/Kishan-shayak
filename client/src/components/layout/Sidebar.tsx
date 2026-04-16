import { Link, useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const phoneNumber = user.phoneNumber || user.phone || 'User';

  const getImageUrl = (path: string) => {
    if (!path) return null;
    const apiURL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:3000/api`;
    const baseURL = apiURL.replace('/api', '');
    return `${baseURL}/${path}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home',                                  path: '/dashboard',        icon: '🏠' },
    { label: '1. My Farm',                            path: '/farm-profile',     icon: '/icons/farm.png', bgImage: '/images/modules/my_farm.png' },
    { label: '2. Expenses & Calculations',            path: '/expenses',         icon: '/icons/expenses.png', bgImage: '/images/modules/expenses.png' },
    { label: '3. Crop Timeline',                      path: '/crop-timeline',    icon: '/icons/weather.png', bgImage: '/images/modules/crop_timeline.png' },
    { label: '4. Growth & Disease Guide',             path: '/diseases',         icon: '/icons/disease.png', bgImage: '/images/modules/disease.png' },
    { label: '5. Fertilizer Shops',                   path: '/shops',            icon: '/icons/shops.png', bgImage: '/images/modules/shops.png' },
    { label: '6. Market Prices',                      path: '/market-prices',    icon: '/icons/market.png', bgImage: '/images/modules/market.png' },
    { label: '7. Animal Husbandry',                   path: '/husbandry',        icon: '/icons/husbandry.png', bgImage: '/images/modules/husbandry.png' },
    { label: '8. Waste Utilization',                  path: '/waste-utilization',icon: '/icons/waste.png', bgImage: '/images/modules/waste.png' },
    { label: '9. Work Vehicles',                      path: '/vehicles',         icon: '/icons/vehicles.png', bgImage: '/images/modules/vehicles.png' },
    { label: '10. Hire Machinery',                    path: '/rentals',          icon: '/icons/hire_machinery.png', bgImage: '/images/modules/rentals.png' },
    { label: '11. Machinery Trade',                   path: '/machinery-trade',  icon: '/icons/showroom.png', bgImage: '/images/modules/trade.png' },
    { label: '12. Crop Varieties',                    path: '/crops',            icon: '/icons/farm.png', bgImage: '/images/modules/crops.png' },
    { label: '13. Government Schemes',                path: '/schemes',          icon: '/icons/schemes.png', bgImage: '/images/modules/schemes.png' },
    { label: '14. Soil Testing',                      path: '/soil-testing',     icon: '/icons/soil_lab.png', bgImage: '/images/modules/soil.png' },
    { label: '15. Experts',                           path: '/experts',          icon: '/icons/helpline.png', bgImage: '/images/modules/experts.png' },
    { label: '16. Helpline',                          path: '/help',             icon: '/icons/helpline.png', bgImage: '/images/modules/helpline_final.png' },
    { label: 'Weather',                               path: '/weather',          icon: '/icons/weather.png', bgImage: '/images/modules/weather.png' },
    { label: '17. Financial Intelligence',            path: '/financials',       icon: '📊', bgImage: '/images/modules/expenses.png' },
    { label: '18. Krishi Connect',                    path: '/community',        icon: '🤳', bgImage: '/images/modules/my_farm.png' },
  ];

  return (
    <div className="hidden md:flex w-64 h-screen bg-white shadow-2xl border-r border-gray-100 fixed left-0 top-0 flex-col z-50">

      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
        <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center shadow-inner">
          <img
            src="/icons/farm.png"
            alt="Kisan Sahayak"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 leading-none">Kisan Sahayak</h1>
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar bg-gray-50/10">
        {menuItems.map((item: any) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex flex-col h-28 overflow-hidden rounded-2xl transition-all duration-300 border bg-white ${
                isActive
                  ? 'border-green-400 shadow-lg ring-1 ring-green-400 -translate-y-1'
                  : 'border-gray-200 hover:border-gray-300 shadow-sm hover:-translate-y-1'
              }`}
            >
              <div className="h-16 w-full relative overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                {item.bgImage ? (
                  <>
                     <img 
                       src={item.bgImage} 
                       alt={item.label} 
                       className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                     />
                     <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-green-500/10' : 'bg-black/10 group-hover:bg-transparent'}`}></div>
                     
                     {/* Icon overlay removed per request - EXCEPT FOR HOME */}
                     {item.label === 'Home' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 flex items-center justify-center shadow-xl">
                                <span className="text-xl">{item.icon}</span>
                            </div>
                        </div>
                     )}
                  </>
                ) : (
                  <div className="w-full h-full bg-green-50/50 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-xl border border-green-100 flex items-center justify-center shadow-sm">
                       <span className="text-xl">{item.icon}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`flex-1 flex items-center justify-center px-1 border-t leading-[1.1] ${isActive ? 'bg-green-50 border-green-100' : 'bg-white border-gray-50'}`}>
                <p className={`text-[9px] font-black text-center uppercase tracking-tighter transition-colors ${isActive ? 'text-green-800' : 'text-gray-900 group-hover:text-green-700'}`}>
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
        <div className="px-2">
           <LanguageSwitcher />
        </div>

        <Link to="/profile" className="flex items-center gap-3 px-3 py-3 hover:bg-green-50 rounded-2xl transition group border-2 border-transparent hover:border-green-100">
          <div className="w-10 h-10 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 text-green-700 font-black text-sm group-hover:bg-green-100 overflow-hidden shadow-inner uppercase">
            {user.profileImage ? (
              <img src={getImageUrl(user.profileImage) || ''} alt="Me" className="w-full h-full object-cover" />
            ) : (
              phoneNumber.charAt(0)
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-gray-900 truncate group-hover:text-green-800 tracking-tighter uppercase leading-none mb-1">
               {user.name || 'Account Settings'}
            </p>
            <p className="text-[9px] text-green-600 font-black uppercase tracking-widest leading-none">● Profile View</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 bg-red-50/50 hover:bg-red-50 rounded-2xl transition group border border-red-100/50"
        >
          <span className="text-lg group-active:scale-90 transition-transform">🚪</span>
          <span className="font-black text-xs uppercase tracking-widest">Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;