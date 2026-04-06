import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api'; 
import axios from 'axios'; 
import { getCrop } from '../utils/cropConstants';

const Expenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [yields, setYields] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]); 
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [transactionType, setTransactionType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  // 🟢 Get User Data
  const userString = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userString);
  const userPhone = user.phoneNumber || user.phone || localStorage.getItem('phoneNumber'); 

  const [formData, setFormData] = useState({
    farmId: '', 
    category: 'Seeds',
    itemName: '', 
    amount: '',
    quantity: '1',
    unit: 'Total Yield',
    pricePerUnit: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const getCategoryStyle = (category: string) => {
    const c = (category || "").toLowerCase();
    if (c.includes('seed')) return { icon: <span className="text-2xl">🌱</span>, bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    if (c.includes('fertilizer')) return { icon: <span className="text-2xl">🧪</span>, bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
    if (c.includes('pesticide')) return { icon: <span className="text-2xl">🐛</span>, bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
    if (c.includes('labor')) return { icon: <span className="text-2xl">👥</span>, bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    if (c.includes('fuel')) return { icon: <span className="text-2xl">⛽</span>, bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
    if (c.includes('machinery')) return { icon: <span className="text-2xl">🚜</span>, bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    if (c.includes('water')) return { icon: <span className="text-2xl">💧</span>, bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' };
    return { icon: <span className="text-2xl">🧾</span>, bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  const loadPageData = async () => {
    if (!userPhone) return;
    
    try {
      setLoading(true);

      const expRes = await apiService.expenses.getAll();
      setExpenses(expRes.data || []);

      const farmRes = await axios.get(`http://localhost:3000/api/farms/${userPhone}`);
      const actualFarms = farmRes.data.data || farmRes.data;
      
      if (Array.isArray(actualFarms)) {
        setFarms(actualFarms);
        // Extract all yields from the populated farms array
        const allYields = actualFarms.flatMap(f => f.yields || []);
        setYields(allYields);
      }
    } catch (error) {
      console.error("Error loading page data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [userPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmId) return alert("Please select a crop!");
    
    try {
      if (transactionType === 'EXPENSE') {
        await apiService.expenses.create({ 
          ...formData, 
          userId: userPhone, 
          itemName: formData.note || formData.category 
        });
        alert("Expense Added Successfully! ✅");
      } else {
        const calculatedAmount = Number(formData.quantity) * Number(formData.pricePerUnit);
        await apiService.farms.addYield({
          farmId: formData.farmId,
          sellingPrice: calculatedAmount.toString(),
          quantity: formData.quantity,
          unit: formData.unit,
          soldDate: formData.date
        });
        alert("Income Logged Successfully! ✅");
      }

      setShowForm(false);
      setFormData({ farmId: '', category: 'Seeds', itemName: '', amount: '', quantity: '1', unit: 'Total Yield', pricePerUnit: '', date: new Date().toISOString().split('T')[0], note: '' });
      loadPageData();
    } catch (error) {
      alert(`Failed to add ${transactionType.toLowerCase()}.`);
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalIncome = yields.reduce((sum, item) => sum + Number(item.sellingPrice), 0);
  const netBalance = totalIncome - totalExpenses;
  const isProfit = netBalance >= 0;

  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'EXPENSE', formattedDate: e.date })),
    ...yields.map(y => ({ ...y, type: 'INCOME', amount: y.sellingPrice, category: 'Yield Sale', id: y.id, formattedDate: y.soldDate, farmId: y.farmId }))
  ].sort((a, b) => new Date(b.formattedDate).getTime() - new Date(a.formattedDate).getTime());

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">💰</span> Financial Manager
          </h1>
          <p className="text-gray-500">Accounts for: {user.name || userPhone}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl">↘️</div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{totalExpenses.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-2xl">↗️</div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Total Income</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{totalIncome.toLocaleString()}</h3>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border flex items-center gap-4 text-white ${isProfit ? 'bg-green-600 border-green-500' : 'bg-red-600 border-red-500'}`}>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            {isProfit ? '📈' : '📉'}
          </div>
          <div>
            <p className="text-xs font-bold uppercase opacity-80">{isProfit ? 'Net Profit' : 'Net Loss'}</p>
            <h3 className="text-3xl font-bold">₹{netBalance.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="mb-8 bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-sm w-full md:w-auto justify-center">
        <span className="text-lg">➕</span> {showForm ? "Close Form" : "Add New Record"}
      </button>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-gray-700">Add Record Details</h3>
          
          {/* Toggle Type */}
          <div className="flex gap-4 mb-6">
            <button 
              type="button" 
              onClick={() => setTransactionType('EXPENSE')} 
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${transactionType === 'EXPENSE' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              Log Expense
            </button>
            <button 
              type="button" 
              onClick={() => setTransactionType('INCOME')} 
              className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${transactionType === 'INCOME' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
            >
              Log Income (Yield Sale)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-2">Select Crop *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {farms.length === 0 ? (
                  <div className="col-span-full text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-100">
                    ⚠️ No crops found. Go to 'My Farm' to add one first.
                  </div>
                ) : (
                  farms.map((farm) => {
                    const cropInfo = getCrop(farm.cropName);
                    const isSelected = formData.farmId === farm.id;
                    const isHarvested = farm.status === 'HARVESTED';
                    const farmTrans = allTransactions.filter(t => t.farmId === farm.id);
                    const cropSpent = farmTrans.filter(t => t.type === 'EXPENSE').reduce((sum, item) => sum + Number(item.amount), 0);

                    return (
                      <div 
                        key={farm.id}
                        onClick={() => setFormData({...formData, farmId: farm.id})}
                        className={`cursor-pointer rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${
                          isSelected 
                            ? 'border-green-500 bg-green-50 shadow-sm scale-105' 
                            : 'border-gray-100 bg-white hover:border-gray-300'
                        } ${isHarvested ? 'opacity-60 grayscale' : ''}`}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden ${cropInfo.bg}`}>
                          {cropInfo.img ? (
                            <img src={cropInfo.img} alt={farm.cropName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{cropInfo.emoji}</span>
                          )}
                        </div>
                        <div className="text-center w-full">
                          <p className={`text-xs font-bold ${isSelected ? 'text-green-700' : 'text-gray-700'} truncate`}>
                            {farm.cropName}
                          </p>
                          <p className="text-[10px] text-red-600 font-bold mt-0.5">₹{cropSpent.toLocaleString()}</p>

                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider mt-0.5">
                            {isHarvested ? 'Harvested' : 'Active'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {transactionType === 'EXPENSE' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Expense Category</label>
                  <select className="w-full p-3 border rounded-lg bg-white" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Seeds">🌱 Seeds</option>
                    <option value="Fertilizer">🧪 Fertilizer</option>
                    <option value="Pesticides">🐞 Pesticides</option>
                    <option value="Labor">👥 Labor / Wages</option>
                    <option value="Diesel">⛽ Diesel / Fuel</option>
                    <option value="Machinery">🚜 Machinery / Rent</option>
                    <option value="Irrigation">💧 Irrigation</option>
                    <option value="Other">🧾 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Expense Amount (₹)</label>
                  <input type="number" className="w-full p-3 border rounded-lg" placeholder="5000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Quantity Sold</label>
                  <div className="flex gap-2">
                    <input type="number" className="w-2/3 p-3 border rounded-lg" placeholder="e.g. 50" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
                    <select className="w-1/3 p-3 border rounded-lg bg-white" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                      <option value="Total Yield">Total Yield</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price per {formData.unit === 'Total Yield' ? 'Yield' : formData.unit} (₹)</label>
                  <input type="number" className="w-full p-3 border rounded-lg" placeholder="e.g. 2000" value={formData.pricePerUnit} onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})} required />
                </div>
                
                {Number(formData.quantity) > 0 && Number(formData.pricePerUnit) > 0 && (
                  <div className="md:col-span-2 p-4 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center shadow-inner mt-2">
                     <span className="font-bold text-green-800 text-sm">Calculated Total Income:</span>
                     <span className="text-2xl font-black text-green-700">₹{(Number(formData.quantity) * Number(formData.pricePerUnit)).toLocaleString()}</span>
                  </div>
                )}
              </>
            )}
            
            <div className="md:col-span-2">
              <button 
                className={`w-full text-white font-bold py-3 rounded-lg transition shadow-md ${transactionType === 'EXPENSE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {transactionType === 'EXPENSE' ? 'Save Expense' : 'Save Income'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List Grouped by Crop */}
      <div className="space-y-6">
        <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2"><span className="text-xl">📊</span> Overall Summary By Crop</h3>
        
        {loading ? (
           <p className="text-center text-gray-500 py-10 font-medium">Loading your records...</p>
        ) : allTransactions.length > 0 ? (
          farms.filter(farm => allTransactions.some(t => t.farmId === farm.id)).map(farm => {
            const farmTransactions = allTransactions.filter(t => t.farmId === farm.id);
            const cropInfo = getCrop(farm.cropName);
            const isHarvested = farm.status === 'HARVESTED';
            const totalSpent = farmTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, item) => sum + Number(item.amount), 0);
            const totalEarned = farmTransactions.filter(t => t.type === 'INCOME').reduce((sum, item) => sum + Number(item.amount), 0);
            const cropProfit = totalEarned - totalSpent;

            return (
              <div key={farm.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${cropInfo.border} mb-6`}>
                
                {/* Crop Header */}
                <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between border-b gap-4 ${cropInfo.bg} ${cropInfo.border}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-white/70 shadow-sm overflow-hidden flex-shrink-0">
                      {cropInfo.img ? (
                        <img src={cropInfo.img} alt={farm.cropName} className={`w-full h-full object-cover ${isHarvested ? 'grayscale opacity-70' : ''}`} />
                      ) : (
                        <span className="text-3xl">{cropInfo.emoji}</span>
                      )}
                    </div>
                    <div>
                      <h2 className={`text-xl font-extrabold ${cropInfo.text}`}>{farm.cropName}</h2>
                      <div className="flex gap-3 md:gap-4 mt-1 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60">
                        <p className="text-xs text-gray-600 font-bold">Spent: <span className="text-red-600">₹{totalSpent.toLocaleString()}</span></p>
                        <div className="w-px bg-gray-300"></div>
                        <p className="text-xs text-gray-600 font-bold">Earned: <span className="text-green-600">₹{totalEarned.toLocaleString()}</span></p>
                        <div className="w-px bg-gray-300"></div>
                        <p className={`text-xs font-bold ${cropProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net: <span>₹{cropProfit.toLocaleString()}</span></p>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] self-start md:self-center uppercase font-black px-3 py-1.5 rounded-full bg-white/60 ${cropInfo.text} shadow-sm border border-white`}>
                    {isHarvested ? 'Harvested' : 'Active'}
                  </span>
                </div>

                {/* Crop Specific Transactions */}
                <div className="p-4 space-y-3 bg-gray-50/50">
                  {farmTransactions.map(item => {
                    const isIncome = item.type === 'INCOME';
                    const style = isIncome 
                      ? { icon: <span className="text-2xl">📈</span>, bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
                      : getCategoryStyle(item.category);
                      
                    return (
                      <div key={item.id} className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border ${style.border} hover:shadow-md transition-shadow`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.bg} ${style.text}`}>
                            {style.icon}
                          </div>
                          <div>
                            <h3 className={`font-bold text-base ${isIncome ? 'text-green-700' : 'text-gray-800'}`}>
                              {item.category}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                              <span className="text-[10px]">📅</span> 
                              {new Date(item.formattedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} 
                              {isIncome && item.quantity ? ` • ${item.quantity} ${item.unit}` : item.note || item.itemName ? ` • ${item.note || item.itemName}` : ''}
                            </p>
                          </div>
                        </div>
                        <p className={`font-bold text-lg ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                          {isIncome ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                  
                  {/* Total calculation under the crop itself */}
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 flex flex-col gap-2 px-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-700 uppercase tracking-wide">Total Spent on {farm.cropName}:</span>
                      <span className="text-xl font-black text-red-600">₹{totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
                      <span className="font-bold text-gray-700 uppercase tracking-wide">Total Earned from {farm.cropName}:</span>
                      <span className="text-xl font-black text-green-600">₹{totalEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg border-t-2 border-gray-300 pt-3 mt-1 bg-white p-2 rounded-lg shadow-sm">
                      <span className="font-black text-gray-800 uppercase tracking-wide">Grand Total (Net):</span>
                      <span className={`text-2xl font-black ${cropProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {cropProfit >= 0 ? '+' : '-'}₹{Math.abs(cropProfit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center bg-white p-10 rounded-2xl border border-dashed border-gray-200">
            <span className="text-5xl block mb-3">🧾</span>
            <p className="text-gray-500 font-semibold text-lg">No records found yet.</p>
            <p className="text-gray-400 text-sm mt-1">Use the "Add New Record" button above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;