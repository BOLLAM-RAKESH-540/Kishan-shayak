import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2 } from 'lucide-react';
import { apiService } from '../../services/api'; 
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Sending login data:", formData);

      const res = await apiService.auth.login(formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      
      toast.success(`Welcome back, ${res.data.user.name}!`);
      console.log("Login Successful! Redirecting to Dashboard...");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || 'Invalid Mobile Number or Password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6 text-green-600">
          <Sprout size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Farmer Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="phoneInput" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input 
              id="phoneInput"
              name="phoneNumber"
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter your mobile number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-green-600 font-bold hover:underline focus:outline-none"
              >
                Forgot Password?
              </Link>
            </div>
            <input 
              id="passwordInput"
              name="password"
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md active:transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Logging in...
              </>
            ) : (
              'Login to Account'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-bold uppercase tracking-widest text-[10px]">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button 
             type="button"
             onClick={() => toast.success('Google Login Simulator: Plug in your Client ID to activate!')}
             className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition font-bold text-sm text-gray-700"
           >
             <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
             Google
           </button>
           <button 
             type="button"
             onClick={() => toast.success('Apple Login Simulator: Plug in your Apple Developer Keys to activate!')}
             className="flex items-center justify-center gap-2 py-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition font-bold text-sm text-gray-700"
           >
             <span className="text-xl -mt-1">🍎</span>
             Apple
           </button>
        </div>

        <p className="text-center mt-8 text-gray-600 text-sm font-medium">
          New Farmer? <Link to="/register" className="text-green-600 font-black hover:underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;