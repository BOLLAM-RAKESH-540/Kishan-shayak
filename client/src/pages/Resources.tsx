import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Plus, Package, Building2, Search, ShieldCheck, FileText } from 'lucide-react';
import { apiService } from '../services/api';

const Resources = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('PRIVATE'); // 'PRIVATE' or 'GOVERNMENT'
  const [showForm, setShowForm] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Updated Form State to include License Number
  const [shopForm, setShopForm] = useState({ 
    name: '', 
    licenseNumber: '', // New Field
    address: '', 
    contactNumber: '', 
    type: 'PRIVATE' 
  });
  
  const [prodForm, setProdForm] = useState({ name: '', price: '', unit: 'kg' });

  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : '';

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await apiService.shops.getAll();
      setShops(res.data);
    } catch (err) {
      console.error("Error fetching shops");
    }
  };

  const handleRegisterShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.shops.create(shopForm);
      alert("Shop Registered Successfully! ✅");
      setShowForm(false);
      setShopForm({ name: '', licenseNumber: '', address: '', contactNumber: '', type: 'PRIVATE' }); // Reset
      fetchShops();
    } catch (error) {
      alert("Failed to register shop");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.shops.addProduct({ ...prodForm, shopId: selectedShopId });
      alert("Product Added!");
      setSelectedShopId(null);
      setProdForm({ name: '', price: '', unit: 'kg' });
      fetchShops();
    } catch (error) {
      alert("Failed to add product");
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesTab = shop.type === activeTab;
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.licenseNumber && shop.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())); // Search by License too
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-8 bg-white/85 backdrop-blur-sm min-h-screen">
      
      {/* ── Premium Header Banner ── */}
      <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
             <img 
               src="/images/modules/resources.png" 
               alt="Agri-Resources Hub" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-purple-900/10"></div>
          </div>
          <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
                     Agri-Resource Hub
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Verified Seeds, Fertilizers & Centers</p>
                </div>
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition transform flex items-center gap-2"
                >
                  <Plus size={20} /> Register Shop
                </button>
             </div>
             <p className="text-sm text-gray-600 max-w-xl font-medium leading-relaxed">
               Find nearby private dealers and government distribution centers. Access verified products with full licensing transparency.
             </p>
          </div>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="relative mb-8 max-w-lg">
        <div className="absolute left-3 top-3 text-gray-400">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Search by Shop Name, License No, or Location..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('PRIVATE')} 
          className={`pb-3 px-2 font-bold transition-all text-lg flex items-center gap-2 ${activeTab === 'PRIVATE' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Store size={18} /> Private Shops
        </button>
        <button 
          onClick={() => setActiveTab('GOVERNMENT')} 
          className={`pb-3 px-2 font-bold transition-all text-lg flex items-center gap-2 ${activeTab === 'GOVERNMENT' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Building2 size={18} /> Government Centers
        </button>
      </div>

      {/* Register Form */}
      {showForm && (
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 animate-fade-in mb-8 shadow-sm">
          <div className="flex justify-between items-start mb-4">
             <h3 className="font-bold text-purple-900 text-lg">Register New Shop</h3>
             <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-md font-bold">License Required</span>
          </div>
          
          <form onSubmit={handleRegisterShop} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Shop Name" className="p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setShopForm({...shopForm, name: e.target.value})} />
            
            {/* ✅ NEW LICENSE INPUT */}
            <div className="relative">
              <input required placeholder="Govt License Number (e.g. TG-12345)" className="w-full p-3 pl-10 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none uppercase" onChange={e => setShopForm({...shopForm, licenseNumber: e.target.value})} />
              <ShieldCheck className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            </div>

            <input required placeholder="Contact Number" className="p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setShopForm({...shopForm, contactNumber: e.target.value})} />
            
            <select className="p-3 rounded-lg border bg-white focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setShopForm({...shopForm, type: e.target.value})}>
              <option value="PRIVATE">Private Shop</option>
              <option value="GOVERNMENT">Government Center</option>
            </select>

            <input required placeholder="Address / Location" className="p-3 rounded-lg border md:col-span-2 focus:ring-2 focus:ring-purple-500 outline-none" onChange={e => setShopForm({...shopForm, address: e.target.value})} />
            
            <button type="submit" className="bg-purple-600 text-white p-3 rounded-lg font-bold col-span-2 hover:bg-purple-700 transition flex items-center justify-center gap-2">
              <ShieldCheck size={20}/> Submit for Verification
            </button>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {selectedShopId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl animate-scale-in">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Add Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input required placeholder="Product Name (e.g. Urea)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setProdForm({...prodForm, name: e.target.value})} />
              <div className="flex gap-3">
                <input required type="number" placeholder="Price (₹)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                <select className="p-3 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none" onChange={e => setProdForm({...prodForm, unit: e.target.value})}>
                  <option value="kg">/ kg</option>
                  <option value="bag">/ bag</option>
                  <option value="item">/ item</option>
                  <option value="liter">/ liter</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition">Save Product</button>
                <button type="button" onClick={() => setSelectedShopId(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-bold transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 SHOP LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredShops.length === 0 ? (
           <p className="col-span-full text-center text-gray-400 py-10">No shops found matching your search.</p>
        ) : (
          filteredShops.map((shop) => (
            <div key={shop.id} className="flex flex-col bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition h-full relative overflow-hidden">
              
              {/* ✅ VERIFIED BADGE */}
              {shop.licenseNumber && (
                <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-green-200 flex items-center gap-1">
                  <ShieldCheck size={12}/> GOVERNMENT VERIFIED
                </div>
              )}

              <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                    {shop.type === 'GOVERNMENT' ? <Building2 className="text-blue-600" size={24}/> : <Store className="text-purple-600" size={24}/>}
                    {shop.name}
                  </h3>
                  
                  <div className="space-y-1 mt-2">
                     {/* ✅ DISPLAY LICENSE NUMBER */}
                     {shop.licenseNumber && (
                        <p className="text-gray-500 text-xs flex items-center gap-1.5 font-mono bg-gray-50 w-fit px-2 py-0.5 rounded border border-gray-200">
                          <FileText size={12}/> Lic: {shop.licenseNumber}
                        </p>
                     )}
                     <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={14}/> {shop.address}</p>
                     <p className="text-gray-500 text-sm flex items-center gap-1"><Phone size={14}/> {shop.contactNumber}</p>
                  </div>
                </div>
                
                {/* Owner Button */}
                {shop.ownerId === userId && (
                  <button 
                    onClick={() => setSelectedShopId(shop.id)} 
                    className="mt-8 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 font-bold hover:bg-green-100 transition flex items-center gap-1"
                  >
                    <Plus size={12}/> Add Item
                  </button>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex-1 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1 tracking-wide">
                  <Package size={14}/> Available Products
                </h4>
                {shop.products && shop.products.length > 0 ? (
                  <ul className="space-y-2">
                    {shop.products.map((p: any) => (
                      <li key={p.id} className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                        <span className="text-gray-700 font-medium">{p.name}</span>
                        <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs">₹{p.price} <span className="text-gray-400 font-normal">/ {p.unit}</span></span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-xs text-gray-400 italic text-center py-2">No products added yet.</p>}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Resources;