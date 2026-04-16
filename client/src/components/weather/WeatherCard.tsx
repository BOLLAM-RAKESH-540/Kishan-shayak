import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiService } from '../../services/api';

// 🖼️ SEASONAL & TIME-BASED BACKGROUNDS
const BG_IMAGES = {
  day_rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1000&auto=format&fit=crop",
  day_hot: "https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=1000&auto=format&fit=crop",
  day_pleasant: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?q=80&w=1000&auto=format&fit=crop",
  day_cloudy: "https://images.unsplash.com/photo-1534088568595-a066f4d9e12e?q=80&w=1000&auto=format&fit=crop",
  day_cold: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?q=80&w=1000&auto=format&fit=crop",
  night_rain: "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?q=80&w=1000&auto=format&fit=crop",
  night_clear: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop",
  night_cloudy: "https://images.unsplash.com/photo-1532978379173-523e16f371f2?q=80&w=1000&auto=format&fit=crop",
  night_cold: "https://images.unsplash.com/photo-1478719059408-592965723cbc?q=80&w=1000&auto=format&fit=crop",
};

const WeatherCard = () => {
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [locationName, setLocationName] = useState("Locating...");
  const [time, setTime] = useState(new Date());
  
  const isDay = time.getHours() >= 6 && time.getHours() < 18;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Cloudy';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getBackgroundImage = (condition: string, temp: number) => {
    const c = (condition || "").toLowerCase();
    if (isDay) {
      if (c.includes('rain') || c.includes('storm')) return BG_IMAGES.day_rain;
      if (c.includes('cloud') || c.includes('fog')) return BG_IMAGES.day_cloudy;
      if (temp > 30) return BG_IMAGES.day_hot;
      if (temp < 20) return BG_IMAGES.day_cold;
      return BG_IMAGES.day_pleasant;
    } else {
      if (c.includes('rain') || c.includes('storm')) return BG_IMAGES.night_rain;
      if (c.includes('cloud') || c.includes('fog')) return BG_IMAGES.night_cloudy;
      if (temp < 20) return BG_IMAGES.night_cold;
      return BG_IMAGES.night_clear;
    }
  };

  const getWorkStatus = (weather: any) => {
    if (!weather) return { suitable: true, title: "Loading...", message: "", color: "", icon: "⏳" };
    const cond = (weather.condition || "").toLowerCase();
    const wind = weather.wind || 0;
    const temp = weather.temp || 0;

    if (cond.includes('storm') || cond.includes('thunder')) {
       return { suitable: false, title: "Storm Alert", message: "Lightning risk! Stay indoors.", color: "bg-purple-600/60 border-purple-200/50 text-white", icon: "⛈️" };
    }
    if (cond.includes('rain')) {
      return { suitable: false, title: "Unsuitable for Work", message: "Rain detected. Avoid spraying/harvesting.", color: "bg-red-600/60 border-red-200/50 text-white", icon: "🌧️" };
    }
    if (wind > 20) {
      return { suitable: false, title: "High Wind Alert", message: "Strong winds. Drift hazard.", color: "bg-orange-600/60 border-orange-200/50 text-white", icon: "💨" };
    }
    if (!isDay) {
      return { suitable: false, title: "Night Safety Caution", message: "⚠️ Low visibility. Use Torch & Boots. Watch for Insects.", color: "bg-yellow-600/60 border-yellow-200/50 text-white", icon: "⚡" };
    }
    if (temp > 38) {
      return { suitable: false, title: "Extreme Heat", message: "Heatwave! Avoid noon work.", color: "bg-orange-600/60 border-orange-200/50 text-white", icon: "🌡️" };
    }
    return { suitable: true, title: "Suitable for Work", message: "Weather is good for farming.", color: "bg-green-600/60 border-green-200/50 text-white", icon: "✅" };
  };

  const getWeatherIcon = (condition: string, forceDay: boolean = false) => {
    const c = (condition || "").toLowerCase();
    if (c.includes('thunder') || c.includes('storm')) return "⛈️";
    if (c.includes('rain') || c.includes('drizzle')) return "🌧️";
    if (c.includes('snow')) return "❄️";
    if (c.includes('fog')) return "🌫️";
    if (c.includes('clear') || c.includes('sunny')) return (forceDay || isDay) ? "☀️" : "🌙";
    return (forceDay || isDay) ? "⛅" : "☁️";
  };

  // 📍 UPDATED: HIGH ACCURACY LOCATION FETCH
  const getUserLocation = () => {
    setLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      setLoading(false);
      return;
    }

    // 🟢 High Accuracy Config
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
        fetchCityName(latitude, longitude);
      },
      (error) => {
        console.error("GPS Error:", error);
        setLocationError("Please enable High-Accuracy GPS to see your farm weather.");
        setLoading(false);
      },
      geoOptions
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      // 🟢 Fallback logic for rural areas: Locality -> City -> District
      const name = res.data.locality || res.data.city || res.data.principalSubdivision || "Your Farm";
      setLocationName(name);
    } catch (err) {
      setLocationName("Unknown Location");
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await apiService.weather.get(lat, lon);
      const data = res.data;
      
      setCurrent({ 
        temp: data.current.temperature_2m, 
        humidity: data.current.relative_humidity_2m, 
        wind: data.current.wind_speed_10m, 
        condition: getWeatherDescription(data.current.weather_code) 
      });

      const daily = data.daily;
      const next7Days = daily.time.map((dateStr: string, index: number) => ({
        day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        date: new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        condition: getWeatherDescription(daily.weather_code[index])
      }));
      setForecast(next7Days);
    } catch (error) { 
      setLocationError("Failed to fetch weather data."); 
    } finally { 
      setLoading(false); 
    }
  };

  if (locationError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <span className="text-5xl mb-4">⚠️</span>
        <h3 className="text-xl font-bold text-red-700 mb-2">Location Required</h3>
        <p className="text-gray-600 mb-6 max-w-xs">{locationError}</p>
        <button onClick={getUserLocation} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition">
          <span className="text-lg">🔄</span> Retry Location
        </button>
      </div>
    );
  }

  if (loading) return (
    <div className="p-8 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center animate-pulse h-64 border border-gray-200">
      <span className="text-5xl animate-bounce mb-2">📍</span>
      <p className="text-gray-500 font-medium">Locating your farm...</p>
    </div>
  );

  const status = getWorkStatus(current);
  const bgImage = getBackgroundImage(current?.condition, current?.temp);

  return (
    <div className="space-y-6 h-full">
      <div 
        className="rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-full bg-cover bg-center transition-all duration-1000 min-h-[400px]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className={`absolute inset-0 z-0 transition-colors duration-1000 ${isDay ? 'bg-gradient-to-t from-black/80 via-black/20 to-black/10' : 'bg-gradient-to-t from-black/90 via-black/70 to-black/50'}`} />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mt-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 filter drop-shadow-md">
                <span className="text-xl">📍</span> {locationName}
                <button onClick={getUserLocation} className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors">
                   <span className="text-sm">🔄</span>
                </button>
              </h2>
              
              <div className="flex flex-col mt-1">
                <p className="text-blue-100 text-lg flex items-center gap-2 filter drop-shadow-sm font-medium">
                  <span className="text-sm">📅</span> {time.toDateString()}
                </p>
                <p className="text-3xl font-bold flex items-center gap-2 mt-1 filter drop-shadow-md">
                  <span className="text-2xl">🕒</span> 
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-md shadow-xl border border-white/20">
              {getWeatherIcon(current.condition, false)}
            </div>
          </div>

          <div className="mt-6 mb-4">
            <span className="text-7xl font-bold filter drop-shadow-lg">{Math.round(current.temp)}°C</span>
            <p className="text-2xl font-bold mt-2 flex items-center gap-2 filter drop-shadow-md text-blue-50">
              {current.condition}
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
              <span className="text-lg">💧</span>
              <span className="font-bold">{current.humidity}% Humidity</span>
            </div>
            <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-sm">
              <span className="text-lg">💨</span>
              <span className="font-bold">{current.wind} km/h Wind</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border backdrop-blur-xl flex items-center gap-4 transition-colors shadow-xl ${status.color}`}>
            <div className="p-2 bg-white/20 rounded-full">{status.icon}</div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{status.title}</h3>
              <p className="text-sm font-medium opacity-95 leading-tight mt-1">{status.message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📅</span> 7-Day Forecast
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecast.map((day, index) => (
                <div key={index} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-blue-50 transition group">
                    <span className="text-gray-500 text-sm font-bold">{day.day}</span>
                    <span className="text-xs text-gray-400 mb-2">{day.date}</span>
                    <div className="mb-2 text-blue-500 group-hover:scale-110 transition-transform">
                        {getWeatherIcon(day.condition, true)}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="font-bold text-gray-800">{day.maxTemp}°</span>
                      <span className="text-gray-400">{day.minTemp}°</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 text-center">{day.condition}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;