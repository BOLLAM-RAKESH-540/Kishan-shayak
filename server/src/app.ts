import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import farmRoutes from './routes/farm.routes';
import marketRoutes from './routes/market.routes';
import vehicleRoutes from './routes/vehicle.routes';
import shopRoutes from './routes/shop.routes';
import rentalRoutes from './routes/rentals.routes';
import diseaseRoutes from './routes/disease.routes';

// ✅ FIX 1 & 2: Previously missing — expenses and husbandry routes now mounted
import expenseRoutes from './routes/expenseRoutes';
import husbandryRoutes from './routes/husbandry.routes';

const app = express();

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173',
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

// ✅ FIX 2: Husbandry route now registered
app.use('/api/husbandry', husbandryRoutes);

app.get('/', (_req, res) => {
  res.send('Kisan Sahayak API is Running ✅');
});

export default app;