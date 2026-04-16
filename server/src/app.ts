import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth.routes';
import farmRoutes from './routes/farm.routes';
import marketRoutes from './routes/market.routes';
import vehicleRoutes from './routes/vehicle.routes';
import shopRoutes from './routes/shop.routes';
import rentalRoutes from './routes/rentals.routes';
import diseaseRoutes from './routes/disease.routes';
import expenseRoutes from './routes/expenseRoutes';
import husbandryRoutes from './routes/husbandry.routes';
import weatherRoutes from './routes/weather.routes';
import analyticsRoutes from './routes/analytics.routes';
import communityRoutes from './routes/community.routes';
import chatbotRoutes from './routes/chatbot.routes';
import agricultureRoutes from './routes/agriculture.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// 🚀 Performance & Security Hardening
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// 🛡️ Global Rate Limiting (1000 requests per 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: { message: "Too many requests, please try again after 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Auth
app.use('/api/auth', authRoutes);

// Farm
app.use('/api/farms', farmRoutes);

// Market & Shops
app.use('/api/market', marketRoutes);
app.use('/api/shops', shopRoutes);

// Vehicles & Rentals
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rentals', rentalRoutes);

// Diseases
app.use('/api/diseases', diseaseRoutes);

// ✅ FIX 1: Expenses route now registered
app.use('/api/expenses', expenseRoutes);

// ✅ FIX 3: Weather Proxy with Caching
app.use('/api/weather', weatherRoutes);

// ✅ FIX 2: Husbandry route now registered
app.use('/api/husbandry', husbandryRoutes);

// ✅ FIX 4: Analytics Engine (Phase 3)
app.use('/api/analytics', analyticsRoutes);

// ✅ PHASE 4: Community & Chat & Agriculture
app.use('/api/community', communityRoutes);
app.use('/api/bot', chatbotRoutes);
app.use('/api/agri', agricultureRoutes);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (_req, res) => {
  res.send('Kisan Sahayak API is Running ✅');
});

// 🔴 Error Handling (Must be last)
app.use(errorMiddleware);

export default app;