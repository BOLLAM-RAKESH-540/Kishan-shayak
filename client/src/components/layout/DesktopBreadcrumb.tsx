import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home, ChevronLeft } from 'lucide-react';

const DesktopBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show on dashboard
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    return null;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap: Record<string, string> = {
    'dashboard': 'Home',
    'farm-profile': 'My Farm',
    'expenses': 'Expenses',
    'crop-timeline': 'Crop Timeline',
    'diseases': 'Diseases',
    'shops': 'Shops',
    'market-prices': 'Market Prices',
    'husbandry': 'Husbandry',
    'waste-utilization': 'Waste Utilization',
    'vehicles': 'Vehicles',
    'rentals': 'Rentals',
    'machinery-trade': 'Machinery',
    'crops': 'Crops',
    'schemes': 'Schemes',
    'soil-testing': 'Soil testing',
    'experts': 'Experts',
    'help': 'Helpline',
    'weather': 'Weather',
    'profile': 'Profile',
    'financials': 'Financials',
    'community': 'Community',
    'resources': 'Resources'
  };

  return (
    <div className="hidden md:flex items-center px-8 pt-6 pb-2">
      <nav className="flex items-center gap-1">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mr-4 flex items-center gap-2 text-gray-400 hover:text-green-700 transition-all group"
          title="Go Back"
        >
          <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-300 group-hover:bg-green-50 shadow-sm transition-all group-active:scale-90">
            <ChevronLeft size={16} />
          </div>
        </button>

        {/* Dashboard Link */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-1.5 text-gray-500 hover:text-green-700 font-bold transition-all text-sm group"
        >
          <Home size={14} className="group-hover:scale-110 transition-transform" />
          <span>Home</span>
        </Link>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = breadcrumbMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <div key={to} className="flex items-center gap-1">
              <ChevronRight size={14} className="text-gray-300 mx-1" />
              {last ? (
                <span className="text-green-800 font-black text-sm uppercase tracking-tight bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                  {label}
                </span>
              ) : (
                <Link 
                  to={to} 
                  className="text-gray-500 hover:text-green-700 font-bold transition-all text-sm"
                >
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default DesktopBreadcrumb;
