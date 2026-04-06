import React, { useEffect, useState } from 'react';
import { User, Phone, MapPin, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the shape of our User data
interface UserProfile {
  name: string;
  phoneNumber: string; // Matches what the backend sends
  location: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State to store user data
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    phoneNumber: '',
    location: '',
  });

  // 1. Fetch Profile Data on Page Load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // If no token, kick them back to login
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }, // Send the token!
        });

        // Update state with backend data
        setProfile({
          name: res.data.name,
          phoneNumber: res.data.phoneNumber || res.data.phone, // Handle both just in case
          location: res.data.location || '',
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Optional: fail silently or show error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear(); // Wipe all data
    navigate('/login');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Profile...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-green-100 p-4 rounded-full">
            <User className="text-green-600" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500">Farmer Account</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* NAME FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={profile.name}
                  readOnly // Make it uneditable if you want
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* PHONE NUMBER FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={profile.phoneNumber}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* LOCATION FIELD (Editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter your village/mandal"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="button" 
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={() => alert("Save functionality can be added here!")}
            >
              <Save size={20} className="mr-2" />
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;