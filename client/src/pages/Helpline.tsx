import { PhoneCall, AlertTriangle, Shield, Clock, Info } from 'lucide-react';

const Helpline = () => {
  const categories = [
    {
      title: "Emergency Support",
      icon: <AlertTriangle className="text-red-600" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      items: [
        { name: "Kisan Call Center (KCC)", desc: "Toll Free - 24x7 Support", number: "1800-180-1551", type: "emergency" },
        { name: "Ambulance / Medical", desc: "For Snake Bites & Emergencies", number: "108", type: "emergency" }
      ]
    },
    {
      title: "Scheme Information",
      icon: <Info className="text-blue-600" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      items: [
        { name: "Rythu Bandhu Helpdesk", desc: "For scheme related issues", number: "040-23383596", type: "info" },
        { name: "PM-Kisan Helpline", desc: "Payment & Registry Info", number: "155261", type: "info" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* ── Premium Header Banner ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-indigo-100 overflow-hidden mb-8 mt-8 mx-8 max-w-7xl lg:mx-auto">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
             <img 
               src="/images/modules/helpline_final.png" 
               alt="Modern Helpline Support" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-indigo-900/10"></div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                     Helpline Portal
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">24/7 Professional Farmer Support</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 font-black text-xs uppercase">
                   <Shield size={18} /> Verified Support
                </div>
             </div>
             <p className="text-sm text-gray-600 max-w-xl font-medium leading-relaxed">
               Connecting you with agricultural experts and emergency services instantly. Professional assistance for schemes, medical emergencies, and technical queries.
             </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {categories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className={`p-3 rounded-xl ${category.bgColor} border ${category.borderColor}`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.items.map((item, i) => (
                  <div key={i} className="group relative bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                          {item.type === 'emergency' && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-md ring-1 ring-red-200">Critical</span>}
                        </div>
                        <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                          <Clock size={14} /> {item.desc}
                        </p>
                      </div>
                      <a 
                        href={`tel:${item.number.replace(/-/g, '')}`} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                          item.type === 'emergency' 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        <PhoneCall size={18} /> {item.number}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* 🆘 EMERGENCY INFO CARD */}
        <div className="mt-16 p-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl shadow-2xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                    <AlertTriangle size={48} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black tracking-tighter mb-2">Medical Emergency or Accident?</h3>
                    <p className="text-red-50 font-medium opacity-90 max-w-md">Immediate medical assistance is just a call away. Trust the national 108 ambulance network for all life-threatening situations.</p>
                 </div>
              </div>
              <a href="tel:108" className="bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-50 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 whitespace-nowrap">
                 Call 108 Now
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Helpline;