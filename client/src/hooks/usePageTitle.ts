import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':        'Dashboard — Kisan Sahayak',
  '/farm-profile':     'My Farm — Kisan Sahayak',
  '/crop-timeline':    'Crop Timeline — Kisan Sahayak',
  '/expenses':         'Financial Manager — Kisan Sahayak',
  '/financials':       'Financial Intelligence — Kisan Sahayak',
  '/diseases':         'Crop Diseases — Kisan Sahayak',
  '/market-prices':    'Market Prices — Kisan Sahayak',
  '/crops':            'Crop Varieties — Kisan Sahayak',
  '/soil-testing':     'Soil Testing — Kisan Sahayak',
  '/waste-utilization':'Waste Utilization — Kisan Sahayak',
  '/shops':            'Fertilizer Shops — Kisan Sahayak',
  '/husbandry':        'Animal Husbandry — Kisan Sahayak',
  '/vehicles':         'Work Vehicles — Kisan Sahayak',
  '/rentals':          'Hire Machinery — Kisan Sahayak',
  '/machinery-trade':  'Machinery Trade — Kisan Sahayak',
  '/schemes':          'Govt. Schemes — Kisan Sahayak',
  '/experts':          'Expert Directory — Kisan Sahayak',
  '/help':             'Helpline — Kisan Sahayak',
  '/weather':          'Weather — Kisan Sahayak',
  '/community':        'Krishi Connect — Kisan Sahayak',
  '/chat':             'AI Assistant — Kisan Sahayak',
  '/profile':          'My Profile — Kisan Sahayak',
  '/resources':        'Resources — Kisan Sahayak',
  '/login':            'Login — Kisan Sahayak',
  '/register':         'Register — Kisan Sahayak',
};

/**
 * Automatically updates the browser tab title on every route change.
 * Place this hook at the top of App.tsx to apply globally.
 */
export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || 'Kisan Sahayak — Smart Farming Platform';
    document.title = title;
  }, [location.pathname]);
}
