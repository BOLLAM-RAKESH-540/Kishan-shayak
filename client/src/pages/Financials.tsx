import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { apiService } from '../services/api';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4'];

const Financials = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiService.analytics.getSummary();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load financials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Generating Financial Report...</p>
    </div>
  );

  if (!data) return <div className="p-8 text-center text-red-500 font-bold">⚠️ Failed to load financial data. Please check your connection.</div>;

  const { summary, categories, cropPerformance, machineryIncome } = data;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen pb-24 md:pb-8">
      
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Intelligence 🏦</h1>
        <p className="text-gray-500 font-medium mt-1">Real-time Profit, Loss & ROI Analysis</p>
      </div>

      {/* ── Key Metrics Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Total Income</p>
          <p className="text-3xl font-black text-green-600">₹{summary.totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Total Expenses</p>
          <p className="text-3xl font-black text-red-600">₹{summary.totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Net Profit</p>
          <p className={`text-3xl font-black ${summary.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            ₹{summary.netProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-600 p-6 rounded-3xl shadow-lg border border-green-500 text-white shadow-green-200">
          <p className="text-[10px] uppercase font-black opacity-80 mb-1">Return (ROI)</p>
          <p className="text-3xl font-black">{summary.roi}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ── Crop ROI Analysis ── */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-xl">📈</span> ROI by Crop Type (%)
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} fontWeight="bold" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                   contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="roi" radius={[6, 6, 0, 0]}>
                  {cropPerformance.map((item: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={item.roi >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Expense Distribution ── */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-xl">🍕</span> Spending Breakdown
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categories.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Detailed Performance Table ── */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-xl">📝</span> Performance Ledger
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-black uppercase text-[10px] text-gray-400">Crop Name</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-gray-400">Expenses (₹)</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-gray-400">Yield Income (₹)</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-gray-400">Net Profit/Loss</th>
                  <th className="pb-4 font-black uppercase text-[10px] text-gray-400 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cropPerformance.map((crop: any) => (
                  <tr key={crop.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <span className="font-bold text-gray-800">{crop.name}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{crop.acres} Acres • {crop.status}</p>
                    </td>
                    <td className="py-4 font-bold text-red-500">₹{crop.expense.toLocaleString()}</td>
                    <td className="py-4 font-bold text-green-600">₹{crop.income.toLocaleString()}</td>
                    <td className={`py-4 font-black ${crop.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {crop.profit >= 0 ? '+' : '-'}₹{Math.abs(crop.profit).toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${crop.roi >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {crop.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
                {machineryIncome > 0 && (
                   <tr className="bg-blue-50/50">
                     <td className="py-4 px-2">
                        <span className="font-bold text-blue-800">Machinery Rentals (Income)</span>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Tractor / Services</p>
                     </td>
                     <td className="py-4 font-bold text-gray-400">-</td>
                     <td className="py-4 font-bold text-blue-600">₹{machineryIncome.toLocaleString()}</td>
                     <td className="py-4 font-black text-blue-700">+₹{machineryIncome.toLocaleString()}</td>
                     <td className="py-2 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700">NA</span>
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* CSV Export Placeholder */}
          <div className="mt-8 flex justify-end">
            <button 
              onClick={() => alert("CSV Export feature coming in next minor update! 🚀")}
              className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition shadow-lg active:scale-95"
            >
              📥 Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
