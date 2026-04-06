import { useState } from 'react';
import { 
  Sun, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Wind,
  ShieldCheck,
  Star,
  ArrowRight
} from 'lucide-react';

const SoilTesting = () => {
  // Sample Soil Report Data
  const [soilData] = useState({
    village: "Khed City",
    sampleId: "SHC-9021-X",
    date: "24 Mar 2026",
    parameters: [
      { name: "pH Level", value: 6.8, unit: "pH", status: "Neutral", color: "text-green-600", bg: "bg-green-50", icon: <Wind size={20} /> },
      { name: "Nitrogen (N)", value: 240, unit: "kg/ha", status: "Medium", color: "text-blue-600", bg: "bg-blue-50", icon: <Zap size={20} /> },
      { name: "Phosphorus (P)", value: 18, unit: "kg/ha", status: "Low", color: "text-orange-600", bg: "bg-orange-50", icon: <TrendingUp size={20} /> },
      { name: "Potassium (K)", value: 310, unit: "kg/ha", status: "High", color: "text-indigo-600", bg: "bg-indigo-50", icon: <Sun size={20} /> },
    ]
  });

  // Sample Crop Suitability Data
  const crops = [
    { name: "Rice (Paddy)", suitability: 95, reason: "Soil pH and Nitrogen are perfect for high-yield grains.", image: "/crops/paddy.png" },
    { name: "Maize (Corn)", suitability: 88, reason: "Good Potassium levels support strong stalk growth.", image: "/crops/maize.png" },
    { name: "Cotton", suitability: 65, reason: "Requires higher Phosphorus; add 20kg DAP to improve.", image: "/crops/cotton.png" },
    { name: "Red Chilli", suitability: 42, reason: "Soil is too alkaline for peak chilli capsaicin.", image: "/crops/chilli.png" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* 🔬 SCIENTIFIC LAB HEADER */}
      <div className="h-[55vh] relative overflow-hidden flex items-center justify-center">
        <img 
          src="/images/modules/soil.png" 
          alt="Soil Testing Lab" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-950/40 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
           <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 animate-fade-in shadow-xl">
              <Star size={12} className="fill-current" /> Certified Agri-Lab Facility
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter max-w-2xl">
              Understand Your <br />
              <span className="text-green-400">Soil Science.</span>
           </h1>
           <p className="text-gray-200 text-xl font-medium max-w-xl mb-10 leading-relaxed shadow-sm">
             Analyze Ph, NPK, and micronutrients at the cellular level. 
             Get expert laboratory insights to double your crop yield.
           </p>
           
           <div className="flex flex-wrap gap-4">
              <button className="bg-white text-green-900 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-green-50 transition transform hover:-translate-y-1">
                 View Latest Report
              </button>
              <button className="bg-green-600/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-600/40 transition">
                 Book New Test
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">
        
        {/* 📑 DIGITAL SOIL HEALTH CARD */}
        <div className="mb-24">
           <div className="flex items-center justify-between mb-12">
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                    <div className="p-3 bg-green-100 text-green-700 rounded-2xl">
                       <FileText size={32} />
                    </div>
                    Soil Health Card
                 </h2>
                 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 ml-1">Sample ID: {soilData.sampleId} • Last Tested: {soilData.date}</p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 font-black text-xs uppercase">
                 <ShieldCheck size={18} /> Lab Verified Report
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {soilData.parameters.map((param, i) => (
                <div key={i} className={`${param.bg} rounded-[2.5rem] p-8 border border-white shadow-sm transition-transform hover:scale-105 duration-300`}>
                   <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl bg-white shadow-sm ${param.color}`}>
                         {param.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/60 border border-white/80 ${param.color}`}>
                         {param.status}
                      </span>
                   </div>
                   <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">{param.name}</p>
                   <h3 className={`text-4xl font-black ${param.color}`}>{param.value} <span className="text-sm opacity-60">{param.unit}</span></h3>
                   
                   <div className="mt-8 h-2 w-full bg-white/40 rounded-full overflow-hidden">
                      <div 
                         className={`h-full ${param.color.replace('text', 'bg')} rounded-full shadow-inner`} 
                         style={{ width: `${(param.value / (param.name === 'pH Level' ? 14 : 400)) * 100}%` }}
                      ></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* 🌾 CROP COMPATIBILITY RECOMMENDATIONS */}
        <div>
           <div className="mb-12">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                 <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
                    <CheckCircle size={32} />
                 </div>
                 Suitable Crop Recommendations
              </h2>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 ml-1">Based on Laboratory Analysis of {soilData.village}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {crops.map((crop, i) => (
                <div key={i} className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                   <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-green-500/20 transition-all">
                      <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-800 mb-2">{crop.name}</h3>
                   
                   <div className="mb-4">
                      <div className="flex items-center justify-center gap-1 mb-1">
                         <span className={`text-3xl font-black ${crop.suitability > 80 ? 'text-green-600' : crop.suitability > 60 ? 'text-orange-600' : 'text-red-600'}`}>
                            {crop.suitability}%
                         </span>
                         <span className="text-gray-400 font-bold text-xs uppercase">Match</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mx-auto">
                         <div 
                           className={`h-full ${crop.suitability > 80 ? 'bg-green-500' : crop.suitability > 60 ? 'bg-orange-500' : 'bg-red-500'}`} 
                           style={{ width: `${crop.suitability}%` }}
                         ></div>
                      </div>
                   </div>

                   <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed italic px-2">
                     "{crop.reason}"
                   </p>

                   <button className="mt-auto w-full py-4 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-green-600 group-hover:text-white font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2">
                      VIEW FULL GUIDE <ArrowRight size={16} />
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* 🏛️ LAB PARTNERSHIP */}
        <div className="mt-24 p-12 bg-gray-50 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-12 border border-gray-100">
           <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Official Laboratory Partnership</h2>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                 All tests are performed at ISO-certified labs by expert agricultural scientists. 
                 Accuracy is guaranteed for your peace of mind.
              </p>
           </div>
           <div className="flex gap-4">
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center grayscale opacity-60">
                 <p className="font-black text-gray-400 tracking-widest uppercase text-xs">Agri-Lab India</p>
              </div>
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center grayscale opacity-60">
                 <p className="font-black text-gray-400 tracking-widest uppercase text-xs">Scientific Bharat</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// HELPER COMPONENTS
const Zap = ({ size, className = "" }: { size: number, className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 L13 2 Z" />
   </svg>
);

export default SoilTesting;
