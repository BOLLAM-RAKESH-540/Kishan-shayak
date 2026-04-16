import { useLocation, useNavigate, Link } from 'react-router-dom';

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const phoneNumber = user.phoneNumber || 'User';

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  // Extract page title from route
  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Kisan Sahayak';
    if (path === '/farm-profile') return 'My Farm';
    if (path === '/expenses') return 'Expenses';
    if (path === '/crop-timeline') return 'Timeline';
    if (path === '/diseases') return 'Disease Guide';
    if (path === '/shops') return 'Shops';
    if (path === '/market-prices') return 'Market Prices';
    if (path === '/husbandry') return 'Husbandry';
    if (path === '/rentals') return 'Machinery Hire';
    if (path === '/vehicles') return 'Work Vehicles';
    if (path === '/machinery-trade') return 'Machinery Trade';
    if (path === '/crops') return 'Crop Varieties';
    if (path === '/schemes') return 'Government Schemes';
    if (path === '/soil-testing') return 'Soil Testing';
    if (path === '/experts') return 'Experts';
    if (path === '/help') return 'Helpline';
    if (path === '/financials') return 'Financials';
    if (path === '/profile') return 'Account';
    return 'Kisan Sahayak';
  };

  return (
    <header className="md:hidden sticky top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-4 flex items-center justify-between z-[60] shadow-sm">
      <div className="flex items-center gap-2">
        {!isDashboard && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors mr-1"
          >
            {/* Lucide ArrowLeft replaced with Emoji */}
            <span className="text-xl">⬅️</span>
          </button>
        )}
        
        {isDashboard && (
          <div className="w-9 h-9 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center mr-1">
            <img
              src="/icons/farm.png"
              alt="Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
        
        <h1 className={`${isDashboard ? 'text-lg font-black' : 'text-base font-extrabold uppercase tracking-tight'} text-gray-800`}>
          {getPageTitle(location.pathname)}
        </h1>
      </div>
      
      <Link 
        to="/profile" 
        className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700 font-black text-xs uppercase shadow-sm active:bg-green-100 transition-colors overflow-hidden"
      >
        {user.profileImage ? (
          <img 
            src={(import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:3000/api`).replace('/api', '') + '/' + user.profileImage} 
            alt="P" 
            className="w-full h-full object-cover" 
          />
        ) : (
          phoneNumber.charAt(0)
        )}
      </Link>
    </header>
  );
};

export default MobileHeader;
