import { Leaf, Flame, Sprout, Tractor, Lightbulb, ArrowRight, Recycle } from 'lucide-react';

const WasteUtilization = () => {
  const methods = [
    {
      title: 'Composting & Vermicompost',
      subtitle: 'Turn waste into black gold',
      icon: <Sprout className="text-green-600" size={24} />,
      bg: 'bg-green-50',
      border: 'border-green-200',
      description: 'Crop residues like paddy stalks, leaves, and husks can be processed using earthworms or natural decomposition to create highly fertile compost, reducing the need for chemical fertilizers.',
      steps: ['Chop crop waste into small pieces', 'Mix with cow dung and soil layer by layer', 'Maintain 40-50% moisture', 'Harvest compost in 45-60 days'],
    },
    {
      title: 'Animal Feed & Fodder',
      subtitle: 'Nutritious feed for livestock',
      icon: <Leaf className="text-emerald-600" size={24} />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      description: 'Maize stalks, groundnut vines, and wheat chaff are excellent sources of roughage for cattle. Treating them with urea or molasses significantly increases their nutritional value.',
      steps: ['Dry the stalks completely', 'Chaff the stalks into 1-2 inch pieces', 'Mix with 2% urea solution', 'Feed to cattle after 21 days of curing'],
    },
    {
      title: 'Biochar & Fuel Briquettes',
      subtitle: 'Eco-friendly solid fuel',
      icon: <Flame className="text-orange-600" size={24} />,
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      description: 'Cotton stalks and thick residues can be compressed into briquettes (white coal) to be used as industrial fuel, or slowly burned to create biochar which enhances soil carbon.',
      steps: ['Sun dry the stalks to reduce moisture', 'Powder the waste using a shredder', 'Compress in a briquette machine', 'Sell to local industries or use domestically'],
    },
    {
      title: 'Mulching',
      subtitle: 'Retain soil moisture naturally',
      icon: <Tractor className="text-amber-600" size={24} />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      description: 'Instead of burning straw, spread it across the field. Mulching prevents weed growth, retains soil moisture, and naturally degrades to enrich the soil with organic carbon over time.',
      steps: ['Leave 6-8 inches of stubble during harvest', 'Spread loose straw evenly across rows', 'Plant new seeds using a Happy Seeder', 'Let the mulch decompose naturally'],
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/5 h-64 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0 relative">
             <img 
               src="/icons/waste.png" 
               alt="Varied Crop Waste Leftovers" 
               className="w-full h-full object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-bold text-lg drop-shadow-md flex items-center gap-2">
                  <Recycle size={20} /> Zero Waste Farming
                </p>
             </div>
          </div>
          <div className="p-8 md:w-3/5 flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-3 flex items-center gap-3">
              Crop Waste Utilization
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Agricultural residues aren't trash—they are valuable resources. By recycling rice straw, cotton stalks, or maize husks, you can dramatically improve soil health, create animal fodder, or even generate additional income instead of polluting the air through burning.
            </p>
            <div className="flex items-center gap-3 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-100 font-medium w-fit">
              <Lightbulb className="text-blue-600" size={20} />
              Burning waste destroys soil bacteria. Reuse it to protect your land!
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-1">Effective Utilization Methods</h2>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {methods.map((method, idx) => (
          <div key={idx} className={`p-6 rounded-2xl border ${method.border} bg-white shadow-sm hover:shadow-md transition-all`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${method.bg}`}>
                {method.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{method.title}</h3>
                <p className="text-sm font-semibold text-gray-500">{method.subtitle}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {method.description}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Process Steps</h4>
              <ul className="space-y-2">
                {method.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2 text-sm text-gray-600">
                    <ArrowRight size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WasteUtilization;
