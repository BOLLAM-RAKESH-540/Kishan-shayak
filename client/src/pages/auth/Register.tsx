import React, { useState } from 'react';
import { Sprout, Phone, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Connect to Backend API
      await axios.post('http://localhost:3000/api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      alert('Registration Failed. Phone number might already exist.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-farm-green">
        
        <div className="text-center mb-8">
          <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-farm-green" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join the Kisan Sahayak family</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                name="name"
                type="text" 
                placeholder="Rakesh Kumar"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                name="phoneNumber"
                type="text" 
                placeholder="9876543210"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                name="password"
                type="password" 
                placeholder="Create a password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-farm-green hover:bg-green-800 text-white font-bold py-3 rounded-lg flex items-center justify-center transition duration-300"
          >
            Register <ArrowRight className="ml-2 w-5 h-5" />
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-farm-green font-bold hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;