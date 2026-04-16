import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  const user = localStorage.getItem('user');
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-8">
          <h1 className="text-[120px] font-black text-green-100 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass size={80} className="text-green-600 animate-spin-slow" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">You're Off the Field!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for doesn't exist. It might have been moved or harvested already.
        </p>
        <Link 
          to={isLoggedIn ? "/dashboard" : "/login"}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
        >
          {isLoggedIn ? (
            <>
              <Home size={22} />
              Back to Dashboard
            </>
          ) : (
            <>
              <Home size={22} />
              Back to Login
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
