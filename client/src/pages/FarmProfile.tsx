import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CROPS, getCrop } from '../utils/cropConstants';
// Lucide icons removed

// ─── Component ────────────────────────────────────────────────────────────────
const FarmProfile = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [summary, setSummary] = useState({ activeCrops: 0, totalAcres: 0, harvestedCrops: 0 });

  // UI state: null | 'picker' | 'form'
  const [step, setStep] = useState<null | 'picker' | 'form'>(null);
  const [selectedCrop, setSelectedCrop] = useState<typeof CROPS[0] | null>(null);
  const [formData, setFormData] = useState({ fieldSizeAcres: '', startDate: '', endDate: '' });
  const [saving, setSaving] = useState(false);

  const userPhone = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.phoneNumber || u.phone || localStorage.getItem('phoneNumber') || '';
    } catch { return ''; }
  })();

  const API = 'http://localhost:3000/api/farms';

  const refresh = async () => {
    if (!userPhone) return;
    try {
      const [farmRes, sumRes] = await Promise.all([
        axios.get(`${API}/${userPhone}`),
        axios.get(`${API}/summary/${userPhone}`),
      ]);
      setFarms(Array.isArray(farmRes.data) ? farmRes.data : farmRes.data.data || []);
      setSummary(sumRes.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { refresh(); }, [userPhone]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const pickCrop = (crop: typeof CROPS[0]) => {
    setSelectedCrop(crop);
    setStep('form');
  };

  const reset = () => {
    setStep(null);
    setSelectedCrop(null);
    setFormData({ fieldSizeAcres: '', startDate: '', endDate: '' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone) return alert('Please login first!');
    if (!selectedCrop || !formData.fieldSizeAcres || !formData.startDate)
      return alert('Please fill in all required fields.');
    setSaving(true);
    try {
      await axios.post(`${API}/add`, {
        userId: userPhone,
        cropName: selectedCrop.value,
        fieldSizeAcres: parseFloat(formData.fieldSizeAcres),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      });
      reset();
      refresh();
    } catch (err: any) {
      alert(`Failed to save: ${err.response?.data?.message || 'Check server connection'}`);
    } finally { setSaving(false); }
  };

  const handleHarvest = async (farmId: string) => {
    const price = window.prompt('Enter total amount earned from this harvest (₹):');
    if (price === null) return;
    try {
      await axios.patch(`${API}/harvest/${farmId}`, { sellingPrice: parseFloat(price), quantity: 0, unit: 'kg' });
      refresh();
    } catch { alert('Error updating harvest status'); }
  };

  const handleDelete = async (farmId: string) => {
    if (!window.confirm('Delete this crop? All related expenses will also be removed.')) return;
    try { await axios.delete(`${API}/${farmId}`); refresh(); }
    catch { alert('Error deleting record'); }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 border border-green-200 rounded-xl flex items-center justify-center text-xl">
            🌾
          </div>
          My Farm
        </h1>

        {/* Add Crop CTA — only shown when no modal open */}
        {!step && (
          <button
            onClick={() => setStep('picker')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-green-200 transition-all active:scale-95"
          >
            <span className="text-sm">➕</span> Add Crop
          </button>
        )}
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="col-span-3 md:col-span-1 bg-gradient-to-br from-green-500 to-green-700 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <span className="absolute right-[-12px] bottom-[-12px] text-8xl opacity-10">📈</span>
          <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-1">Active Area</p>
          <h3 className="text-3xl font-black">{Number(summary.totalAcres || 0).toFixed(1)} <span className="text-base font-normal">Acres</span></h3>
          <p className="text-sm mt-3 bg-white/20 w-fit px-3 py-1 rounded-full">{summary.activeCrops} Active Crops</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📊</div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Total Cycles</p>
            <h3 className="text-2xl font-black text-gray-800">{farms.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">✅</div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Completed</p>
            <h3 className="text-2xl font-black text-gray-800">{summary.harvestedCrops}</h3>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          STEP 1 — CROP IMAGE PICKER
      ════════════════════════════════════════════ */}
      {step === 'picker' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-800 flex items-center gap-2">
              <span className="text-sm">🌱</span>
              Choose Your Crop
            </h2>
            <button onClick={reset} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <span className="text-lg">❌</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CROPS.map((crop) => (
              <button
                key={crop.value}
                type="button"
                onClick={() => pickCrop(crop)}
                className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${crop.bg} ${crop.border}`}
              >
                {/* Crop image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/60 flex items-center justify-center shadow-sm">
                  {crop.img ? (
                    <img
                      src={crop.img}
                      alt={crop.value}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Emoji fallback if image fails
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        (e.currentTarget.nextSibling as HTMLElement)?.removeAttribute('style');
                      }}
                    />
                  ) : null}
                  <span
                    className="text-4xl"
                    style={crop.img ? { display: 'none' } : {}}
                  >{crop.emoji}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-sm font-bold ${crop.text}`}>{crop.value}</span>
                  <span className={`text-[10px] ${crop.text} opacity-60 group-hover:translate-x-0.5 transition-transform`}>▶️</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          STEP 2 — AREA + DATES FORM
      ════════════════════════════════════════════ */}
      {step === 'form' && selectedCrop && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 animate-fadeIn">
          {/* Back button */}
          <button
            onClick={() => setStep('picker')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-5 transition"
          >
            <span className="text-sm">◀️</span> Back to crop selection
          </button>

          {/* Selected crop banner */}
          <div className={`flex items-center gap-4 p-4 rounded-xl mb-6 ${selectedCrop.bg} border ${selectedCrop.border}`}>
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/70 flex items-center justify-center shadow-sm flex-shrink-0">
              {selectedCrop.img ? (
                <img src={selectedCrop.img} alt={selectedCrop.value} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{selectedCrop.emoji}</span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Selected Crop</p>
              <h3 className={`text-xl font-extrabold ${selectedCrop.text}`}>{selectedCrop.value}</h3>
            </div>
          </div>

          {/* The form */}
          <form onSubmit={handleSave} className="space-y-5">
            {/* Area cultivated */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <span className="text-sm">📏</span> Area Cultivated (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                placeholder="e.g. 2.5"
                value={formData.fieldSizeAcres}
                onChange={(e) => setFormData({ ...formData, fieldSizeAcres: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-800 font-medium transition"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                  <span className="text-[10px]">📅</span> Sowing Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-700 transition"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                  <span className="text-[10px]">📅</span> Est. Harvest
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-gray-700 transition"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={reset}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-200 transition-all active:scale-95 disabled:bg-gray-300"
              >
                {saving ? 'Saving…' : '🚜 Register Crop'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════════
          REGISTERED CROPS LIST
      ════════════════════════════════════════════ */}
      <div>
        <h2 className="text-lg font-extrabold text-gray-700 mb-4 flex items-center gap-2">
          <span className="text-sm">🌱</span>
          Registered Crops
          <span className="ml-auto text-sm font-medium text-gray-400">{farms.length} total</span>
        </h2>

        {farms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-500 font-semibold">No crops registered yet.</p>
            <p className="text-gray-400 text-sm mt-1">Tap <strong>Add Crop</strong> above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {farms.map((farm) => {
              const crop = getCrop(farm.cropName);
              const isHarvested = farm.status === 'HARVESTED' || !!farm.endDate;

              return (
                <div
                  key={farm.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md ${isHarvested ? 'border-gray-200 opacity-75' : crop.border}`}
                >
                  {/* Top row */}
                  <div className="flex items-center gap-4 p-5">
                    {/* Crop image */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${isHarvested ? 'bg-gray-100' : crop.bg}`}>
                      {crop.img ? (
                        <img
                          src={crop.img}
                          alt={farm.cropName}
                          className={`w-full h-full object-cover ${isHarvested ? 'grayscale opacity-60' : ''}`}
                        />
                      ) : (
                        <span className={`text-3xl ${isHarvested ? 'grayscale opacity-50' : ''}`}>{crop.emoji}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-extrabold text-lg ${isHarvested ? 'text-gray-400' : crop.text}`}>
                          {farm.cropName}
                        </h3>
                        {isHarvested ? (
                          <span className="text-[10px] font-black uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Harvested</span>
                        ) : (
                          <span className="text-[10px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px]">📏</span>
                          {farm.fieldSizeAcres} Acres
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px]">📅</span>
                          Sown: {new Date(farm.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {farm.endDate && (
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px]">📅</span>
                            Harvest: {new Date(farm.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!isHarvested && (
                        <button
                          title="Mark as Harvested"
                          onClick={() => handleHarvest(farm.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                        >
                          <span className="text-sm">✅</span>
                        </button>
                      )}
                      <button
                        title="Delete"
                        onClick={() => handleDelete(farm.id)}
                        className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"
                      >
                        <span className="text-sm">🗑️</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer action — add expense */}
                  {!isHarvested && (
                    <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50">
                      <Link
                        to={`/expenses?farmId=${farm.id}&cropName=${farm.cropName}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                      >
                        <span className="text-[10px]">➕</span> Add Crop Expense
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmProfile;