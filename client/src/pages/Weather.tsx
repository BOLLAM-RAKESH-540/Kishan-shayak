import WeatherCard from '../components/weather/WeatherCard';
import { Info } from 'lucide-react';

const Weather = () => {
  return (
    // 🟢 CONTAINER: Full height + scrolling enabled
    <div className="p-8 bg-white/85 backdrop-blur-sm min-h-screen overflow-y-auto">
      
      {/* ── Premium Header Banner ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
             <img 
               src="/images/modules/weather.png" 
               alt="Weather Forecast" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-blue-900/10"></div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                     Weather Hub
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Real-time Forecasts & Farm Alerts</p>
                </div>
             </div>
             <p className="text-sm text-gray-600 max-w-xl font-medium leading-relaxed">
               Get hyper-local weather updates and 7-day forecasts tailored for your farm location. Plan your irrigation and harvesting with precision.
             </p>
          </div>
        </div>
      </div>
Line 19:
      {/* 🟢 FULL WIDTH CARD WRAPPER */}
      <div className="w-full"> 
        <WeatherCard />
      </div>
Line 22:
      {/* Helpful Tip */}
      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-3 text-blue-800 text-sm w-full font-medium">
        <Info className="flex-shrink-0 text-blue-600" size={24} />
        <p>
          <span className="font-black uppercase text-[10px] tracking-widest block mb-1">Pro Tip</span>
          Weather data is updated in real-time. If you see "Locating...", please allow GPS permissions in your browser for hyper-local accuracy.
        </p>
      </div>

    </div>
  );
};

export default Weather;