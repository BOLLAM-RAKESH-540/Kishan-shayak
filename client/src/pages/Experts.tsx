import { useState } from 'react';
import { 
  Search, 
  Phone, 
  MessageCircle, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  BookOpen,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';

const Experts = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const experts = [
    { 
      id: 1, 
      name: "Dr. A. Sharma", 
      role: "Senior Soil Scientist", 
      specialization: "Bio-Fertilizers & NPK Balance", 
      scientistNote: "Use nano-urea to increase nitrogen uptake efficiency and reduce soil acidification.",
      farmerWisdom: "Traditional green manure (Dhaincha) after harvest improves soil organic carbon naturally.",
      languages: "Telugu, Hindi, English", 
      exp: "15 Years",
      phone: "9876500001",
      avatar: "👨‍🔬"
    },
    { 
      id: 2, 
      name: "B. Govinda Rao", 
      role: "Master Farmer & Traditionalist", 
      specialization: "Ancient Crop Rotation", 
      scientistNote: "Intercropping legumes with grains fixes atmospheric nitrogen in the root zone.",
      farmerWisdom: "Mix neem-cake in the soil before monsoon to prevent root-borers naturally.",
      languages: "Telugu", 
      exp: "40 Years",
      phone: "9876500002",
      avatar: "👴"
    },
    { 
      id: 3, 
      name: "Dr. K. Reddy", 
      role: "Entomologist", 
      specialization: "Pest & Disease Resistance", 
      scientistNote: "Pheromone traps are 80% more effective at early pest detection than visual surveys.",
      farmerWisdom: "Bordering with Marigold keeps away most leaf-attacking insects from the main crop.",
      languages: "Telugu, English", 
      exp: "18 Years",
      phone: "9876500003",
      avatar: "🔬"
    },
    { 
      id: 4, 
      name: "Ms. S. Verma", 
      role: "Agronomist", 
      specialization: "Precision Irrigation & Zero-Till", 
      scientistNote: "Sub-surface drip irrigation reduces water evaporation loss by nearly 35%.",
      farmerWisdom: "Mulching with old crop residue keeps the root bed cool and moist in peak summer.",
      languages: "Hindi, English", 
      exp: "12 Years",
      phone: "9876500004",
      avatar: "👩‍🌾"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* ── Premium Header Banner ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden mb-8 mt-8 mx-8 max-w-7xl lg:mx-auto">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
             <img 
               src="/images/modules/experts.png" 
               alt="Agri-Expert Knowledge Hub" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-indigo-900/10"></div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                     Agri-Expert Hub
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Scientific Research & Traditional Wisdom</p>
                </div>
                <div className="hidden md:flex flex-col items-end">
                   <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1 text-right">Global Coverage</p>
                   <p className="text-2xl font-black text-blue-600">24/7 Experts</p>
                </div>
             </div>
             <p className="text-sm text-gray-600 max-w-xl font-medium leading-relaxed">
               Bridging scientific research with traditional farming wisdom. Consult the experts to achieve record-breaking harvests and solve complex field issues.
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 w-full">
        
        {/* 🔍 SEARCH AND FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
           <div className="relative group flex-1 max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={26} />
              <input 
                type="text"
                placeholder="Search by Expert, Crop, or Scientist..."
                className="w-full pl-16 pr-6 py-6 bg-white rounded-3xl shadow-lg border-2 border-transparent focus:border-blue-300 outline-none font-bold text-gray-700 text-xl transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">Global Coverage</p>
                 <p className="text-3xl font-black text-blue-600">24/7 Experts</p>
              </div>
              <div className="h-14 w-px bg-gray-200"></div>
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm">
                       E{i}
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 🏛️ EXPERT PROFILES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experts
            .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.role.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((expert) => (
              <div key={expert.id} className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col group relative">
                
                {/* Profile Header */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-50">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-blue-100 flex items-center justify-center text-4xl shadow-inner border border-blue-50 group-hover:scale-110 transition-transform">
                      {expert.avatar}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">{expert.name}</h3>
                             <p className="text-blue-600 font-extrabold uppercase text-[10px] tracking-widest">{expert.role}</p>
                          </div>
                          <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-green-100 flex items-center gap-1 shadow-sm">
                             <ShieldCheck size={12} /> VERIFIED
                          </span>
                       </div>
                       
                       <div className="flex gap-4 mt-6">
                          <div className="flex items-center gap-1.5 text-gray-500 font-bold text-xs">
                             <Briefcase size={14} className="text-gray-400" />
                             {expert.exp} Experience
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                             <Globe size={14} />
                             {expert.languages}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Knowledge Bridge Section */}
                <div className="p-8 flex-1">
                   <div className="space-y-6">
                      <div className="relative pl-10">
                         <div className="absolute left-0 top-1 p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <Zap size={16} />
                         </div>
                         <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Scientist's Note (Modern Tech)</h4>
                         <p className="text-gray-700 font-bold leading-relaxed">{expert.scientistNote}</p>
                      </div>

                      <div className="h-px w-full bg-gray-50"></div>

                      <div className="relative pl-10">
                         <div className="absolute left-0 top-1 p-2 bg-orange-50 text-orange-600 rounded-xl">
                            <BookOpen size={16} />
                         </div>
                         <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Farmer's Wisdom (Tradition)</h4>
                         <p className="text-gray-600 font-medium italic leading-relaxed">"{expert.farmerWisdom}"</p>
                      </div>
                   </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 pt-0 flex gap-4 mt-auto">
                   <button className="flex-1 bg-black text-white py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3">
                      <MessageCircle size={22} /> CHAT NOW
                   </button>
                   <button 
                      onClick={() => window.location.href = `tel:${expert.phone}`}
                      className="w-20 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl flex items-center justify-center transition border border-gray-100 hover:border-green-200"
                   >
                      <Phone size={24} />
                   </button>
                </div>
              </div>
            ))}
        </div>

        {/* 📚 YIELD IDEAS REEL */}
        <div className="mt-24 p-12 bg-gray-900 rounded-[3.5rem] relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                 <h2 className="text-4xl font-black text-white mb-6 tracking-tighter leading-tight">
                    Maximizing Your Yield: <br />
                    <span className="text-blue-400">The expert blueprint.</span>
                 </h2>
                 <p className="text-gray-400 text-lg font-medium leading-relaxed">
                   Looking for a complete season protocol? Download our expert-vetted yield 
                   maximization guides used by progressive farmers across Bharat.
                 </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                 <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-white hover:text-blue-600 transition flex items-center justify-center gap-3">
                    <TrendingUp size={24} /> VIEW PROTOCOLS <ArrowRight size={24} />
                 </button>
              </div>
           </div>
           
           {/* Decor Icons */}
           <div className="absolute top-10 right-10 opacity-10 text-white scale-[5]">
              <Users size={48} />
           </div>
        </div>

      </div>
    </div>
  );
};

export default Experts;