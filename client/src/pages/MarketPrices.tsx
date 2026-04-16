import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

interface MarketData {
  crop: string;
  price: number;
  market: string;
}

// --- 1. ICON MAPPING DICTIONARY ---
// This acts as the lookup table for your icons based on the crop name.
const cropIcons: { [key: string]: string } = {
  "Tomato": "🍅",
  "Onion": "🧅",
  "Potato": "🥔",
  "Chilli": "🌶️",
  "Rice": "🌾",
  "Paddy": "🌾",
  "Wheat": "🍞",
  "Corn": "🌽",
  "Maize": "🌽",
  "Cotton": "☁️",     // Visual proxy for Cotton
  "Sugarcane": "🎋",
  "Mango": "🥭",
  "Banana": "🍌",
  "Turmeric": "🧡",   // Visual proxy (Orange heart/circle usually works for turmeric powder color)
  "default": "🌱"     // Fallback icon
};

const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await apiService.market.getPrices();
      setPrices(res.data);
    } catch (error) {
      console.error("Error fetching prices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // --- 2. HELPER FUNCTION TO GET ICON ---
  const getIcon = (cropName: string) => {
    // Returns the specific icon or the default sprout if not found
    return cropIcons[cropName] || cropIcons["default"];
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* ── Premium Header Banner ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
             <img 
               src="/images/modules/market.png" 
               alt="Live Market Prices" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-blue-900/10"></div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                     Live Market Prices
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Real-time Mandi Rates • Telangana</p>
                </div>
                <button 
                  onClick={fetchPrices} 
                  className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition transform flex items-center gap-2"
                >
                  <RefreshCw size={18} /> Refresh
                </button>
             </div>
             <p className="text-sm text-gray-600 max-w-md font-medium leading-relaxed">
               Monitor daily price fluctuations across local markets. Make informed decisions on when to sell your harvest for maximum profit.
             </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <p className="text-gray-500 text-lg">Loading market rates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 relative overflow-hidden">
              
              {/* Background watermark icon */}
              <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-gray-50 opacity-10" />

              <div className="flex justify-between items-start mb-4">
                <div>
                  {/* --- 3. UPDATED CROP NAME DISPLAY --- */}
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    {/* The Icon is displayed here, slightly larger than text */}
                    <span className="text-3xl bg-gray-50 p-1 rounded-md">{getIcon(item.crop)}</span>
                    {item.crop}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 ml-1">{item.market}</p>
                </div>
                
                <div className={`p-2 rounded-full ${index % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {index % 2 === 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">₹ {item.price}</span>
                <span className="text-sm text-gray-500 ml-2">/ Quintal</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm">
                {index % 2 === 0 ? (
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <TrendingUp size={14} /> + ₹ 120
                  </span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-1">
                    <TrendingDown size={14} /> - ₹ 45
                  </span>
                )}
                <span className="text-gray-400">vs yesterday</span>
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-xl font-bold mb-2">AI Price Prediction</h2>
          <p className="opacity-80 max-w-lg">
            Based on historical data, Cotton prices are expected to rise by 15% in the next 2 weeks. Hold your stock for better profits.
          </p>
        </div>
        <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
          View Forecast
        </button>
      </div>

    </div>
  );
};

export default MarketPrices;