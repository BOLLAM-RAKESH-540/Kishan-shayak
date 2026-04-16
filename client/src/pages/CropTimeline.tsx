import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { getCrop } from '../utils/cropConstants';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useTitle } from '../hooks/useTitle';
import EmptyState from '../components/common/EmptyState';

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
interface CropStage {
  name: string;
  start: number; // Day start
  end: number;   // Day end
  icon: string;
}

const CROP_SCHEDULE: Record<string, {
  duration: number;
  stages: CropStage[];
  irrigationDays: number;
  fertilizerDays: number;
  pesticideDays: number;
  irrigationTip: string;
  fertilizerTip: string;
  pesticideTip: string;
}> = {
  'Paddy (Rice)': {
    duration: 120,
    stages: [
      { name: 'Nursery', start: 0, end: 25, icon: '🌱' },
      { name: 'Vegetative', start: 25, end: 60, icon: '🌿' },
      { name: 'Reproductive', start: 60, end: 95, icon: '🌾' },
      { name: 'Ripening', start: 95, end: 120, icon: '🍚' },
    ],
    irrigationDays: 4,
    fertilizerDays: 21,
    pesticideDays: 14,
    irrigationTip: 'Maintain 2–5 cm standing water.',
    fertilizerTip: 'Apply Urea in split doses.',
    pesticideTip: 'Monitor for stem borer.',
  },
  'Cotton': {
    duration: 150,
    stages: [
      { name: 'Seedling', start: 0, end: 35, icon: '🌱' },
      { name: 'Squaring', start: 35, end: 70, icon: '🌸' },
      { name: 'Boll Dev', start: 70, end: 120, icon: '🧶' },
      { name: 'Maturing', start: 120, end: 150, icon: '🧺' },
    ],
    irrigationDays: 10,
    fertilizerDays: 28,
    pesticideDays: 10,
    irrigationTip: 'Irrigate every 10 days. Avoid waterlogging.',
    fertilizerTip: 'Foliar spray of potassium at boll stage.',
    pesticideTip: 'Watch for bollworm.',
  },
  'Chilli': {
    duration: 150,
    stages: [
      { name: 'Planting', start: 0, end: 20, icon: '🌱' },
      { name: 'Vegetative', start: 20, end: 50, icon: '🌿' },
      { name: 'Flowering', start: 50, end: 85, icon: '🌼' },
      { name: 'Fruiting', start: 85, end: 150, icon: '🌶️' },
    ],
    irrigationDays: 7,
    fertilizerDays: 21,
    pesticideDays: 14,
    irrigationTip: 'Irrigate once a week.',
    fertilizerTip: 'Apply NPK 19:19:19 fortnightly.',
    pesticideTip: 'Spray neem oil every 14 days.',
  },
  'Maize': {
    duration: 110,
    stages: [
      { name: 'Emergence', start: 0, end: 20, icon: '🌱' },
      { name: 'Growth', start: 20, end: 45, icon: '🌿' },
      { name: 'Tasseling', start: 45, end: 75, icon: '🌽' },
      { name: 'Grain Fill', start: 75, end: 110, icon: '🌽' },
    ],
    irrigationDays: 8,
    fertilizerDays: 21,
    pesticideDays: 21,
    irrigationTip: 'Critical irrigation at tasseling.',
    fertilizerTip: 'Top-dress urea at knee height.',
    pesticideTip: 'Monitor for Fall Armyworm.',
  },
  'Tomato': {
    duration: 100,
    stages: [
      { name: 'Planting', start: 0, end: 20, icon: '🌱' },
      { name: 'Vegetative', start: 20, end: 45, icon: '🌿' },
      { name: 'Flowering', start: 45, end: 70, icon: '🌼' },
      { name: 'Harvesting', start: 70, end: 100, icon: '🍅' },
    ],
    irrigationDays: 5,
    fertilizerDays: 14,
    pesticideDays: 10,
    irrigationTip: 'Irrigate every 5–7 days.',
    fertilizerTip: 'Fertigate weekly via drip from flowering.',
    pesticideTip: 'Apply fungicide every 10 days.',
  },
  'Turmeric': {
    duration: 270,
    stages: [
      { name: 'Sprouting', start: 0, end: 45, icon: '🌱' },
      { name: 'Tillering', start: 45, end: 120, icon: '🌿' },
      { name: 'Formation', start: 120, end: 210, icon: '🟡' },
      { name: 'Maturation', start: 210, end: 270, icon: '🥗' },
    ],
    irrigationDays: 10,
    fertilizerDays: 30,
    pesticideDays: 21,
    irrigationTip: 'Irrigate every 10 days.',
    fertilizerTip: 'Top-dress with Urea + Potash.',
    pesticideTip: 'Watch for Leaf Blotch.',
  },
};

