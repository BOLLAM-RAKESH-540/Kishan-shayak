import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, ShieldAlert, Search } from 'lucide-react';

interface Treatment {
  id: number;
  name: string;
  type: string;
  dosage: string;
  instructions?: string;
}

interface Disease {
  id: number;
  name: string;
  symptoms: string;
  imageUrl: string;
  treatments: Treatment[];
}

// Icons8 realistic color icons CDN
const icon8 = (name: string) =>
  `https://img.icons8.com/color/96/${name}`;

const crops = [
  { name: 'Paddy',     icon: icon8('rice-bowl'),     activeBg: 'bg-green-600',  activeGlow: 'shadow-green-300' },
  { name: 'Chilli',    icon: icon8('chili-pepper'),  activeBg: 'bg-red-500',    activeGlow: 'shadow-red-300' },
  { name: 'Cotton',    icon: icon8('cotton'),         activeBg: 'bg-sky-500',    activeGlow: 'shadow-sky-300' },
  { name: 'Sugarcane', icon: icon8('sugar-cane'),     activeBg: 'bg-amber-500',  activeGlow: 'shadow-amber-300' },
  { name: 'Tomato',    icon: icon8('tomato'),         activeBg: 'bg-rose-500',   activeGlow: 'shadow-rose-300' },
];

const mockData: Record<string, Disease[]> = {
  Paddy: [
    {
      id: 101,
      name: "Rice Blast",
      symptoms: "Spindle-shaped spots with grey centers and brown margins on leaves.",
      imageUrl: "https://agritech.tnau.ac.in/agriculture/plant_prot/crop_diseases/cereals/images/rice_blast_leaf.jpg",
      treatments: [{ id: 1, name: "Tricyclazole", type: "Fungicide", dosage: "0.6g per liter", instructions: "Spray when spots first appear." }]
    },
    {
      id: 102,
      name: "Bacterial Blight",
      symptoms: "Yellow to white wavy streaks starting from leaf tips moving downwards.",
      imageUrl: "https://www.knowledgebank.irri.org/images/stories/blb-symptoms-1.jpg",
      treatments: [{ id: 2, name: "Streptocycline", type: "Antibiotic", dosage: "1g in 10 liters", instructions: "Avoid excessive Nitrogen fertilizer." }]
    }
  ],
  Chilli: [
    {
      id: 201,
      name: "Leaf Curl",
      symptoms: "Leaves curl upwards, become smaller and stunted. Common in dry weather.",
      imageUrl: "https://vikaspedia.in/agriculture/crop-production/integrated-pest-managment/ipm-for-vegetables/ipm-strategies-for-chilli/Leafcurl.jpg",
      treatments: [{ id: 3, name: "Imidacloprid", type: "Insecticide", dosage: "0.5ml per liter", instructions: "Target whiteflies on underside of leaves." }]
    }
  ],
  Cotton: [],
  Sugarcane: [],
  Tomato: [],
};

const Diseases = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDiseases();
  }, [selectedCrop]);

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/diseases/crop/${selectedCrop}`);
      const data = await response.json();
      if (data && data.diseases && data.diseases.length > 0) {
        setDiseases(data.diseases);
      } else {
        setDiseases(mockData[selectedCrop] || []);
      }
    } catch (error) {
      console.warn("API Offline, showing mock data");
      setDiseases(mockData[selectedCrop] || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiseases = diseases.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCrop = crops.find(c => c.name === selectedCrop);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-green-900 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={36} /> Disease Encyclopedia
            </h1>
            <p className="text-gray-600">Identify and treat crop infections early</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search disease..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Crop Selector Tabs — realistic icon style */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {crops.map((crop) => {
            const isActive = selectedCrop === crop.name;
            return (
              <button
                key={crop.name}
                onClick={() => setSelectedCrop(crop.name)}
                className={`flex flex-col items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-200 min-w-[90px] ${
                  isActive
                    ? `${crop.activeBg} text-white shadow-lg ${crop.activeGlow} scale-105`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Realistic crop icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? 'bg-white/20' : 'bg-gray-50'
                }`}>
                  <img
                    src={crop.icon}
                    alt={crop.name}
                    className="w-9 h-9 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://img.icons8.com/color/96/leaf';
                    }}
                  />
                </div>
                <span className="text-sm">{crop.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active crop banner */}
        {activeCrop && (
          <div className="flex items-center gap-3 mb-6 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm w-fit">
            <img
              src={activeCrop.icon}
              alt={activeCrop.name}
              className="w-8 h-8 object-contain"
            />
            <span className="font-semibold text-gray-700">
              Showing diseases for <span className="text-green-700">{selectedCrop}</span>
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Disease Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDiseases.length > 0 ? filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-all"
              >
                {/* Disease Image */}
                <div className="h-56 w-full relative group">
                  <img
                    src={disease.imageUrl}
                    alt={disease.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) =>
                      (e.currentTarget.src =
                        'https://images.unsplash.com/photo-1530836361253-efad5cb2f6de?auto=format&fit=crop&q=80&w=400')
                    }
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Infection
                  </div>
                  {/* Crop icon badge on image */}
                  {activeCrop && (
                    <div className="absolute top-4 right-4 w-9 h-9 bg-white rounded-xl shadow flex items-center justify-center">
                      <img src={activeCrop.icon} alt={selectedCrop} className="w-6 h-6 object-contain" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{disease.name}</h2>

                  {/* Symptoms */}
                  <div className="bg-red-50 p-4 rounded-2xl mb-4 border border-red-100">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase mb-2">
                      <Thermometer size={14} /> Key Symptoms
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{disease.symptoms}</p>
                  </div>

                  {/* Treatments */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase mb-3">
                      <Droplets size={14} /> Recommended Treatment
                    </div>
                    {disease.treatments.map((t) => (
                      <div key={t.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800">{t.name}</span>
                          <span className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-lg uppercase">
                            {t.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between">
                          <span>Dosage:</span>
                          <span className="text-gray-900 font-semibold">{t.dosage}</span>
                        </div>
                        {t.instructions && (
                          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg italic">
                            💡 {t.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <img
                  src={activeCrop?.icon}
                  alt={selectedCrop}
                  className="w-16 h-16 object-contain mx-auto mb-4 opacity-40"
                />
                <p className="text-gray-400 italic">No diseases found for {selectedCrop}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Diseases;