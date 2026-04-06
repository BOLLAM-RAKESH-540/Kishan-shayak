import { Droplets, Sun, Wheat, Star, ArrowRight, ShieldCheck } from 'lucide-react';

const CropInfo = () => {
  const crops = [
    { name: "Rice (Paddy)", season: "Kharif & Rabi", water: "High", duration: "120-150 Days", image: "/crops/paddy.png", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Cotton", season: "Kharif", water: "Medium", duration: "150-180 Days", image: "/crops/cotton.png", color: "text-gray-600", bg: "bg-gray-50" },
    { name: "Red Chilli", season: "Kharif", water: "Medium", duration: "200-210 Days", image: "/crops/chilli.png", color: "text-red-600", bg: "bg-red-50" },
    { name: "Maize", season: "All Seasons", water: "Low", duration: "90-110 Days", image: "/crops/maize.png", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-0 bg-white min-h-screen">
      
      {/* 🌾 CINEMATIC CROP GALLERY HEADER */}
      <div className="h-[50vh] relative overflow-hidden flex items-center justify-center">
        <img 
          src="/images/modules/crops.png" 
          alt="Crop Varieties" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 text-center sm:text-left">
           <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-xl animate-fade-in">
              <Star size={14} className="fill-current" /> Expert Crop Knowledge Bank
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter">
              Discover <br />
              <span className="text-green-400">Crop Varieties.</span>
           </h1>
           <p className="text-gray-100 text-xl font-medium max-w-xl mb-10 leading-relaxed shadow-sm">
             A complete scientific guide to growing Bharat's most vital crops. 
             From seed selection to harvest management.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20">
        
        <div className="flex items-center justify-between mb-16">
           <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                 <div className="p-3 bg-green-100 text-green-700 rounded-2xl">
                    <Wheat size={32} />
                 </div>
                 Major Seasonal Crops
              </h2>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 ml-1">Explore Scientific Farming Guides</p>
           </div>
           <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 font-black text-xs">
              <ShieldCheck size={16} /> Verified Research
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {crops.map((crop, index) => (
            <div key={index} className="group relative bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row h-full md:h-80">
              
              {/* Image Section */}
              <div className="w-full md:w-5/12 h-64 md:h-full relative overflow-hidden">
                <img 
                  src={crop.image} 
                  alt={crop.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:hidden"></div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-7/12 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tighter group-hover:text-green-600 transition-colors">
                    {crop.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Season</span>
                       <div className="flex items-center gap-1.5 font-black text-gray-800 tracking-tight">
                          <Sun size={14} className="text-orange-500" />
                          {crop.season}
                       </div>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Water Need</span>
                       <div className="flex items-center gap-1.5 font-black text-gray-800 tracking-tight">
                          <Droplets size={14} className="text-blue-500" />
                          {crop.water}
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                     <span className="bg-red-50 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-100 uppercase">Stem Borer</span>
                     <span className="bg-red-50 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-100 uppercase">Leaf Folder</span>
                  </div>
                </div>

                <button className="mt-8 bg-gray-50 group-hover:bg-green-600 text-gray-400 group-hover:text-white py-4 px-6 rounded-2xl flex items-center justify-between font-black text-xs tracking-widest transition-all shadow-sm border border-gray-100 group-hover:border-green-600">
                  <span>UNFOLD GUIDE</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropInfo;