import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiService } from '../services/api';
import { getCrop } from '../utils/cropConstants';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Farm {
  id: string;
  cropName: string;
  fieldSizeAcres: number;
  startDate: string;
  endDate?: string | null;
  status: string;
  activities?: FieldActivity[];
  expenses?: any[];
}

interface FieldActivity {
  id: string;
  farmId: string;
  type: string;
  productName: string;
  quantity: number;
  unit: string;
  appliedDate: string;
}

// ─── Crop Knowledge Base (agronomic schedules) ────────────────────────────────
const CROP_SCHEDULE: Record<string, {
  irrigationDays: number;
  fertilizerDays: number;
  pesticideDays: number;
  irrigationTip: string;
  fertilizerTip: string;
  pesticideTip: string;
}> = {
  'Paddy (Rice)': {
    irrigationDays: 4,
    fertilizerDays: 21,
    pesticideDays: 14,
    irrigationTip: 'Maintain 2–5 cm standing water. Ensure field is flooded during tillering stage.',
    fertilizerTip: 'Apply Urea (top-dress) in split doses. Avoid applying during waterlogging.',
    pesticideTip: 'Monitor for stem borer and leaf folder. Spray Chlorpyrifos if infestation seen.',
  },
  'Cotton': {
    irrigationDays: 10,
    fertilizerDays: 28,
    pesticideDays: 10,
    irrigationTip: 'Irrigate every 10 days. Avoid waterlogging — cotton is highly sensitive.',
    fertilizerTip: 'Apply DAP at sowing. Foliar spray of boron + potassium at boll stage.',
    pesticideTip: 'Watch for bollworm and whitefly. Use YLT (Yellow sticky traps) as a monitor.',
  },
  'Chilli': {
    irrigationDays: 7,
    fertilizerDays: 21,
    pesticideDays: 14,
    irrigationTip: 'Irrigate once a week. Avoid splashing water on leaves to reduce fungal risk.',
    fertilizerTip: 'Apply NPK 19:19:19 fortnightly via drip or foliar. Add calcium spray during fruiting.',
    pesticideTip: 'Spray neem oil solution every 14 days. Watch for thrips and mites.',
  },
  'Maize': {
    irrigationDays: 8,
    fertilizerDays: 21,
    pesticideDays: 21,
    irrigationTip: 'Critical irrigation at tasseling and grain fill stage. Avoid stress at knee-high stage.',
    fertilizerTip: 'Top-dress urea at knee height (V6 stage). Apply Zinc sulphate if deficiency visible.',
    pesticideTip: 'Monitor for Fall Armyworm. Apply Emamectin Benzoate in the whorl if larvae found.',
  },
  'Tomato': {
    irrigationDays: 5,
    fertilizerDays: 14,
    pesticideDays: 10,
    irrigationTip: 'Irrigate every 5–7 days using drip system. Avoid wetting foliage.',
    fertilizerTip: 'Use coagulation fertigation (NPK + micronutrients) weekly via drip from flowering.',
    pesticideTip: 'Apply Copper fungicide every 10 days to prevent early blight. Scout for TSWV.',
  },
  'Turmeric': {
    irrigationDays: 7,
    fertilizerDays: 30,
    pesticideDays: 30,
    irrigationTip: 'Irrigate at 7-day intervals. Mulch with paddy straw to retain moisture.',
    fertilizerTip: 'Apply FYM (Farm Yard Manure) at planting. Top-dress with Urea at 60 and 120 days.',
    pesticideTip: 'Drench with Trichoderma + Pseudomonas every 30 days for rhizome rot prevention.',
  },
};

const DEFAULT_SCHEDULE = {
  irrigationDays: 7,
  fertilizerDays: 21,
  pesticideDays: 14,
  irrigationTip: 'Irrigate based on soil moisture. Avoid overwatering.',
  fertilizerTip: 'Apply balanced NPK fertilizer. Follow soil test recommendations.',
  pesticideTip: 'Inspect fields weekly. Use Integrated Pest Management (IPM) practices.',
};

