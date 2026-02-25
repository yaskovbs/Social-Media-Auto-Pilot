import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Calendar, 
  ShieldCheck,
  AlertCircle,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Automation() {
  const [settings, setSettings] = useState({
    isEnabled: true,
    postIntervalMinutes: 30,
    maxPostsPerDay: 10,
    includeOldVideos: true,
    includeShorts: true,
    startTime: '09:00',
    endTime: '21:00'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('ההגדרות נשמרו בהצלחה');
    } catch (error) {
      alert('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl space-y-12"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">הגדרות אוטומציה</h2>
          <p className="text-slate-400 mt-2 text-lg">קבע את הכללים לפרסום האוטומטי שלך ברשתות.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className={`w-3 h-3 rounded-full ${settings.isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
            {settings.isEnabled ? 'Active' : 'Paused'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Status Card */}
        <div className="bg-[#121214] p-10 rounded-[40px] border border-white/5 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${settings.isEnabled ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">סטטוס אוטומציה</h3>
              <p className="text-slate-500 font-medium">{settings.isEnabled ? 'האוטומציה פעילה וסורקת סרטונים חדשים' : 'האוטומציה מושבתת כרגע'}</p>
            </div>
          </div>
          <button 
            onClick={() => setSettings(s => ({ ...s, isEnabled: !s.isEnabled }))}
            className={`px-10 py-4 rounded-2xl font-black text-sm transition-all relative z-10 shadow-xl active:scale-[0.98] ${settings.isEnabled ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'}`}
          >
            {settings.isEnabled ? 'השבת אוטומציה' : 'הפעל אוטומציה'}
          </button>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timing Rules */}
          <div className="bg-[#121214] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white">תזמון ומרווחים</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.1em]">מרווח בין פרסומים (דקות)</label>
                <input 
                  type="number" 
                  value={settings.postIntervalMinutes}
                  onChange={e => setSettings(s => ({ ...s, postIntervalMinutes: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.1em]">מקסימום פרסומים ביום</label>
                <input 
                  type="number" 
                  value={settings.maxPostsPerDay}
                  onChange={e => setSettings(s => ({ ...s, maxPostsPerDay: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Content Rules */}
          <div className="bg-[#121214] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white">כללי תוכן</h3>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                <div>
                  <p className="font-black text-white">כלול סרטונים ישנים</p>
                  <p className="text-xs text-slate-500 mt-1">פרסם סרטונים מהעבר בסדר כרונולוגי</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.includeOldVideos}
                    onChange={e => setSettings(s => ({ ...s, includeOldVideos: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                <div>
                  <p className="font-black text-white">כלול Shorts</p>
                  <p className="text-xs text-slate-500 mt-1">פרסם סרטונים קצרים באופן אוטומטי</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.includeShorts}
                    onChange={e => setSettings(s => ({ ...s, includeShorts: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Active Hours */}
        <div className="bg-[#121214] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white">שעות פעילות</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.1em]">שעת התחלה</label>
              <input 
                type="time" 
                value={settings.startTime}
                onChange={e => setSettings(s => ({ ...s, startTime: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 uppercase tracking-[0.1em]">שעת סיום</label>
              <input 
                type="time" 
                value={settings.endTime}
                onChange={e => setSettings(s => ({ ...s, endTime: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-[24px] font-black text-lg transition-all shadow-2xl shadow-red-600/30 flex items-center gap-3 disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            שמור הגדרות
          </button>
        </div>
      </div>
    </motion.div>
  );
}
