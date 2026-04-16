import { Request, Response } from 'express';
import axios from 'axios';
import { cacheService } from '../services/cache.service';

/**
 * 🌦️ Weather Controller with Redis Caching
 * Purpose: Fetch weather for a specific location and cache the result 
 * to save API quotas and speed up repeated requests.
 */
export const getWeatherData = async (req: Request, res: Response) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required.' });
  }

  const cacheKey = `weather:${lat}:${lon}`;
  
  try {
    // 1. Check Cache
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log(`[Cache] Serving weather for ${lat},${lon} from Redis.`);
      return res.json(cachedData);
    }

    // 2. Fetch from Open-Meteo
    console.log(`[API] Fetching weather from Open-Meteo for ${lat},${lon}`);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    const response = await axios.get(url);
    const data = response.data;

    // 3. Cache Result (1 hour)
    await cacheService.set(cacheKey, data, 3600);

    // 4. Return to User
    res.json(data);

  } catch (error: any) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data.', error: error.message });
  }
};