const DEFAULT_SCHEDULE = {
  duration: 120,
  stages: [
    { name: 'Growth', start: 0, end: 30, icon: '🌱' },
    { name: 'Developing', start: 30, end: 60, icon: '🌿' },
    { name: 'Producing', start: 60, end: 90, icon: '🌾' },
    { name: 'Harvest', start: 90, end: 120, icon: '🧺' },
  ],
  irrigationDays: 7,
  fertilizerDays: 21,
  pesticideDays: 14,
  irrigationTip: 'Irrigate based on soil moisture.',
  fertilizerTip: 'Apply balanced NPK fertilizer.',
  pesticideTip: 'Inspect fields weekly.',
};

// ─── Activity Config ──────────────────────────────────────────────────────────
const ACTIVITY_TYPES = [
  { value: 'Irrigation',  label: 'Watering',     icon: '💧', color: 'bg-blue-100/50 text-blue-700 border-blue-200' },
  { value: 'Fertilizer',  label: 'Fertilizer',   icon: '🧪', color: 'bg-green-100/50 text-green-700 border-green-200' },
  { value: 'Pesticide',   label: 'Spray',        icon: '🐛', color: 'bg-red-100/50 text-red-700 border-red-200' },
  { value: 'Weeding',     label: 'Weeding',      icon: '🍃', color: 'bg-lime-100/50 text-lime-700 border-lime-200' },
  { value: 'Other',       label: 'Other',        icon: '📝', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

const getActivityConfig = (type: string) =>
  ACTIVITY_TYPES.find(a => a.value === type) || ACTIVITY_TYPES[4];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const daysSince = (dateStr: string) => {
  if (!dateStr) return 0;
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
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

// ─── Component ────────────────────────────────────────────────────────────────
const CropTimeline = () => {
  useTitle('Field Console');
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'progress' | 'tasks'>('log');

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
      const res = await apiService.farms.getAll();
      const data: Farm[] = res.data.farms || [];
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

  const getLifecycleStats = (farm: Farm) => {
    const schedule = CROP_SCHEDULE[farm.cropName] || DEFAULT_SCHEDULE;
    const daysPassed = daysSince(farm.startDate);
    const progress = Math.min(100, Math.max(0, (daysPassed / schedule.duration) * 100));
    const currentStageIndex = schedule.stages.findIndex(s => daysPassed >= s.start && daysPassed < s.end);
    const resolvedIndex = currentStageIndex === -1 ? (daysPassed >= schedule.duration ? schedule.stages.length - 1 : 0) : currentStageIndex;
    
    return {
      daysPassed,
      remaining: Math.max(0, schedule.duration - daysPassed),
      progress,
      currentStageIndex: resolvedIndex,
      stages: schedule.stages,
      duration: schedule.duration
    };
  };

  const buildTimeline = (farm: Farm) => {
    const events: any[] = [];
    events.push({ id: 'sow', label: 'Cycle Started', type: 'Sowing', detail: 'Sowing complete', date: farm.startDate, icon: '🌱', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' });

    (farm.activities || []).forEach(act => {
      const cfg = getActivityConfig(act.type);
      events.push({ id: act.id, label: act.type, type: act.type, detail: act.productName || act.type, date: act.appliedDate, icon: cfg.icon, color: cfg.color });
    });

    if (farm.status === 'HARVESTED' && farm.endDate) {
      events.push({ id: 'hv', label: 'Harvested', type: 'Harvest', detail: 'Crop cycle end', date: farm.endDate, icon: '📦', color: 'bg-blue-50 text-blue-700 border-blue-100' });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const recommendations = selectedFarm ? [
    { label: 'Watering', due: daysUntil((CROP_SCHEDULE[selectedFarm.cropName] || DEFAULT_SCHEDULE).irrigationDays, selectedFarm.activities?.find(a => a.type === 'Irrigation')?.appliedDate || selectedFarm.startDate), icon: '💧' },
    { label: 'Fertilizer', due: daysUntil((CROP_SCHEDULE[selectedFarm.cropName] || DEFAULT_SCHEDULE).fertilizerDays, selectedFarm.activities?.find(a => a.type === 'Fertilizer')?.appliedDate || selectedFarm.startDate), icon: '🧪' },
    { label: 'Protection', due: daysUntil((CROP_SCHEDULE[selectedFarm.cropName] || DEFAULT_SCHEDULE).pesticideDays, selectedFarm.activities?.find(a => a.type === 'Pesticide')?.appliedDate || selectedFarm.startDate), icon: '🛡️' },
  ] : [];

  const lifecyle = selectedFarm ? getLifecycleStats(selectedFarm) : null;
  const timeline = selectedFarm ? buildTimeline(selectedFarm) : [];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
      <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Accessing Cloud Farm Data...</p>
    </div>
  );

  if (farms.length === 0) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
       <EmptyState 
         title="No Cloud Data Found"
         description="You haven't registered any active field operations. Add your first crop in 'My Farm' to enable the console."
         actionLabel="Add First Crop"
         actionLink="/farm-profile"
       />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* ── SIDEBAR CONSOLE ── */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-auto md:h-screen md:sticky md:top-0">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Active Field Units</h2>
           <div className="space-y-2">
             {farms.map(farm => {
               const isActive = selectedFarm?.id === farm.id;
               const crop = getCrop(farm.cropName);
               return (
                 <button 
                   key={farm.id} 
                   onClick={() => setSelectedFarm(farm)}
                   className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border ${
                     isActive ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'
                   }`}
                 >
                   <span className="text-2xl">{crop.emoji}</span>
                   <div className="text-left">
                     <p className={`font-bold text-sm ${isActive ? 'text-emerald-900' : 'text-slate-700'}`}>{farm.cropName}</p>
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{farm.fieldSizeAcres} Acres • {farm.status}</p>
                   </div>
                 </button>
               );
             })}
           </div>
        </div>
        <div className="mt-auto p-6 bg-slate-50/50">
           <button onClick={() => navigate('/farm-profile')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition text-sm">
             <span>➕</span> Add New Field Record
           </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Toolbar */}
        <header className="bg-white border-b border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xl shadow-lg shadow-slate-200">📊</div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedFarm?.cropName} <span className="text-slate-400 ml-2">Console</span></h1>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Established {formatDate(selectedFarm?.startDate || "")}
                </p>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="hidden lg:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                 <span>📩</span> Export PDF Report
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition transform active:scale-95"
              >
                Log Field Activity
              </button>
           </div>
        </header>

        <div className="p-6 space-y-6">
           
           {/* Industrial Growth Stepper */}
           <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Growth Metrics</h3>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">Day {lifecyle?.daysPassed} <span className="text-slate-300">/ {lifecyle?.duration}</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-black text-emerald-600">{lifecyle?.progress.toFixed(0)}% <span className="text-xs text-slate-400 font-bold uppercase ml-1">Cycle Complete</span></p>
                 </div>
              </div>

              {/* Modern Linear Stepper */}
              <div className="relative pt-4 pb-8">
                 <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
                 <div 
                   className="absolute top-1/2 left-0 h-1.5 bg-emerald-600 -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(5,150,105,0.4)]"
                   style={{ width: `${lifecyle?.progress}%` }}
                 />
                 
                 <div className="flex justify-between relative z-10">
                    {lifecyle?.stages.map((stage, idx) => {
                      const isPast = idx < lifecyle.currentStageIndex;
                      const isCurrent = idx === lifecyle.currentStageIndex;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                           <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center text-sm transition-all duration-500 ${
                             isPast ? 'bg-emerald-600 border-emerald-50 text-white' : 
                             isCurrent ? 'bg-white border-emerald-600 shadow-xl scale-110' : 
                             'bg-slate-50 border-white text-slate-300'
                           }`}>
                             {stage.icon}
                           </div>
                           <p className={`mt-4 text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-emerald-900 underline' : 'text-slate-400'}`}>{stage.name}</p>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>

           {/* Tabbed Interface */}
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col flex-1">
              
              {/* Tab Switcher */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                 {(['log', 'progress', 'tasks'] as const).map(tab => (
                   <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                      activeTab === tab ? 'bg-white border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                   >
                     {tab === 'log' ? '🖥️ System Log' : tab === 'progress' ? '📈 Stage Analysis' : '📋 Task Queue'}
                   </button>
                 ))}
              </div>

              <div className="p-8">
                 {activeTab === 'log' && (
                   <div className="space-y-2">
                     {timeline.length === 1 ? (
                       <div className="text-center py-20 text-slate-300">
                          <p className="font-bold text-sm italic">Initialize device activity to populate log...</p>
                       </div>
                     ) : (
                       <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
                         {timeline.map((event) => (
                           <div key={event.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition group">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${event.color}`}>
                                    {event.icon}
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-800 text-sm">[{event.label}] <span className="font-medium text-slate-400 ml-2">{event.detail}</span></p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 tracking-tighter">TIMESTAMP_ISO: {new Date(event.date).toISOString()}</p>
                                 </div>
                              </div>
                              <span className="text-[10px] font-black text-slate-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">STATUS: RECORDED</span>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                 )}

                 {activeTab === 'tasks' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {recommendations.map((rec, i) => {
                         const isDue = rec.due !== null && rec.due <= 0;
                         return (
                           <div key={i} className={`p-6 rounded-2xl border ${isDue ? 'border-red-100 bg-red-50/30' : 'border-slate-100 bg-slate-50/30'} flex flex-col justify-between`}>
                              <div className="flex justify-between items-start mb-6">
                                 <span className="text-4xl">{rec.icon}</span>
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                                   isDue ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                                 }`}>
                                   {isDue ? 'Priority: High' : 'Status: Nominal'}
                                 </span>
                              </div>
                              <div>
                                 <h4 className="text-lg font-black text-slate-900">{rec.label}</h4>
                                 <p className={`text-xs font-bold mt-1 ${isDue ? 'text-red-600' : 'text-slate-500'}`}>
                                    {isDue ? 'Action needed immediately' : `Scheduled in ${rec.due} days`}
                                 </p>
                              </div>
                              <button onClick={() => setShowModal(true)} className="mt-8 text-[10px] font-black text-emerald-600 uppercase hover:underline">
                                 Commit Task →
                              </button>
                           </div>
                         );
                       })}
                    </div>
                 )}

                 {activeTab === 'progress' && (
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 bg-slate-900 rounded-2xl text-white">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Current Stage Details</h4>
                            <div className="space-y-4">
                               <div className="flex justify-between border-b border-slate-800 pb-2">
                                  <span className="text-slate-500 text-xs font-bold">STAGE_NAME</span>
                                  <span className="font-black text-emerald-400">{lifecyle?.stages[lifecyle.currentStageIndex]?.name}</span>
                               </div>
                               <div className="flex justify-between border-b border-slate-800 pb-2">
                                  <span className="text-slate-500 text-xs font-bold">DAYS_ACCUMULATED</span>
                                  <span className="font-black">{lifecyle?.daysPassed}d</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="text-slate-500 text-xs font-bold">DAYS_REMAINING</span>
                                  <span className="font-black text-blue-400">{lifecyle?.remaining}d</span>
                               </div>
                            </div>
                         </div>
                         <div className="p-6 bg-emerald-700 rounded-2xl text-white shadow-xl shadow-emerald-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-6">Environmental Signal</h4>
                            <div className="flex items-center gap-6">
                               <span className="text-6xl">⛅</span>
                               <div>
                                  <p className="font-black text-xl leading-snug tracking-tighter">Safe for Spraying & Application</p>
                                  <p className="text-xs text-emerald-100 font-medium mt-1">Wind speed and humidity levels are within industrial safety thresholds.</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Industrial Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
           <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200 border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                 <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                   <span className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center text-sm">📅</span>
                   Log Field Operation
                 </h1>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddActivity} className="space-y-6">
                 <div className="grid grid-cols-2 gap-3">
                   {ACTIVITY_TYPES.map(a => (
                      <button 
                        key={a.value} 
                        type="button" 
                        onClick={() => setForm({...form, type: a.value})}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          form.type === a.value ? 'bg-emerald-50 border-emerald-600' : 'border-slate-50 hover:border-slate-200'
                        }`}
                      >
                         <span className="text-2xl block mb-2">{a.icon}</span>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${form.type === a.value ? 'text-emerald-700' : 'text-slate-400'}`}>
                           {a.label}
                         </span>
                      </button>
                   ))}
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Item/Product Description</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all"
                         placeholder="e.g. 50kg Urea N46%"
                         value={form.productName}
                         onChange={e => setForm({...form, productName: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">Date of Operation</label>
                       <input 
                         type="date" 
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all uppercase"
                         value={form.appliedDate}
                         onChange={e => setForm({...form, appliedDate: e.target.value})}
                       />
                    </div>
                 </div>

                 <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {saving ? <Loader2 className="animate-spin text-emerald-400" /> : <CheckCircle2 size={16} />} commit record
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CropTimeline;
