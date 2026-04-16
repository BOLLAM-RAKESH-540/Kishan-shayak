import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 p-6 rounded-full inline-block mb-8 text-red-600 animate-pulse">
          <AlertTriangle size={64} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Something Went Wrong!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We encountered a harvested-level bug on our server. Our team of experts is already on it. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
        >
          <RefreshCw size={22} />
          Refresh Page
        </button>
        <div className="mt-6">
          <Link to="/dashboard" className="text-red-600 font-bold hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
