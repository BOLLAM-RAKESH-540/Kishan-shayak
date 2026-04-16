import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/utils/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { usePageTitle } from './hooks/usePageTitle';
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
import Financials from './pages/Financials';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import Community from './pages/Community';

// Inner component so usePageTitle can use router context
function AppRoutes() {
  usePageTitle();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes (with Sidebar via Layout) */}
        <Route element={<Layout />}>
          <Route path="/dashboard"        element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
          <Route path="/resources"        element={<ErrorBoundary><Resources /></ErrorBoundary>} />
          <Route path="/rentals"          element={<ErrorBoundary><Rentals /></ErrorBoundary>} />
          <Route path="/husbandry"        element={<ErrorBoundary><Husbandry /></ErrorBoundary>} />
          <Route path="/expenses"         element={<ErrorBoundary><Expenses /></ErrorBoundary>} />
          <Route path="/farm-profile"     element={<ErrorBoundary><FarmProfile /></ErrorBoundary>} />
          <Route path="/vehicles"         element={<ErrorBoundary><VehicleTracker /></ErrorBoundary>} />
          <Route path="/weather"          element={<ErrorBoundary><Weather /></ErrorBoundary>} />
          <Route path="/market-prices"    element={<ErrorBoundary><MarketPrices /></ErrorBoundary>} />
          <Route path="/diseases"         element={<ErrorBoundary><Diseases /></ErrorBoundary>} />
          <Route path="/schemes"          element={<ErrorBoundary><Schemes /></ErrorBoundary>} />
          <Route path="/crops"            element={<ErrorBoundary><CropInfo /></ErrorBoundary>} />
          <Route path="/experts"          element={<ErrorBoundary><Experts /></ErrorBoundary>} />
          <Route path="/help"             element={<ErrorBoundary><Helpline /></ErrorBoundary>} />
          <Route path="/chat"             element={<ErrorBoundary><Chatbot /></ErrorBoundary>} />
          <Route path="/profile"          element={<ErrorBoundary><Profile /></ErrorBoundary>} />
          <Route path="/waste-utilization" element={<ErrorBoundary><WasteUtilization /></ErrorBoundary>} />
          <Route path="/machinery-trade"  element={<ErrorBoundary><MachineryTrade /></ErrorBoundary>} />
          <Route path="/soil-testing"     element={<ErrorBoundary><SoilTesting /></ErrorBoundary>} />
          <Route path="/crop-timeline"    element={<ErrorBoundary><CropTimeline /></ErrorBoundary>} />
          <Route path="/shops"            element={<ErrorBoundary><Shops /></ErrorBoundary>} />
          <Route path="/financials"       element={<ErrorBoundary><Financials /></ErrorBoundary>} />
          <Route path="/community"        element={<ErrorBoundary><Community /></ErrorBoundary>} />
        </Route>
        
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global toast notification system */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;