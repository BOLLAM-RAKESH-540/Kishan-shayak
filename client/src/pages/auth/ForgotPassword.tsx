import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import { apiService } from '../../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: OTP & New Password
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP from backend
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.auth.forgotPasswordOtp(phoneNumber);
      alert('OTP sent to your mobile! 📱');
      setStep(2);
    } catch (error) {
      alert('Mobile number not found or error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.auth.resetPassword({ 
        phoneNumber, 
        otp, 
        newPassword 
      });
      alert('Password updated successfully! Please login. 🌾');
      navigate('/login');
    } catch (error) {
      alert('Invalid OTP or reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-24 -left-24 bg-green-200 filter blur-3xl opacity-20 h-64 w-64 rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 bg-green-500 filter blur-3xl opacity-10 h-64 w-64 rounded-full"></div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-green-100/50 w-full max-w-md border border-white relative z-10">
        <Link to="/login" className="flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-green-700 mb-8 group transition-colors inline-flex">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="flex justify-center mb-6 text-green-600">
          <div className="p-4 bg-green-50 rounded-3xl border border-green-100 shadow-inner">
             <Sprout size={48} strokeWidth={2.5} />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight mb-2">Reset Password</h2>
        <p className="text-sm font-medium text-gray-500 text-center mb-10 leading-relaxed">
          {step === 1 ? "Enter your registered mobile number to get a security code." : "Enter the 6-digit code we sent via SMS."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1">Registered Mobile</label>
              <input 
                type="text" required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all disabled:bg-gray-300 disabled:shadow-none hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
              {loading ? "📡 Sending OTP..." : "Continue to Reset ➡️"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1">Verification Code</label>
              <input 
                type="text" required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 tracking-[0.5em] text-center text-xl"
                placeholder="######"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-400 ml-1">New Secure Password</label>
              <input 
                type="password" required
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all disabled:bg-gray-300 disabled:shadow-none hover:-translate-y-0.5 active:scale-95">
              {loading ? "🔄 Updating..." : "Finalize Reset 🔓"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;