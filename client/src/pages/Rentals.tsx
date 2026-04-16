import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Search, 
  X, 
  Tractor, 
  Truck, 
  Droplets,
  Construction,
  Trash2,
  CheckCircle,
  Zap,
  Tag,
  TrendingUp
} from 'lucide-react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';
import { Loader2 } from 'lucide-react';

const Rentals = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleName: '',
    type: 'Tractor',
    pricePerHour: '',
    location: '',
    contactPhone: ''
  });

  // 🎨 MASTER ASSET LOGIC: Returns specialized machinery icons/colors
  const getVehicleAssets = (vehicle: any) => {
    const searchText = (vehicle.vehicleName + " " + (vehicle.type || "")).toLowerCase();

    if (searchText.includes('harvester')) {
      return {
        icon: <Zap size={22} className="text-orange-600" />,
        color: "bg-orange-50 text-orange-700 border-orange-200",
        defaultImg: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=800&auto=format&fit=crop"
      };
    }
    if (searchText.includes('truck') || searchText.includes('lorry')) {
      return {
        icon: <Truck size={22} className="text-blue-600" />,
        color: "bg-blue-50 text-blue-700 border-blue-200",
        defaultImg: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop"
      };
    }
    if (searchText.includes('drone') || searchText.includes('sprayer')) {
      return {
        icon: <Droplets size={22} className="text-cyan-600" />,
        color: "bg-cyan-50 text-cyan-700 border-cyan-200",
        defaultImg: "https://images.unsplash.com/photo-1625246333195-5848c4286ae7?q=80&w=800&auto=format&fit=crop"
      };
    }
    if (searchText.includes('jcb') || searchText.includes('excavator')) {
      return {
        icon: <Construction size={22} className="text-yellow-600" />,
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        defaultImg: "https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=800&auto=format&fit=crop"
      };
    }
    return {
      icon: <Tractor size={22} className="text-red-600" />,
      color: "bg-red-50 text-red-700 border-red-200",
      defaultImg: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop"
    };
  };

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = await apiService.rentals.getAll();
      setVehicles(res.data);
    } catch (error) {
      console.error("Error fetching rentals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-600" size={64} />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.rentals.create(formData);
      toast.success("Machinery Listed Successfully in Bazaar! 🚜");
      setShowForm(false);
      setFormData({ vehicleName: '', type: 'Tractor', pricePerHour: '', location: '', contactPhone: '' });
      fetchRentals();
    } catch (error) {
      toast.error("Failed to list in Bazaar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this machinery listing from Bazaar?")) return;
    try {
      await apiService.rentals.delete(id.toString());
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      toast.error("Failed to delete.");
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* ── Premium Header Banner ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-red-100 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
             <img 
               src="/images/modules/rentals.png" 
               alt="Machinery Bazaar" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-red-900/10"></div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                     Machinery Bazaar
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Direct Farmer-to-Farmer Rentals</p>
                </div>
                <button 
                  onClick={() => setShowForm(true)} 
                  className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition transform flex items-center gap-2"
                >
                  <span>➕</span> List Machine
                </button>
             </div>
             <p className="text-sm text-gray-600 max-w-xl font-medium leading-relaxed mb-4">
               The direct Mandi for your farm equipment. Rent tractors, harvesters, and drones from your fellow farmers at the best local rates.
             </p>
             <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 font-black text-xs w-fit">
                <TrendingUp size={16} /> Direct Farmer Deal
             </div>
          </div>
        </div>
      </div>

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="max-w-4xl mx-auto mb-12">
          <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={26} />
              <input 
                type="text"
                placeholder="Search by Machine or Location (e.g. 'JCB', 'Harvester')..."
                className="w-full pl-16 pr-6 py-6 bg-white rounded-3xl shadow-lg border-2 border-transparent focus:border-red-300 outline-none font-bold text-gray-700 text-xl transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* 🏗️ BAZAAR LISTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              title="Bazaar is Empty" 
              description="No machinery is currently listed in your area. Be the first one to list your equipment!"
              actionLabel="List Machine"
              actionLink="#" // This can be handled by clicking the header button
              icon={<Tractor size={64} />}
            />
          </div>
        ) : (
          vehicles
          .filter(v => (v.vehicleName + v.type + v.location).toLowerCase().includes(searchTerm.toLowerCase()))
          .map((vehicle) => {
            const assets = getVehicleAssets(vehicle);
            return (
              <div key={vehicle.id} className="bg-white rounded-[2rem] shadow-sm border-2 border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group relative">
                
                {/* Image Section */}
                <div className="h-56 w-full relative bg-gray-100 overflow-hidden">
                  <img 
                    src={assets.defaultImg} 
                    alt={vehicle.vehicleName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                    {assets.icon}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-white font-black text-xl shadow-lg border border-white/20">
                     <span className="text-sm">₹</span>{vehicle.pricePerHour}<span className="text-[10px] text-gray-400 ml-1">/HR</span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                       <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none truncate pr-4">{vehicle.vehicleName}</h3>
                       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${assets.color}`}>
                          {vehicle.type}
                       </span>
                    </div>

                    <div className="space-y-2 mb-6">
                       <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                          <MapPin size={16} className="text-red-500" />
                          <span>{vehicle.location}</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-400 text-xs font-black">
                          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                             <CheckCircle size={12} />
                          </div>
                          <span>OWNER: {vehicle.user?.name || "Verified Farmer"}</span>
                       </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t-2 border-gray-50 flex gap-3">
                     <button 
                        onClick={() => handleCall(vehicle.contactPhone)}
                        className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-red-100"
                      >
                        <Phone size={20} /> CONTACT
                      </button>
                      <button 
                        onClick={() => handleDelete(vehicle.id)}
                        className="bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-600 aspect-square w-14 rounded-2xl flex items-center justify-center transition shadow-sm border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={20} />
                      </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-3xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
              <X size={32} />
            </button>
            
            <div className="mb-8">
               <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Bazaar Listing 📑</h2>
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">List your machinery for local rental</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Machine Name</label>
                <input type="text" placeholder="e.g. Swaraj 744 XT" className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-red-500 outline-none font-bold" 
                  value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Machine Category</label>
                <select className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-red-500 outline-none font-bold cursor-pointer"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Tractor">🚜 Tractor</option>
                  <option value="Harvester">🌾 Combine Harvester</option>
                  <option value="JCB">🚧 JCB / Excavator</option>
                  <option value="Drone">🛰️ Drone Sprayer</option>
                  <option value="Truck">🚛 Farm Truck</option>
                  <option value="Others">⚙️ Rotavator / Implements</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Location / Village</label>
                <input type="text" placeholder="e.g. Rampur" className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-red-500 outline-none font-bold"
                   value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div className="space-y-1 text-red-600">
                <label className="text-[10px] font-black text-red-300 uppercase ml-1">Price per Hour (₹)</label>
                <input type="number" placeholder="₹" className="w-full p-4 rounded-2xl border-2 border-red-50 bg-red-50 focus:border-red-500 outline-none font-black text-2xl"
                   value={formData.pricePerHour} onChange={e => setFormData({...formData, pricePerHour: e.target.value})} required />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Your Mobile Number</label>
                <input type="tel" placeholder="Mobile Number" className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-red-500 outline-none font-bold"
                   value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} required />
              </div>
              <button className="md:col-span-2 bg-black text-white py-5 rounded-2xl font-black text-xl hover:bg-red-600 transition-all shadow-xl shadow-gray-200 mt-4 flex items-center justify-center gap-3">
                <Tag size={24} /> POST IN BAZAAR
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rentals;