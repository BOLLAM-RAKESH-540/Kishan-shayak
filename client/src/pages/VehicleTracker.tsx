import React, { useState, useEffect } from 'react';
import { 
  Tractor, 
  Calendar, 
  IndianRupee, 
  Phone, 
  Search, 
  Plus, 
  Save,
  BookOpen,
  Truck,
  Zap,
  Clock,
  LayoutGrid
} from 'lucide-react';
import axios from 'axios';

// Define what a Work Log looks like
interface WorkLog {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleName: string;
  workDate: string;
  amount: number;
  status: string; // 'DUE' or 'PAID'
}

const getVehicleIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('tractor')) return <Tractor size={18} className="text-green-600" />;
  if (n.includes('truck') || n.includes('lorry')) return <Truck size={18} className="text-sky-600" />;
  if (n.includes('harvester')) return <Zap size={18} className="text-orange-600" />;
  if (n.includes('jcb')) return <LayoutGrid size={18} className="text-yellow-600" />;
  return <Tractor size={18} className="text-gray-400" />;
};

const VehicleTracker = () => {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleName: 'Tractor', 
    workDate: new Date().toISOString().split('T')[0], 
    amount: '',
  });

  // Fetch Logs
  const fetchLogs = async (searchTerm = '') => {
    try {
      const token = localStorage.getItem('token');
      const url = searchTerm 
        ? `http://localhost:3000/api/vehicles/list?search=${searchTerm}`
        : `http://localhost:3000/api/vehicles/list`;
        
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalDues = logs.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/vehicles/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Khata Entry Added! 📖");
      setShowForm(false);
      setFormData({ 
        customerName: '', 
        customerPhone: '', 
        vehicleName: 'Tractor', 
        workDate: new Date().toISOString().split('T')[0], 
        amount: '' 
      });
      fetchLogs(); 
    } catch (error) {
      alert("Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
      
      {/* 📖 Book Header Banner */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-cyan-100 overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-56 md:h-auto bg-gray-200">
             <img 
               src="/icons/vehicle_khata.png" 
               alt="Digital Vehicle Ledger" 
               className="w-full h-full object-cover"
             />
          </div>
          <div className="p-8 md:w-2/3">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                     Vehicle Khata Book
                   </h1>
                   <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-xs">Digital Work Ledger</p>
                </div>
                <button 
                  onClick={() => setShowForm(!showForm)}
                  className="bg-cyan-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition transform flex items-center gap-2"
                >
                  <Plus size={22} /> {showForm ? "Close" : "New Entry"}
                </button>
             </div>
             
             {/* Summary Card */}
             <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex items-center justify-between">
                <div>
                   <p className="text-red-700 font-black text-sm uppercase">Total Outstanding Balance</p>
                   <h2 className="text-4xl font-black text-red-600">₹{totalDues.toLocaleString()}</h2>
                </div>
                <div className="bg-red-100 p-4 rounded-full text-red-600">
                   <IndianRupee size={32} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SEARCH IN THE BOOK */}
      <div className="max-w-4xl mx-auto mb-8">
          <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600" size={24} />
              <input 
                type="text"
                placeholder="Flip to customer... (Search by Phone Number)"
                className="w-full pl-14 pr-6 py-5 bg-white rounded-full shadow-md border-2 border-transparent focus:border-cyan-300 outline-none font-bold text-gray-700 text-lg transition-all"
                value={searchPhone}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  fetchLogs(e.target.value);
                }}
              />
          </div>
      </div>

      {/* NEW ENTRY FORM */}
      {showForm && (
        <div className="max-w-4xl mx-auto mb-8 bg-white p-8 rounded-3xl shadow-2xl border-4 border-cyan-50 animate-in slide-in-from-top duration-300">
           <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3 border-b pb-4">
             <BookOpen className="text-cyan-600" /> New Ledger Entry
           </h3>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase px-1">Customer Name</label>
                <input required placeholder="Name" className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-cyan-500 outline-none bg-gray-50 font-bold" 
                  value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase px-1">Customer Phone</label>
                <input required type="tel" placeholder="Mobile" className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-cyan-500 outline-none bg-gray-50 font-bold" 
                  value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase px-1">Vehicle Used</label>
                <select className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-cyan-500 outline-none bg-gray-50 font-bold appearance-none cursor-pointer"
                  value={formData.vehicleName} onChange={e => setFormData({...formData, vehicleName: e.target.value})}>
                  <option value="Tractor">🚜 Tractor</option>
                  <option value="Truck/Lorry">🚛 Truck / Lorry</option>
                  <option value="Harvester">⚡ Harvester</option>
                  <option value="JCB">🧱 JCB / Excavator</option>
                  <option value="Rotavator">⚙️ Rotavator</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase px-1">Date</label>
                <input required type="date" className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-cyan-500 outline-none bg-gray-50 font-bold" 
                  value={formData.workDate} onChange={e => setFormData({...formData, workDate: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-black text-gray-500 uppercase px-1">Amount Due (₹)</label>
                <input required type="number" placeholder="₹ Enter Amount" className="w-full p-6 rounded-2xl border-2 border-cyan-200 focus:border-cyan-500 outline-none bg-cyan-50 text-3xl font-black text-cyan-800" 
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <button disabled={loading} type="submit" className="md:col-span-2 bg-gray-800 text-white p-5 rounded-2xl font-black text-xl shadow-xl hover:bg-black transition flex items-center justify-center gap-3">
                {loading ? 'Processing...' : <><Save size={24} /> Write in Khata</>}
              </button>
           </form>
        </div>
      )}

      {/* 📖 THE KHATA BOOK (LIST) */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-200 relative mb-12">
        {/* Binder Edge Decor (Notebook style) */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-red-600 shadow-inner z-10 opacity-80" aria-hidden="true" />
        
        {/* Ledger Column Headers */}
        <div className="bg-gray-50 border-b-2 border-gray-100 p-6 flex items-center justify-between font-black text-gray-400 uppercase tracking-tighter text-xs">
           <div className="flex-1">Date & Customer</div>
           <div className="w-32 hidden sm:block text-center">Vehicle</div>
           <div className="w-32 text-right">Amount</div>
        </div>

        {/* Ruled Notebook Rows */}
        <div className="divide-y divide-gray-100">
          {logs.map((log) => (
            <div key={log.id} className="relative group hover:bg-cyan-50/30 transition-colors p-6 flex flex-col sm:flex-row sm:items-center justify-between min-h-[100px]">
              
              {/* Notebook Line Visual (Ruled lines) */}
              <div className="absolute left-8 right-8 bottom-0 border-b border-cyan-50" />

              <div className="flex-1 flex items-start gap-4">
                 <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gray-100 items-center justify-center text-gray-400 font-bold shrink-0">
                    <Clock size={20} />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-gray-800 mb-1 flex items-center gap-2">
                       {log.customerName}
                       <span className="sm:hidden">{getVehicleIcon(log.vehicleName)}</span>
                    </h4>
                    <div className="flex items-center gap-4">
                       <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Phone size={12} /> {log.customerPhone}
                       </p>
                       <p className="text-xs font-bold text-cyan-600 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(log.workDate).toLocaleDateString('en-IN')}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Status & Vehicle Type */}
              <div className="w-32 hidden sm:flex flex-col items-center justify-center">
                 <div className="mb-2">{getVehicleIcon(log.vehicleName)}</div>
                 <p className="text-[10px] font-black uppercase text-gray-400">{log.vehicleName}</p>
              </div>

              {/* Money Entry */}
              <div className="w-32 text-right mt-4 sm:mt-0">
                 <p className="text-2xl font-black text-red-600">₹{log.amount.toLocaleString()}</p>
                 <span className="text-[10px] font-black uppercase bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                    Payment Due
                 </span>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-24 text-center">
               <BookOpen size={64} className="mx-auto text-gray-200 mb-4" />
               <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">Your Khata Book is Empty</p>
               <p className="text-gray-300 text-sm mt-1">Add your first custom work work entry above</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default VehicleTracker;