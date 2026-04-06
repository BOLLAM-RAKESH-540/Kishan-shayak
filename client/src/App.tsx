import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import Dashboard from './pages/Dashboard';
import FarmProfile from './pages/FarmProfile';
import Resources from './pages/Resources';
import Expenses from './pages/Expenses';
import MarketPrices from './pages/MarketPrices';
import Schemes from './pages/Schemes';
import CropInfo from './pages/CropInfo';
import Experts from './pages/Experts';
import Helpline from './pages/Helpline';
import Chatbot from './pages/Chatbot';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import VehicleTracker from './pages/VehicleTracker';
import Rentals from './pages/Rentals';
import Husbandry from './pages/Husbandry';
import Layout from './components/layout/Layout';
import Diseases from './pages/Diseases';
import Shops from './pages/Shops';
import WasteUtilization from './pages/WasteUtilization';
import MachineryTrade from './pages/MachineryTrade';
import SoilTesting from './pages/SoilTesting';
import CropTimeline from './pages/CropTimeline';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes (with Sidebar via Layout) */}
        <Route element={<Layout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/resources" element={<Resources />} />
           <Route path="/rentals" element={<Rentals />} />
           <Route path="/husbandry" element={<Husbandry />} />
           <Route path="/expenses" element={<Expenses />} />
           <Route path="/farm-profile" element={<FarmProfile />} />
           <Route path="/vehicles" element={<VehicleTracker />} />
           <Route path="/weather" element={<Weather />} />
           <Route path="/market-prices" element={<MarketPrices />} />
           <Route path="/diseases" element={<Diseases />} />
           <Route path="/schemes" element={<Schemes />} />
           <Route path="/crops" element={<CropInfo />} />
           <Route path="/experts" element={<Experts />} />
           <Route path="/help" element={<Helpline />} />
           <Route path="/chat" element={<Chatbot />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/waste-utilization" element={<WasteUtilization />} />
           <Route path="/machinery-trade" element={<MachineryTrade />} />
           <Route path="/soil-testing" element={<SoilTesting />} />

           {/* Crop Timeline — full feature */}
           <Route path="/crop-timeline" element={<CropTimeline />} />

           {/* /shops route now registered */}
           <Route path="/shops" element={<Shops />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;