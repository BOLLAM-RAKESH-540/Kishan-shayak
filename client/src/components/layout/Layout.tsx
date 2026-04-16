import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import DesktopBreadcrumb from './DesktopBreadcrumb';
import OfflineBanner from '../common/OfflineBanner';

const Layout = () => {
  const navigate = useNavigate();
  
  // 🟢 Get user data from localStorage
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString || '{}');

  useEffect(() => {
    // 🔴 Redirect to login if no user or no phone number found
    // This protects all your routes (Expenses, Farms, etc.)
    if (!userString || !user.phoneNumber) {
      console.warn("No valid user session found. Redirecting to login...");
      navigate('/login');
    }
  }, [userString, user.phoneNumber, navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pb-24 md:pb-0">
      <OfflineBanner />
      {/* 0. Mobile Top Header (Sticky) */}
      <MobileHeader />

      {/* 1. The Sidebar stays fixed on the left (Desktop only) */}
      <Sidebar />
      
      {/* 2. The Main Content Area */}
      <main className="flex-1 md:ml-64 p-0 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb for Desktop Website */}
          <DesktopBreadcrumb />
          
          {/* 👇 Child components like Expenses, Dashboard, etc. render here */}
          <Outlet context={{ phoneNumber: user.phoneNumber }} /> 
        </div>
      </main>

      {/* 3. Mobile Navigation (Bottom Bar) */}
      <MobileBottomNav />
    </div>
  );
};

export default Layout;