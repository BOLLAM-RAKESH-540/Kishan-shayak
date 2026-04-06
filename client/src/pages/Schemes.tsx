import React, { useState } from 'react';
import { Landmark, ArrowRight, Search, FileText, CheckCircle, ExternalLink } from 'lucide-react';

const Schemes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'CENTRAL' | 'STATE'>('CENTRAL');
  const [selectedScheme, setSelectedScheme] = useState<any>(null); // For Application Modal

  const schemes = [
    // CENTRAL SCHEMES
    {
      id: 1,
      type: 'CENTRAL',
      title: "PM Kisan Samman Nidhi",
      dept: "Ministry of Agriculture",
      amount: "₹6,000 / year",
      desc: "Financial support of ₹6,000 per year for all landholding farmers' families."
    },
    {
      id: 2,
      type: 'CENTRAL',
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      dept: "Central Govt",
      amount: "Crop Insurance",
      desc: "Insurance coverage and financial support in the event of failure of any of the notified crops."
    },
    {
      id: 3,
      type: 'CENTRAL',
      title: "Kisan Credit Card (KCC)",
      dept: "RBI / Govt",
      amount: "Low Interest Loan",
      desc: "Short term credit for crops and term loans for agriculture needs."
    },
    // STATE SCHEMES (Telangana Demo)
    {
      id: 4,
      type: 'STATE',
      title: "Rythu Bandhu",
      dept: "Telangana Govt",
      amount: "₹10,000 / acre",
      desc: "Investment support for agriculture and horticulture crops by way of grant."
    },
    {
      id: 5,
      type: 'STATE',
      title: "Rythu Bima",
      dept: "Telangana Govt",
      amount: "₹5 Lakh Insurance",
      desc: "Life insurance scheme for all farmers in the state."
    },
    {
      id: 6,
      type: 'STATE',
      title: "Farm Mechanization Scheme",
      dept: "Agriculture Dept",
      amount: "50% Subsidy",
      desc: "Subsidy on tractors, rotavators, and other farm machinery."
    }
  ];

  // Handle Application Submit (Mock)
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Application submitted successfully for ${selectedScheme?.title}! ✅`);
    setSelectedScheme(null);
  };

  const filteredSchemes = schemes.filter(scheme => 
    scheme.type === activeTab &&
    (scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     scheme.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    // 🟢 FULL WIDTH CONTAINER
    <div className="p-8 bg-white/85 backdrop-blur-sm min-h-screen">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Landmark className="text-yellow-600" size={32} /> Government Schemes
          </h1>
          <p className="text-gray-500">Find subsidies and financial aid eligible for you</p>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative mb-8 max-w-lg">
        <div className="absolute left-3 top-3 text-gray-400">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Search schemes (e.g. Loan, Insurance)..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🏛️ TABS: Central vs State */}
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('CENTRAL')} 
          className={`pb-3 px-4 font-bold transition-all text-lg flex items-center gap-2 ${activeTab === 'CENTRAL' ? 'text-orange-600 border-b-4 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          🇮🇳 Central Govt
        </button>
        <button 
          onClick={() => setActiveTab('STATE')} 
          className={`pb-3 px-4 font-bold transition-all text-lg flex items-center gap-2 ${activeTab === 'STATE' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          📍 State Govt
        </button>
      </div>

      {/* 🟢 FULL WIDTH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredSchemes.length === 0 ? (
           <p className="col-span-full text-center text-gray-400 py-10">No schemes found in this category.</p>
        ) : (
          filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group flex flex-col h-full relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${scheme.type === 'CENTRAL' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'} transition`}>
                  <FileText size={24} />
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {scheme.amount}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{scheme.title}</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3">{scheme.dept}</p>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-1">{scheme.desc}</p>
              
              {/* Action Buttons */}
              <div className="mt-auto flex gap-3">
                <button className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition text-sm">
                  Details <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => setSelectedScheme(scheme)}
                  className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition text-sm text-white shadow-sm ${scheme.type === 'CENTRAL' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Apply Now <ExternalLink size={16} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 📝 APPLICATION MODAL */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Apply for {selectedScheme.title}</h3>
            <p className="text-gray-500 text-sm mb-6">Please confirm your details to proceed.</p>
            
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name</label>
                <input required type="text" defaultValue="Rakesh Farmer" className="w-full p-3 border rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                <input required type="text" placeholder="XXXX-XXXX-XXXX" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passbook / Land ID</label>
                <input required type="text" placeholder="Pattadar Passbook No." className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setSelectedScheme(null)} className="flex-1 py-3 rounded-lg border border-gray-300 font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Schemes;