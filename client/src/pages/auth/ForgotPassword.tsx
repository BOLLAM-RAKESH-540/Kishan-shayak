import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import axios from 'axios';

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
      await axios.post('http://localhost:3000/api/auth/forgot-password-otp', { phoneNumber });
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
      await axios.post('http://localhost:3000/api/auth/reset-password', { 
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <Link to="/login" className="flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="flex justify-center mb-4 text-green-600">
          <Sprout size={44} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          {step === 1 ? "Enter your mobile to get a reset code." : "Verify OTP and set a new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <input 
              type="text" required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter Mobile Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button disabled={loading} type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input 
              type="text" required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input 
              type="password" required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button disabled={loading} type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;