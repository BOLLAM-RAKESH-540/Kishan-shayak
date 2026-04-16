import { useState, useEffect } from 'react';
import { WifiOff, X } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Wait a bit before hiding to show "Back Online" message
      setTimeout(() => setShow(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShow(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // If already offline at load
    if (!navigator.onLine) setShow(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 transform ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className={`flex items-center justify-center gap-3 px-4 py-3 shadow-lg ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      } text-white`}>
        {isOnline ? (
          <span className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            ✅ You are back online! Refreshing data...
          </span>
        ) : (
          <>
            <WifiOff size={18} className="animate-pulse" />
            <span className="text-sm font-black uppercase tracking-widest leading-none">
              Internet Connection Lost. You are viewing cached data.
            </span>
          </>
        )}
        <button 
          onClick={() => setShow(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default OfflineBanner;
