import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { apiService } from '../../services/api'; // 🟢 Updated: Use your new central API service

const Login = () => {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Sending login data:", formData);

      // 🟢 Updated: Using apiService instead of raw axios
      const res = await apiService.auth.login(formData);
      
      // 🟢 CRUCIAL: Dashboard.tsx expects a 'user' object and a 'token'
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      
      // Also keeping these for backward compatibility if needed elsewhere
      localStorage.setItem('userId', res.data.user.id); 
      localStorage.setItem('userName', res.data.user.name);

      console.log("Login Successful! Redirecting to Dashboard...");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error:", error);
      // Better error feedback
      const message = error.response?.data?.message || 'Invalid Mobile Number or Password';
      alert(message);
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

          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md active:transform active:scale-95">
            Login to Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          New Farmer? <Link to="/register" className="text-green-600 font-bold hover:underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;