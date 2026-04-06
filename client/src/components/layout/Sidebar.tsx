import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const phoneNumber = user.phoneNumber || user.phone || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: 'Home',                                  path: '/dashboard',        icon: '/icons/farm.png' },
    { label: '1. My Farm',                            path: '/farm-profile',     icon: '/icons/farm.png', bgImage: '/images/modules/my_farm.png' },
    { label: '2. Expenses & Calc',                    path: '/expenses',         icon: '/icons/expenses.png', bgImage: '/images/modules/expenses.png' },
    { label: '3. Crop Timeline',                      path: '/crop-timeline',    icon: '/icons/weather.png', bgImage: '/images/modules/crop_timeline.png' },
    { label: '4. Growth & Disease Guide',             path: '/diseases',         icon: '/icons/disease.png', bgImage: '/images/modules/disease.png' },
    { label: '5. Shops & Govt Societies',             path: '/shops',            icon: '/icons/shops.png', bgImage: '/images/modules/shops.png' },
    { label: '6. Market Prices',                      path: '/market-prices',    icon: '/icons/market.png', bgImage: '/images/modules/market.png' },
    { label: '7. Animal Husbandry',                   path: '/husbandry',        icon: '/icons/husbandry.png', bgImage: '/images/modules/husbandry.png' },
    { label: '8. Crop Waste Utilization',             path: '/waste-utilization',icon: '/icons/waste.png', bgImage: '/images/modules/waste.png' },
    { label: '9. Work Vehicles',                      path: '/vehicles',         icon: '/icons/vehicles.png' },
    { label: '10. Hire Machinery',                    path: '/rentals',          icon: '/icons/hire_machinery.png', bgImage: '/images/modules/rentals.png' },
    { label: '11. Buy or Sell Machinery',             path: '/machinery-trade',  icon: '/icons/showroom.png', bgImage: '/images/modules/trade.png' },
    { label: '12. Crop Varieties',                    path: '/crops',            icon: '/icons/farm.png', bgImage: '/images/modules/crops.png' },
    { label: '13. Government Schemes',                path: '/schemes',          icon: '/icons/schemes.png', bgImage: '/images/modules/schemes.png' },
    { label: '14. Soil Testing',                      path: '/soil-testing',     icon: '/icons/soil_lab.png', bgImage: '/images/modules/soil.png' },
    { label: '15. Experts',                           path: '/experts',          icon: '/icons/helpline.png' },
    { label: '16. Helpline',                          path: '/help',             icon: '/images/modules/helpline_local.png', bgImage: '/images/modules/helpline_local.png' },
    { label: 'Weather',                               path: '/weather',          icon: '/icons/weather.png', bgImage: '/images/modules/weather.png' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col z-50">

      {/* Logo */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-11 h-11 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center">
          <img
            src="/icons/farm.png"
            alt="Kisan Sahayak"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Kisan Sahayak</h1>
          <p className="text-xs text-gray-500">Farmer's Best Friend</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar content-start">
        {menuItems.map((item: any) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col overflow-hidden rounded-xl transition-all duration-200 border bg-white ${
                isActive
                  ? 'border-green-300 shadow-md transform scale-[1.02]'
                  : 'border-gray-100 hover:border-gray-300 shadow-sm hover:-translate-y-0.5'
              }`}
            >
              <div className="h-[4.5rem] w-full relative overflow-hidden flex items-center justify-center bg-gray-50 group-hover:bg-gray-100">
                {item.bgImage ? (
                  <>
                     <img src={item.bgImage} alt={item.label} className={`w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-105' : 'hover:scale-105'}`} />
                     <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-green-500/10' : 'bg-black/5 hover:bg-transparent'}`}></div>
                  </>
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm border border-gray-100">
                    <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" loading="lazy" />
                  </div>
                )}
              </div>
              
              <div className={`flex-1 p-2 flex items-center justify-center border-t ${isActive ? 'bg-green-50 border-green-100' : 'bg-white border-gray-50'}`}>
                <span className={`text-[10px] text-center font-bold leading-tight line-clamp-2 ${isActive ? 'text-green-800' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0 text-green-700 font-bold text-sm">
            {phoneNumber.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-700 truncate">{phoneNumber}</p>
            <p className="text-[10px] text-green-600 font-medium">● Logged In</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;