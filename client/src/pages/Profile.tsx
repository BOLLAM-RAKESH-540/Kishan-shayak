import { useEffect, useState, useRef } from 'react';
import { User, Phone, MapPin, Save, LogOut, CheckCircle, Camera, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { apiService } from '../services/api';
import { useTitle } from '../hooks/useTitle';

interface UserProfile {
  name: string;
  phoneNumber: string;
  location: string;
  profileImage?: string;
  bio?: string;
  totalLand?: number | string;
  experienceYears?: number | string;
  role?: string;
  isVerified?: boolean;
}


const Profile = () => {
  useTitle('Profile');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    phoneNumber: '',
    location: '',
    bio: '',
    totalLand: '',
    experienceYears: '',
  });

  const [stats, setStats] = useState({
    activeCrops: 0,
    totalAcres: 0,
    harvestedCrops: 0,
    totalExpenses: 0,
    communityPosts: 0,
    communityInteractions: 0
  });

  const getBaseURL = () => {
    const apiURL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:3000/api`;
    return apiURL.replace('/api', '');
  };

  const fetchProfile = async () => {
    try {
      const res = await apiService.auth.getProfile();
      const userData = res.data;
      setProfile({
        name: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        location: userData.location || '',
        profileImage: userData.profileImage || '',
        bio: userData.bio || '',
        totalLand: userData.totalLand || '',
        experienceYears: userData.experienceYears || '',
        role: userData.role || 'FARMER',
        isVerified: userData.isVerified || false,
      });


      // Fetch Stats
      const statsRes = await apiService.farms.getSummary();
      setStats(statsRes.data);
      
      // Update local storage to keep it synced
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...userData }));
    } catch (error) {
      console.error("Error fetching profile:", error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
       toast.error('Please select an image file.');
       return;
    }
    if (file.size > 2 * 1024 * 1024) {
       toast.error('File is too large. Max 2MB.');
       return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiService.auth.uploadProfileImage(formData);
      const newImagePath = res.data.profileImage;
      setProfile(prev => ({ ...prev, profileImage: newImagePath }));
      
      // Update local storage immediately
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, profileImage: newImagePath }));
      
      setMessage('Photo updated! 📸');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!profile.profileImage) return;
    if (!window.confirm('Remove your profile picture?')) return;

    setUploading(true);
    try {
      await apiService.auth.removeProfileImage();
      setProfile(prev => ({ ...prev, profileImage: '' }));
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const { profileImage, ...userWithoutImage } = storedUser;
      localStorage.setItem('user', JSON.stringify(userWithoutImage));
      
      setMessage('Photo removed! 🗑️');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await apiService.auth.updateProfile({
        name: profile.name,
        location: profile.location,
        bio: profile.bio,
        totalLand: profile.totalLand,
        experienceYears: profile.experienceYears
      });
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ 
        ...user, 
        name: profile.name, 
        location: profile.location,
        bio: profile.bio,
        totalLand: profile.totalLand,
        experienceYears: profile.experienceYears
      }));
      
      setMessage('Profile updated successfully! ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt('Type "DELETE" to permanently remove your account and all farm data:');
    if (confirmText !== 'DELETE') {
      if (confirmText !== null) toast.error('Confirmation text mismatch.');
      return;
    }

    const toastId = toast.loading('Deleting account...');
    try {
      await apiService.auth.deleteAccount();
      toast.success('Account deleted successfully. Logging out...', { id: toastId });
      setTimeout(() => {
        localStorage.clear();
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error('Failed to delete account. try again later.', { id: toastId });
    }
  };

  if (loading) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
       <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-gray-500 font-bold">Loading your profile...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Farm Account 👤</h1>
          <p className="text-gray-500 font-medium">Manage your identity and location details.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-100 text-red-600 rounded-2xl bg-white hover:bg-red-50 transition font-black text-sm"
        >
          <LogOut size={18} /> Logout Session
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-green-100/20 border border-gray-100 overflow-hidden">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            
            {/* AVATAR WITH UPLOAD */}
            <div 
              className="group relative cursor-pointer"
              onClick={handleImageClick}
            >
               <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/30 flex items-center justify-center text-4xl shadow-xl overflow-hidden relative">
                  {profile.profileImage ? (
                    <img 
                      src={`${getBaseURL()}/${profile.profileImage}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name?.charAt(0) || '👨‍🌾'
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="text-white" size={24} />
                  </div>

                  {/* Loading Spinner */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                       <Loader2 className="text-white animate-spin" size={24} />
                    </div>
                  )}
               </div>
               
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleFileChange}
               />
               
               <div className="absolute -bottom-2 -right-2 flex gap-1">
                   <div 
                     className="bg-white text-green-600 p-2 rounded-xl shadow-lg border border-green-100 group-hover:scale-110 transition-transform"
                     onClick={(e) => { e.stopPropagation(); handleImageClick(); }}
                   >
                      <Camera size={16} strokeWidth={3} />
                   </div>
                   {profile.profileImage && (
                     <div 
                       className="bg-white text-red-500 p-2 rounded-xl shadow-lg border border-red-50 border-red-100 hover:bg-red-50 hover:scale-110 transition-transform cursor-pointer"
                       onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                     >
                        <Trash2 size={16} strokeWidth={3} />
                     </div>
                   )}
                </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black">{profile.name || 'Set your name'}</h2>
              <p className="opacity-80 font-bold text-sm uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {profile.role === 'EXPERT' ? '🏅 Agricultural Expert' 
                  : profile.role === 'ADMIN' ? '🛡️ Platform Administrator' 
                  : '🌾 Farmer Account'}
                {profile.isVerified && (
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black ml-1">✓ Verified</span>
                )}
              </p>
            </div>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* NAME FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Full Identity Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                />
              </div>
            </div>

            {/* PHONE NUMBER (Locked) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Verified Mobile (Locked)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  value={profile.phoneNumber}
                  readOnly
                  className="w-full pl-12 pr-4 py-4 bg-gray-100/50 border-2 border-gray-100 rounded-2xl cursor-not-allowed font-bold text-gray-400"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className="bg-blue-100 text-blue-600 p-1 rounded-full"><CheckCircle size={14} /></div>
                </div>
              </div>
            </div>

            {/* LOCATION FIELD */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Primary Farm Location</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Village, Mandal, District"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                />
              </div>
            </div>

            {/* BIO / ABOUT */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Professional Bio / About Me</label>
              <textarea
                placeholder="Share your agricultural expertise..."
                value={profile.bio}
                rows={3}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800 resize-none"
              />
            </div>

            {/* EXPERIENCE & LAND */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Years of Experience</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={profile.experienceYears}
                onChange={(e) => setProfile({ ...profile, experienceYears: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Total Land Owned (Acres)</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={profile.totalLand}
                onChange={(e) => setProfile({ ...profile, totalLand: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
              />
            </div>
          </div>

          {/* MODULE SUMMARY SECTIONS */}
          <div className="mb-10 space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-gray-200"></span>
              Live Module Performance
              <span className="w-8 h-px bg-gray-200"></span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Farm Stats */}
              <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100 flex flex-col items-center">
                 <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl mb-3">🌾</div>
                 <p className="text-[10px] font-black text-green-700 uppercase mb-1">My Farms</p>
                 <h4 className="text-2xl font-black text-gray-800">{stats.activeCrops} <span className="text-xs font-bold text-gray-400">Active</span></h4>
                 <p className="text-xs font-bold text-gray-500 mt-1">{stats.totalAcres} Acres Managed</p>
              </div>

              {/* Expense Stats */}
              <div className="bg-red-50/50 p-5 rounded-3xl border border-red-100 flex flex-col items-center">
                 <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl mb-3">💰</div>
                 <p className="text-[10px] font-black text-red-700 uppercase mb-1">Financials</p>
                 <h4 className="text-2xl font-black text-gray-800">₹{stats.totalExpenses.toLocaleString()}</h4>
                 <p className="text-xs font-bold text-gray-500 mt-1">Total Investment</p>
              </div>

              {/* Community Stats */}
              <div className="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100 flex flex-col items-center">
                 <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl mb-3">🤳</div>
                 <p className="text-[10px] font-black text-indigo-700 uppercase mb-1">Community</p>
                 <h4 className="text-2xl font-black text-gray-800">{stats.communityPosts} <span className="text-xs font-bold text-gray-400">Posts</span></h4>
                 <p className="text-xs font-bold text-gray-500 mt-1">{stats.communityInteractions} Interactions</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto px-10 py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Identity Profile
                </>
              )}
            </button>
            
            {message && (
              <p className="text-green-600 font-bold flex items-center gap-2 animate-bounce">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-3xl">
         <h4 className="font-black text-amber-800 text-sm mb-1 uppercase tracking-widest">Security Note 🛡️</h4>
         <p className="text-amber-700 font-medium text-sm">Your phone number is your unique ID and cannot be changed. If you need to change your number, please contact support.</p>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2rem] space-y-4">
        <div className="flex items-center gap-3 text-red-700">
           <Trash2 size={24} className="animate-bounce" />
           <h3 className="text-xl font-black uppercase tracking-tight">Danger Zone</h3>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-red-800 font-black text-sm">Delete My Entire Farmer Account</p>
            <p className="text-red-600/70 text-xs font-medium max-w-md">This will permanently erase all your farm records, expense logs, and community interactions. This action cannot be undone.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;