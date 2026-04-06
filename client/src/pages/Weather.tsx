import React from 'react';
import WeatherCard from '../components/weather/WeatherCard';
import { CloudSun, Info } from 'lucide-react';

const Weather = () => {
  return (
    // 🟢 CONTAINER: Full height + scrolling enabled
    <div className="p-8 bg-white/85 backdrop-blur-sm min-h-screen overflow-y-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CloudSun className="text-blue-600" size={32} /> Weather Forecast
        </h1>
        <p className="text-gray-500">Real-time weather updates and 7-day forecast for your farm location.</p>
      </div>

      {/* 🟢 FULL WIDTH CARD WRAPPER */}
      {/* Removed 'max-w-3xl' to let it fill the space */}
      <div className="w-full"> 
        <WeatherCard />
      </div>

      {/* Helpful Tip */}
      <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm w-full">
        <Info className="flex-shrink-0" size={20} />
        <p>
          <strong>Tip:</strong> Weather data is updated in real-time. If you see "Locating...", please allow GPS permissions in your browser.
        </p>
      </div>

    </div>
  );
};

export default Weather;