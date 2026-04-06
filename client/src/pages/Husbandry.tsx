import React, { useState, useEffect } from 'react';
import { 
  Milk, Beef, MapPin, Plus, Navigation, 
  Loader2, Trash2, Check
} from 'lucide-react';
import axios from 'axios';
import { apiService } from '../services/api';

const Husbandry = () => {
  const [activeTab, setActiveTab] = useState<'LIVESTOCK' | 'MILK'>('LIVESTOCK');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userPhone = user.phoneNumber || localStorage.getItem('phoneNumber');

  const [formData, setFormData] = useState({
    species: 'Cow',
    breed: '',
    ageMonths: '',
    price: '',
    quantityLiters: 1,
    milkType: 'Cow Milk',
    address: '',
    latitude: 0,
    longitude: 0,
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=600&auto=format&fit=crop'
  });

  const fetchMyListings = async () => {
    if (!userPhone) return;
    try {
      setLoading(true);
      const res = await apiService.husbandry.getAll();
      setListings(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [userPhone]);

  const handleToggleStatus = async (id: string) => {
    try {
      await apiService.husbandry.toggle(id);
      fetchMyListings();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this listing?")) return;
    try {
      await apiService.husbandry.delete(id);
      fetchMyListings();
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setFormData(prev => ({ ...prev, address: "Locating..." }));
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          setFormData(prev => ({ 
            ...prev, 
            latitude, 
            longitude, 
            address: res.data.locality || res.data.city || "My Location" 
          }));
        } catch {
          setFormData(prev => ({ ...prev, latitude, longitude, address: "Location Pinpointed" }));
        }
      }, () => {
        alert("Please enable GPS permissions in your browser settings.");
        setFormData(prev => ({ ...prev, address: "" }));
      }, { enableHighAccuracy: true });
    }
  };

  // 🟢 ENHANCED handlePost: Prevents empty address and provides specific error feedback
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address || formData.address === "Locating...") {
      alert("Please click 'Use Current GPS Location' first to set your farm address.");
      return;
    }

    try {
      const payload = {
        userId: userPhone,
        type: activeTab,
        address: formData.address,
        latitude: parseFloat(formData.latitude.toString()),
        longitude: parseFloat(formData.longitude.toString()),
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        species: activeTab === 'LIVESTOCK' ? formData.species : null,
        breed: activeTab === 'LIVESTOCK' ? formData.breed : null,
        ageMonths: activeTab === 'LIVESTOCK' ? parseInt(formData.ageMonths) : null,
        milkType: activeTab === 'MILK' ? formData.milkType : null,
        quantityLiters: activeTab === 'MILK' ? parseFloat(formData.quantityLiters.toString()) : null,
      };

      const response = await apiService.husbandry.create(payload);
      
      if (response.data.success) {
        alert("Pashu Bazar listing published! ✅");
        setShowForm(false);
        setFormData({ ...formData, breed: '', ageMonths: '', price: '', address: '' });
        fetchMyListings();
      }
    } catch (err: any) {
      const errorDetail = err.response?.data?.error || "Check your network connection";
      alert(`Failed to post listing: ${errorDetail}`);
      console.error("Submission Error:", err.response?.data);
    }
  };

  const getFreshnessBadge = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const hoursLeft = (new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursLeft > 18) return <span className="absolute top-4 right-4 text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">Fresh</span>;
    if (hoursLeft > 0) return <span className="absolute top-4 right-4 text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">Available</span>;
    return <span className="absolute top-4 right-4 text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full border border-red-200">Expired</span>;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Beef className="text-orange-700" size={32} /> Pashu Bazaar
          </h1>
          <p className="text-gray-500">Manage your farm listings</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition shadow-lg">
          <Plus size={20} /> Sell Now
        </button>
      </div>

      <div className="flex p-1 bg-gray-200 rounded-2xl mb-8 w-full max-w-md">
        <button onClick={() => setActiveTab('LIVESTOCK')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'LIVESTOCK' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}>
          <Beef size={18} /> Animals
        </button>
        <button onClick={() => setActiveTab('MILK')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${activeTab === 'MILK' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
          <Milk size={18} /> Milk
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-bold text-gray-800">New {activeTab === 'LIVESTOCK' ? 'Animal' : 'Milk'} Listing</h3>
               <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handlePost} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Location</label>
                <button type="button" onClick={handleGetLocation} className={`w-full p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border transition ${formData.address ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                  <Navigation size={18} className={formData.address === "Locating..." ? "animate-spin" : ""} /> 
                  {formData.address || "Use Current GPS Location"}
                </button>
              </div>

              {activeTab === 'LIVESTOCK' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="p-3 bg-gray-50 border rounded-xl outline-none" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})}>
                      <option>Cow</option><option>Buffalo</option><option>Goat</option><option>Sheep</option>
                    </select>
                    <input type="text" placeholder="Breed" className="p-3 bg-gray-50 border rounded-xl outline-none" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Age (Months)" className="p-3 bg-gray-50 border rounded-xl outline-none" value={formData.ageMonths} onChange={e => setFormData({...formData, ageMonths: e.target.value})} required />
                    <input type="number" placeholder="Price (₹)" className="p-3 bg-gray-50 border rounded-xl outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="p-3 bg-gray-50 border rounded-xl outline-none" value={formData.milkType} onChange={e => setFormData({...formData, milkType: e.target.value})}>
                      <option>Cow Milk</option><option>Buffalo Milk</option>
                    </select>
                    <input type="number" placeholder="Price / Liter (₹)" className="p-3 bg-gray-50 border rounded-xl outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                </>
              )}
              <button type="submit" className={`w-full py-4 text-white rounded-2xl font-bold shadow-lg transition ${activeTab === 'LIVESTOCK' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                Publish to Bazar
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-green-600" size={48} /></div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.filter(l => l.type === activeTab).map((item) => (
            <div key={item.id} className={`bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden relative flex flex-col h-full transition-all ${!item.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}>
              {!item.isActive && (
                <div className="absolute inset-0 z-20 bg-black/10 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-xl shadow-xl border-2 border-red-500 -rotate-12">
                    <span className="text-red-600 font-black text-2xl uppercase">SOLD</span>
                  </div>
                </div>
              )}

              <div className="absolute top-3 right-3 z-30 flex gap-2">
                <button onClick={() => handleToggleStatus(item.id)} className={`p-2 rounded-full shadow-lg transition ${item.isActive ? 'bg-white text-green-600 hover:bg-green-600 hover:text-white' : 'bg-green-600 text-white hover:bg-white hover:text-green-600'}`} title={item.isActive ? "Mark as Sold" : "Relist Item"}>
                  {item.isActive ? <Check size={18} /> : <RefreshCw size={18} className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>

              {item.type === 'LIVESTOCK' ? (
                <>
                  <div className="h-52 relative">
                    <img src={item.imageUrl} alt="Animal" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{item.species}</h3>
                        <p className="text-sm text-gray-500 font-medium">{item.breed} • {item.ageMonths}m</p>
                      </div>
                      <span className="text-2xl font-black text-green-700">₹{item.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-4 font-medium"><MapPin size={14} className="text-red-500"/> {item.address}</div>
                  </div>
                </>
              ) : (
                <div className="p-8 flex flex-col h-full">
                  {getFreshnessBadge(item.expiresAt)}
                  <div className="flex items-center gap-4 mb-6 pt-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner"><Milk size={32}/></div>
                    <div><h3 className="text-xl font-bold">{item.milkType}</h3><p className="text-sm text-gray-400">{item.address}</p></div>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-4 rounded-2xl border mb-6">
                    <div className="text-center w-1/2 border-r"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty</p><p className="text-xl font-bold text-gray-800">{item.quantityLiters}L</p></div>
                    <div className="text-center w-1/2"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Price</p><p className="text-xl font-bold text-green-600">₹{item.price}/L</p></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
          <p className="text-gray-400 text-lg italic font-medium">No {activeTab.toLowerCase()} listings found for your account.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-green-600 font-bold hover:underline">+ Create your first listing</button>
        </div>
      )}
    </div>
  );
};

const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export default Husbandry;