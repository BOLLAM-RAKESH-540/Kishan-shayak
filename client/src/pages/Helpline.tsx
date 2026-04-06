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
      
      {/* 📞 MODERN HELPLINE HEADER */}
      <div className="h-[40vh] relative overflow-hidden flex items-center justify-center bg-indigo-900">
        <img 
          src="/images/modules/helpline_local.png" 
          alt="Modern Helpline Support" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/40 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
           <div className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-xl animate-fade-in">
              <Shield size={14} className="fill-current" /> 24x7 Farmer Protection
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none tracking-tighter max-w-2xl">
              Modern <br />
              <span className="text-indigo-400">Helpline Portal.</span>
           </h1>
           <p className="text-gray-100 text-xl font-medium max-w-xl mb-10 leading-relaxed drop-shadow-sm">
             Professional agricultural support at your fingertips. 
             Connecting you with experts and emergency services instantly.
           </p>
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