import { useState } from 'react';
import { 
  Search, 
  Plus, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Info,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react';

const MachineryTrade = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'used'>('new');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Data for Showroom
  const showroomData = {
    new: [
      { id: 1, name: "Mahindra 575 DI XP Plus", price: "₹6,75,000", hp: "47 HP", warranty: "6 Years", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop" },
      { id: 2, name: "Swaraj 744 XT", price: "₹7,20,000", hp: "50 HP", warranty: "6 Years", img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=800&auto=format&fit=crop" },
      { id: 3, name: "John Deere 5310", price: "₹8,50,000", hp: "55 HP", warranty: "5 Years", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop" },
    ],
    used: [
      { id: 101, name: "Swaraj 855 FE (2020)", price: "₹4,25,000", hp: "52 HP", hours: "1,200 hrs", location: "Rampur", img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop", owner: "Ramesh Sharma" },
      { id: 102, name: "Mahindra Arjun 555 (2018)", price: "₹3,80,000", hp: "50 HP", hours: "2,500 hrs", location: "Khed City", img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800&auto=format&fit=crop", owner: "Suresh Patil" },
    ]
  };

  const currentList = activeTab === 'new' ? showroomData.new : showroomData.used;
  const filteredList = currentList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* 🏛️ CINEMATIC SHOWROOM HEADER */}
      <div className="h-[60vh] relative overflow-hidden flex items-center justify-center">
        <img 
          src="/icons/showroom.png" 
          alt="Machinery Showroom" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
           <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
              <Star size={14} className="fill-current" /> Certified Machinery Showroom
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter max-w-2xl">
              The Finest <br />
              <span className="text-red-500">Agri-Machinery</span> <br />
              Collection.
           </h1>
           <p className="text-gray-300 text-xl font-medium max-w-xl mb-10 leading-relaxed">
             From factory-fresh models to certified pre-owned treasures, 
             the modern showroom for India's hardworking farmers.
           </p>
           
           <div className="flex gap-4">
              <button 
                 onClick={() => setActiveTab('new')}
                 className={`px-8 py-4 rounded-2xl font-black text-lg transition-all ${
                   activeTab === 'new' 
                   ? 'bg-white text-black scale-105 shadow-2xl' 
                   : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                 }`}
              >
                Browse New
              </button>
              <button 
                 onClick={() => setActiveTab('used')}
                 className={`px-8 py-4 rounded-2xl font-black text-lg transition-all ${
                   activeTab === 'used' 
                   ? 'bg-red-600 text-white scale-105 shadow-2xl' 
                   : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                 }`}
              >
                Pre-owned Deals
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* 🔍 SEARCH AND FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
           <div className="relative group flex-1 max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={24} />
              <input 
                type="text"
                placeholder={activeTab === 'new' ? "Search by Brand or Model..." : "Search by Village or Engine..."}
                className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:border-red-500 focus:bg-white outline-none font-bold text-gray-700 text-lg transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Active Listings</p>
                 <p className="text-3xl font-black text-red-600">
                    {activeTab === 'new' ? '50+' : '124+'}
                 </p>
              </div>
              <button className="bg-black text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-red-600 transition shadow-xl">
                 <Plus size={20} /> Sell My Machine
              </button>
           </div>
        </div>

        {/* 🏬 SHOWROOM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredList.map((item: any) => (
            <div key={item.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
              
              {/* Image Section */}
              <div className="h-72 relative overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Status Badges */}
                <div className="absolute top-6 left-6">
                   {activeTab === 'new' ? (
                      <span className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                         <Zap size={10} className="fill-current" /> Brand New
                      </span>
                   ) : (
                      <span className="bg-black text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                         <ShieldCheck size={10} /> Certified Pre-owned
                      </span>
                   )}
                </div>

                <div className="absolute bottom-6 left-6 text-white">
                   <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{item.hp}</p>
                   <h3 className="text-2xl font-black tracking-tighter">{item.name}</h3>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-black text-gray-400">Ex-Showroom Price</span>
                         <span className="text-2xl font-black text-gray-900">{item.price}*</span>
                      </div>
                      <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                         <TrendingUp size={24} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      {activeTab === 'new' ? (
                         <>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[10px] font-bold text-gray-400 uppercase">Warranty</p>
                               <p className="font-black text-gray-800 tracking-tight">{item.warranty}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[10px] font-bold text-gray-400 uppercase">Model Year</p>
                               <p className="font-black text-gray-800 tracking-tight">2024</p>
                            </div>
                         </>
                      ) : (
                         <>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[10px] font-bold text-gray-400 uppercase">Used Hrs</p>
                               <p className="font-black text-gray-800 tracking-tight">{item.hours}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[10px] font-bold text-gray-400 uppercase">Village</p>
                               <p className="font-black text-gray-800 tracking-tight">{item.location}</p>
                            </div>
                         </>
                      )}
                   </div>
                </div>

                <div className="flex gap-3 mt-auto">
                   <button className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-red-600 transition-colors shadow-lg">
                      VIEW SPECS
                   </button>
                   <button className="w-14 h-14 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition border border-gray-100">
                      <Info size={20} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 🏗️ MORE SERVICES */}
        <div className="mt-24 bg-gray-900 rounded-[3rem] p-12 overflow-hidden relative">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h2 className="text-4xl font-black text-white mb-6 tracking-tighter leading-tight">
                    Upgrade Your Farming <br />
                    With Modern Power.
                 </h2>
                 <p className="text-gray-400 text-lg font-medium leading-relaxed">
                   Looking for a specific model or need a finance quote? 
                   Our machinery experts are here to help you get the best deal for your farm.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 <button className="bg-red-600 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-red-700 flex items-center justify-center gap-2">
                    <Phone size={24} /> TALK TO EXPERT
                 </button>
                 <button className="bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-lg backdrop-blur-md hover:bg-white/20 transition flex items-center justify-center gap-2">
                    <MapPin size={24} /> FIND DEALERS
                 </button>
              </div>
           </div>
           
           {/* Abstract Circle Decor */}
           <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-red-600/10 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default MachineryTrade;