// ─── Activity Config ──────────────────────────────────────────────────────────
const ACTIVITY_TYPES = [
  { value: 'Irrigation',  label: 'Irrigation',   icon: <img src="/icons/weather.png" className="w-5 h-5 object-contain" />,    color: 'bg-blue-500',   light: 'bg-blue-50 border-blue-200 text-blue-700',   dot: 'bg-blue-500' },
  { value: 'Fertilizer',  label: 'Fertilizer',   icon: <img src="/icons/shops.png" className="w-5 h-5 object-contain" />,      color: 'bg-green-500',  light: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500' },
  { value: 'Pesticide',   label: 'Pesticide',    icon: <img src="/icons/disease.png" className="w-5 h-5 object-contain" />,    color: 'bg-red-500',    light: 'bg-red-50 border-red-200 text-red-700',       dot: 'bg-red-500' },
  { value: 'Weeding',     label: 'Weeding',      icon: <span className="text-sm">🍃</span>,                                    color: 'bg-lime-500',   light: 'bg-lime-50 border-lime-200 text-lime-700',    dot: 'bg-lime-500' },
  { value: 'Other',       label: 'Other',        icon: <span className="text-sm">📝</span>,                                    color: 'bg-gray-500',   light: 'bg-gray-50 border-gray-200 text-gray-700',    dot: 'bg-gray-500' },
];

const getActivityConfig = (type: string) =>
  ACTIVITY_TYPES.find(a => a.value === type) || ACTIVITY_TYPES[4];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const daysSince = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const daysUntil = (daysInterval: number, lastDateStr?: string) => {
  if (!lastDateStr) return null;
  const nextDate = new Date(lastDateStr);
  nextDate.setDate(nextDate.getDate() + daysInterval);
  const diff = nextDate.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Component ────────────────────────────────────────────────────────────────
const CropTimeline = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: 'Irrigation',
    productName: '',
    quantity: '',
    unit: 'L',
    appliedDate: new Date().toISOString().split('T')[0],
  });

  const userPhone = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return u.phoneNumber || u.phone || '';
    } catch { return ''; }
  })();

  const loadFarms = async () => {
    if (!userPhone) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/farms/${userPhone}`);
      const data: Farm[] = Array.isArray(res.data) ? res.data : res.data.data || [];
      setFarms(data);
      if (data.length > 0 && !selectedFarm) {
        setSelectedFarm(data[0]);
      }
    } catch (e) {
      console.error('Failed to load farms', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFarms(); }, [userPhone]);

  useEffect(() => {
    if (selectedFarm) {
      const updated = farms.find(f => f.id === selectedFarm.id);
      if (updated) setSelectedFarm(updated);
    }
  }, [farms]);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarm) return;
    setSaving(true);
    try {
      await apiService.farms.addActivity({
        farmId: selectedFarm.id,
        ...form,
        quantity: parseFloat(form.quantity) || 0,
      });
      setShowModal(false);
      setForm({ type: 'Irrigation', productName: '', quantity: '', unit: 'L', appliedDate: new Date().toISOString().split('T')[0] });
      await loadFarms();
    } catch (e) {
      alert('Failed to save activity. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const buildTimeline = (farm: Farm) => {
    const events: any[] = [];

    events.push({
      id: 'sow-' + farm.id,
      type: 'Sowing',
      label: 'Crop Sown',
      detail: `${farm.cropName} — ${farm.fieldSizeAcres} Acres`,
      date: farm.startDate,
      icon: <span className="text-sm">🌱</span>,
      badgeClass: 'bg-amber-500',
      cardClass: 'bg-amber-50 border-amber-200',
      textClass: 'text-amber-800',
    });

    (farm.activities || []).forEach(activity => {
      const cfg = getActivityConfig(activity.type);
      events.push({
        id: activity.id,
        type: activity.type,
        label: activity.type,
        detail: activity.productName
          ? `${activity.productName}${activity.quantity ? ` — ${activity.quantity} ${activity.unit}` : ''}`
          : activity.quantity ? `${activity.quantity} ${activity.unit}` : '',
        date: activity.appliedDate,
        icon: cfg.icon,
        badgeClass: cfg.color,
        cardClass: `${cfg.light}`,
        textClass: cfg.light.split(' ')[2] || 'text-gray-700',
      });
    });

    (farm.expenses || []).forEach(expense => {
      events.push({
        id: 'exp-' + expense.id,
        type: 'Expense',
        label: `Expense: ${expense.category}`,
        detail: `₹${Number(expense.amount).toLocaleString()}${expense.note ? ' — ' + expense.note : ''}`,
        date: expense.date,
        icon: <span className="text-sm">💰</span>,
        badgeClass: 'bg-gray-400',
        cardClass: 'bg-gray-50 border-gray-200',
        textClass: 'text-gray-700',
        isExpense: true,
      });
    });

    if (farm.status === 'HARVESTED' && farm.endDate) {
      events.push({
        id: 'harvest-' + farm.id,
        type: 'Harvest',
        label: 'Crop Harvested',
        detail: `${farm.cropName} — Cycle Complete`,
        date: farm.endDate,
        icon: <span className="text-sm">✅</span>,
        badgeClass: 'bg-emerald-600',
        cardClass: 'bg-emerald-50 border-emerald-200',
        textClass: 'text-emerald-800',
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const buildRecommendations = (farm: Farm) => {
    const schedule = CROP_SCHEDULE[farm.cropName] || DEFAULT_SCHEDULE;
    const activities = farm.activities || [];

    const lastIrrigation = activities.find(a => a.type === 'Irrigation')?.appliedDate;
    const lastFertilizer = activities.find(a => a.type === 'Fertilizer')?.appliedDate;
    const lastPesticide  = activities.find(a => a.type === 'Pesticide')?.appliedDate;

    const irrigDue  = daysUntil(schedule.irrigationDays, lastIrrigation || farm.startDate);
    const fertDue   = daysUntil(schedule.fertilizerDays, lastFertilizer || farm.startDate);
    const pestDue   = daysUntil(schedule.pesticideDays,  lastPesticide  || farm.startDate);

    return [
      {
        key: 'irrigation',
        label: 'Next Irrigation',
        daysLeft: irrigDue,
        icon: <span className="text-sm">💧</span>,
        tip: schedule.irrigationTip,
        color: 'blue',
        lastDone: lastIrrigation,
        frequency: `Every ${schedule.irrigationDays} days`,
      },
      {
        key: 'fertilizer',
        label: 'Fertilizer Application',
        daysLeft: fertDue,
        icon: <span className="text-sm">🧪</span>,
        tip: schedule.fertilizerTip,
        color: 'green',
        lastDone: lastFertilizer,
        frequency: `Every ${schedule.fertilizerDays} days`,
      },
      {
        key: 'pesticide',
        label: 'Pesticide / Neem Spray',
        daysLeft: pestDue,
        icon: <span className="text-sm">🐛</span>,
        tip: schedule.pesticideTip,
        color: 'red',
        lastDone: lastPesticide,
        frequency: `Every ${schedule.pesticideDays} days`,
      },
    ];
  };

  const timeline = selectedFarm ? buildTimeline(selectedFarm) : [];
  const recommendations = selectedFarm && selectedFarm.status === 'ACTIVE'
    ? buildRecommendations(selectedFarm)
    : [];

  const colorMap: Record<string, { bg: string; text: string; border: string; badge: string; overdue: string; soon: string; ok: string }> = {
    blue:  { bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200',  badge: 'bg-blue-500',  overdue: 'bg-red-100 text-red-700 border-red-200', soon: 'bg-amber-100 text-amber-700 border-amber-200', ok: 'bg-green-100 text-green-700 border-green-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-500', overdue: 'bg-red-100 text-red-700 border-red-200', soon: 'bg-amber-100 text-amber-700 border-amber-200', ok: 'bg-green-100 text-green-700 border-green-200' },
    red:   { bg: 'bg-rose-50',  text: 'text-rose-700',  border: 'border-rose-200',  badge: 'bg-rose-500',  overdue: 'bg-red-100 text-red-700 border-red-200', soon: 'bg-amber-100 text-amber-700 border-amber-200', ok: 'bg-green-100 text-green-700 border-green-200' },
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              Crop Timeline
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-13">Track field activities and get smart care recommendations</p>
          </div>
          {selectedFarm && selectedFarm.status === 'ACTIVE' && (
            <button
              id="add-activity-btn"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              <span className="text-sm">➕</span> Log Activity
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400 font-medium">
          <div className="text-4xl mb-3 animate-pulse">🌱</div>
          <p>Loading your crop data...</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
          <span className="text-5xl block mb-4">🌱</span>
          <p className="text-gray-500 font-semibold text-lg">No crops found.</p>
          <p className="text-gray-400 text-sm mt-1">Go to <strong>My Farm</strong> and add a crop first.</p>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-6">

          <div className="xl:w-80 flex-shrink-0 space-y-4">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Select Crop</h2>
              <div className="space-y-2">
                {farms.map(farm => {
                  const crop = getCrop(farm.cropName);
                  const isActive = selectedFarm?.id === farm.id;
                  const isHarvested = farm.status === 'HARVESTED';
                  return (
                    <button
                      key={farm.id}
                      onClick={() => setSelectedFarm(farm)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        isActive
                          ? `${crop.border} ${crop.bg} shadow-sm`
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      } ${isHarvested ? 'opacity-60' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isHarvested ? 'bg-gray-100' : crop.bg}`}>
                        {crop.img
                          ? <img src={crop.img} alt={farm.cropName} className={`w-full h-full object-cover rounded-lg ${isHarvested ? 'grayscale opacity-70' : ''}`} />
                          : <span className="text-xl">{crop.emoji}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${isActive ? crop.text : 'text-gray-700'}`}>{farm.cropName}</p>
                        <p className="text-xs text-gray-400">{farm.fieldSizeAcres} Acres • {isHarvested ? '✅ Harvested' : '🟢 Active'}</p>
                      </div>
                      {isActive && <span className="text-sm">▶️</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-sm">💡</span> Smart Recommendations
                </h2>
                <div className="space-y-3">
                  {recommendations.map(rec => {
                    const c = colorMap[rec.color];
                    const isOverdue = rec.daysLeft !== null && rec.daysLeft < 0;
                    const isSoon    = rec.daysLeft !== null && rec.daysLeft >= 0 && rec.daysLeft <= 3;
                    const statusClass = isOverdue ? c.overdue : isSoon ? c.soon : c.ok;

                    return (
                      <div key={rec.key} className={`p-3 rounded-xl border ${c.bg} ${c.border}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.badge} text-white flex-shrink-0`}>
                              {rec.icon}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${c.text}`}>{rec.label}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">{rec.frequency}</p>
                            </div>
                          </div>
                          {rec.daysLeft !== null && (
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${statusClass} flex-shrink-0`}>
                              {isOverdue
                                ? `${Math.abs(rec.daysLeft)}d overdue`
                                : rec.daysLeft === 0
                                ? 'Due today'
                                : `${rec.daysLeft}d left`
                              }
                            </span>
                          )}
                        </div>

                        {rec.lastDone && (
                          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                            <span className="text-[10px]">🕒</span> Last: {formatDate(rec.lastDone)}
                          </p>
                        )}

                        {(isOverdue || isSoon) && (
                          <div className={`mt-2 flex items-start gap-1.5 p-2 rounded-lg ${isOverdue ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
                            <span className="text-[10px]">⚠️</span>
                            <p className={`text-[10px] leading-relaxed ${isOverdue ? 'text-red-600' : 'text-amber-700'}`}>
                              {rec.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedFarm && selectedFarm.status === 'HARVESTED' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700">
                <p className="font-bold flex items-center gap-2 mb-1"><span className="text-sm">✅</span> Harvest Complete</p>
                <p className="text-xs text-emerald-600">This crop has been harvested. View the full activity history in the timeline →</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            {selectedFarm ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-800">
                      {selectedFarm.cropName} Timeline
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {timeline.length} events • Sown {formatDate(selectedFarm.startDate)}
                    </p>
                  </div>

                  <div className="hidden md:flex flex-wrap gap-2">
                    {ACTIVITY_TYPES.slice(0, 3).map(a => (
                      <span key={a.value} className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${a.light}`}>
                        {a.icon} {a.label}
                      </span>
                    ))}
                  </div>
                </div>

                {timeline.length === 1 ? (
                  <div className="text-center py-12 border-2 border-dashed border-blue-100 rounded-xl">
                    <span className="text-5xl block mb-3">📅</span>
                    <p className="text-gray-500 font-semibold">No field activities logged yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Click <strong>Log Activity</strong> to record your first irrigation, fertilizer, or pesticide event.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />

                    <div className="space-y-4 pl-12">
                      {timeline.map((event, idx) => (
                        <div key={event.id} className="relative">
                          <div className={`absolute -left-[2.4rem] top-3 w-4 h-4 rounded-full ${event.badgeClass} flex items-center justify-center shadow-sm border-2 border-white`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>

                          <div className={`p-4 rounded-xl border ${event.cardClass} transition-all hover:shadow-md`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${event.badgeClass} text-white flex-shrink-0`}>
                                  {event.icon}
                                </div>
                                <div className="min-w-0">
                                  <p className={`font-bold text-sm ${event.textClass}`}>{event.label}</p>
                                  {event.detail && (
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{event.detail}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-semibold text-gray-500">{formatDate(event.date)}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {daysSince(event.date) === 0
                                    ? 'Today'
                                    : `${daysSince(event.date)} days ago`}
                                </p>
                              </div>
                            </div>
                          </div>

                          {idx < timeline.length - 1 && (
                            <div className="absolute -left-[2.2rem] top-6 bottom-0 w-0.5 bg-gray-100" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                <span className="text-5xl block mb-4">📅</span>
                <p>Select a crop on the left to view its timeline</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-800">Log Field Activity</h3>
              <button
                id="close-modal-btn"
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="text-lg">❌</span>
              </button>
            </div>

            <form id="add-activity-form" onSubmit={handleAddActivity} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Activity Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITY_TYPES.map(a => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: a.value })}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        form.type === a.value
                          ? `${a.light} border-current shadow-sm scale-105`
                          : 'border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {a.icon}
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product name */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Product / Chemical Name
                  <span className="font-normal text-gray-400 ml-1">(optional)</span>
                </label>
                <input
                  id="product-name-input"
                  type="text"
                  placeholder={form.type === 'Irrigation' ? 'e.g. Canal, Drip, Borewell' : 'e.g. Urea, DAP, Neem Oil'}
                  value={form.productName}
                  onChange={e => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 font-medium transition"
                />
              </div>

              {/* Quantity + Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Quantity</label>
                  <input
                    id="quantity-input"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 50"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Unit</label>
                  <select
                    id="unit-select"
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white transition"
                  >
                    <option value="L">Liters (L)</option>
                    <option value="mL">mL</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="bags">Bags</option>
                    <option value="hours">Hours</option>
                    <option value="acres">Acres covered</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Date Applied *</label>
                <input
                  id="applied-date-input"
                  type="date"
                  required
                  value={form.appliedDate}
                  onChange={e => setForm({ ...form, appliedDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 transition"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  id="save-activity-btn"
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 transition-all active:scale-95 disabled:bg-gray-300"
                >
                  {saving ? 'Saving...' : '✅ Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropTimeline;
