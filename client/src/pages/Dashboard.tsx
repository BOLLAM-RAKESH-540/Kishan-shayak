import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WeatherCard from '../components/weather/WeatherCard';
import { apiService } from '../services/api';
// Lucide icons removed

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Farmer';

  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({ totalFarms: 0, totalExpenses: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const farmRes = await apiService.farms.getAll();
        const expRes = await apiService.expenses.getAll();
        const totalExp = expRes.data.reduce(
          (acc: number, curr: any) => acc + curr.amount, 0
        );
        setSummary({ totalFarms: farmRes.data.length, totalExpenses: totalExp });
      } catch (err) {
        console.error('Dashboard stats error:', err);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    { title: '1. My Farm',                  path: '/farm-profile',     bg: 'bg-green-50/50',   border: 'border-green-200/50',  keywords: 'crops, farm, my farm',                                           bgImage: '/images/modules/my_farm.png',       iconImage: '/icons/farm.png' },
    { title: '2. Expenses & Calculations',  path: '/expenses',         bg: 'bg-red-50/50',     border: 'border-red-200/50',    keywords: 'expenses, money, calculation, cost',                             bgImage: '/images/modules/expenses.png',      iconImage: '/icons/expenses.png' },
    { title: '3. Crop Timeline',            path: '/crop-timeline',    bg: 'bg-blue-50/50',    border: 'border-blue-200/50',   keywords: 'timeline, calendar, history',                                    bgImage: '/images/modules/crop_timeline.png', iconImage: '/icons/timeline.png' },
    { title: '4. Growth & Disease Guide',   path: '/diseases',         bg: 'bg-rose-50/50',    border: 'border-rose-200/50',   keywords: 'disease, growth, guide, pest',                                   bgImage: '/images/modules/disease.png',       iconImage: '/icons/disease.png' },
    { title: '5. Fertilizer Shops',         path: '/shops',            bg: 'bg-purple-50/50',  border: 'border-purple-200/50', keywords: 'fertilizer, shop, government, society',                          bgImage: '/images/modules/shops.png',         iconImage: '/icons/shops.png' },
    { title: '6. Market Prices',            path: '/market-prices',    bg: 'bg-sky-50/50',     border: 'border-sky-200/50',    keywords: 'market, price, mandi',                                           bgImage: '/images/modules/market.png',        iconImage: '/icons/market.png' },
    { title: '7. Animal Husbandry',         path: '/husbandry',        bg: 'bg-amber-50/50',   border: 'border-amber-200/50',  keywords: 'animal, husbandry, cow, livestock',                              bgImage: '/images/modules/husbandry.png',     iconImage: '/icons/husbandry.png' },
    { title: '8. Waste Utilization',        path: '/waste-utilization',bg: 'bg-lime-50/50',    border: 'border-lime-200/50',   keywords: 'waste, utilization, recycle',                                    bgImage: '/images/modules/waste.png',         iconImage: '/icons/waste.png' },
    { title: '9. Work Vehicles',            path: '/vehicles',         bg: 'bg-cyan-50/50',    border: 'border-cyan-200/50',   keywords: 'vehicle, work, transport, tractor, hire, machinery',             bgImage: '/images/modules/vehicles.png',      iconImage: '/icons/vehicles.png' },
    { title: '10. Hire Machinery',          path: '/rentals',          bg: 'bg-orange-50/50',  border: 'border-orange-200/50', keywords: 'hire, machinery, tractor, rent, harvester, jcb, drone',          bgImage: '/images/modules/rentals.png',       iconImage: '/icons/hire_machinery.png' },
    { title: '11. Machinery Trade',         path: '/machinery-trade',  bg: 'bg-indigo-50/50',  border: 'border-indigo-200/50', keywords: 'machinery, trade, buy, sell, tractor, used, second hand',        bgImage: '/images/modules/trade.png',         iconImage: '/icons/showroom.png' },
    { title: '12. Crop Varieties',          path: '/crops',            bg: 'bg-teal-50/50',    border: 'border-teal-200/50',   keywords: 'crop, variety, seeds, paddy, cotton, chilli, maize, varieties',  bgImage: '/images/modules/crops.png',         iconImage: '/icons/farm.png' },
    { title: '13. Government Schemes',      path: '/schemes',          bg: 'bg-indigo-50/50',  border: 'border-indigo-200/50', keywords: 'government, scheme, yojana',                                     bgImage: '/images/modules/schemes.png',       iconImage: '/icons/schemes.png' },
    { title: '14. Soil Testing',            path: '/soil-testing',     bg: 'bg-green-50/50',   border: 'border-green-200/50',  keywords: 'soil, testing, analysis, lab, health, card, npk, ph',           bgImage: '/images/modules/soil.png',          iconImage: '/icons/soil_lab.png' },
    { title: '15. Experts',                 path: '/experts',          bg: 'bg-blue-50/80',    border: 'border-blue-200/50',   keywords: 'expert, advice, yield, scientist, wisdom, traditional, guidance', bgImage: '/images/modules/experts.png',      iconImage: '/icons/experts.png' },
    { title: '16. Helpline',                path: '/help',             bg: 'bg-indigo-50/80',  border: 'border-indigo-200/50', keywords: 'helpline, support, call, emergency, assistance, contact',        bgImage: '/images/modules/helpline_local.png',iconImage: '/icons/helpline.png' },
  ];

  const filtered = menuItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 min-h-screen transition-colors">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/50">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Namaste, {userName}! 🙏
          </h1>
          <p className="text-gray-700 font-medium mt-1">Ready for a fruitful day farming?</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-green-100/50 min-w-[120px] flex flex-col justify-center items-center">
            <p className="text-[10px] uppercase font-bold text-gray-500">My Farms</p>
            <p className="text-2xl font-black text-green-700">{summary.totalFarms}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-red-100/50 min-w-[120px] flex flex-col justify-center items-center">
            <p className="text-[10px] uppercase font-bold text-gray-500">Total Spend</p>
            <p className="text-2xl font-black text-red-600">
              ₹{summary.totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <div className="absolute left-5 top-5 text-gray-500 z-10 text-xl">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search services (e.g. 'Tractor', 'Loan')..."
          className="w-full pl-16 pr-6 py-5 border border-white/40 rounded-3xl bg-white/70 backdrop-blur-lg shadow-sm text-lg text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-green-500/30 outline-none transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Weather */}
      <div className="mb-10">
        <WeatherCard />
      </div>

      {/* All Services */}
      <div className="bg-white/40 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-white/50 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 grayscale opacity-70">
            📂
          </div>
          All Services
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item: any, index) => (
            <Link
              key={index}
              to={item.path}
              className="group flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image area with centered icon */}
              <div className="relative h-40 overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                {/* Background Full-bleed Image */}
                {item.bgImage && (
                  <>
                    <img
                      src={item.bgImage}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </>
                )}
                
                {/* Centered Glassmorphic Icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                  <img 
                    src={item.iconImage} 
                    alt="icon" 
                    className="w-10 h-10 object-contain drop-shadow-sm"
                  />
                </div>
              </div>

              {/* Module Name below image */}
              <div className={`px-4 py-3 flex items-center justify-center border-t border-gray-100 bg-white`}>
                <span className="text-xs font-bold text-center text-gray-700 group-hover:text-green-700 transition-colors leading-tight line-clamp-2">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;