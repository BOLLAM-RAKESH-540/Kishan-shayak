import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

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
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. The Sidebar stays fixed on the left */}
      <Sidebar />
      
      {/* 2. The Main Content Area */}
      <main className="flex-1 ml-64 p-0"> {/* Changed p-8 to p-0 for better full-width control in modules */}
        <div className="max-w-7xl mx-auto">
          {/* 👇 Child components like Expenses, Dashboard, etc. render here */}
          <Outlet context={{ phoneNumber: user.phoneNumber }} /> 
        </div>
      </main>
    </div>
  );
};

export default Layout;