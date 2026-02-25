import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Share2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>({ synced: 0, posted: 0, pending: 0, errors: 0 });
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/activity')
      ]);
      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      setStats(statsData);
      setActivity(activityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      className="space-y-12"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">לוח בקרה</h2>
          <p className="text-slate-400 mt-2 text-lg">סקירה כללית של ביצועי האוטומציה והפרסומים שלך.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 rtl:space-x-reverse">
            {['tiktok', 'instagram', 'facebook', 'x'].map((p) => (
              <div key={p} className="w-10 h-10 rounded-xl bg-[#121214] border-2 border-[#0A0A0B] flex items-center justify-center shadow-xl">
                <img src={`https://www.google.com/s2/favicons?domain=${p === 'x' ? 'twitter.com' : p + '.com'}&sz=32`} className="w-5 h-5 grayscale opacity-50" alt="" />
              </div>
            ))}
          </div>
          <button 
            onClick={fetchData}
            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/5 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            רענן נתונים
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'סרטונים שסונכרנו', value: stats.synced, icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'פורסמו בהצלחה', value: stats.posted, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'ממתינים לפרסום', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'שגיאות פרסום', value: stats.errors, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#121214] p-8 rounded-[40px] border border-white/5 shadow-2xl group hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-transform group-hover:scale-110 duration-500 ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Data</div>
            </div>
            <p className="text-4xl font-black text-white tracking-tight">{stat.value}</p>
            <p className="text-slate-500 font-bold mt-1 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-[#121214] rounded-[48px] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent opacity-20" />
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              פעילות אחרונה
            </h3>
            <button className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">צפה בהכל</button>
          </div>
          
          <div className="space-y-4">
            {activity.length > 0 ? activity.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-800 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <img src={`https://picsum.photos/seed/${item.id}/100/100`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-red-500 transition-colors">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.platform}</span>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="text-[10px] text-slate-600 font-bold">לפני 2 שעות</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest">Success</span>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-white/[0.01] rounded-[32px] border border-dashed border-white/10">
                <p className="text-slate-500 font-bold">אין פעילות להצגה כרגע</p>
              </div>
            )}
          </div>
        </div>

        {/* Platform Status */}
        <div className="bg-[#121214] rounded-[48px] border border-white/5 p-10 shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-red-500" />
            </div>
            חיבורים
          </h3>
          <div className="space-y-6">
            {['TikTok', 'Instagram', 'Facebook', 'X (Twitter)'].map((p) => (
              <div key={p} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-red-600/10 transition-colors">
                    <img src={`https://www.google.com/s2/favicons?domain=${p.toLowerCase().includes('x') ? 'twitter.com' : p.toLowerCase() + '.com'}&sz=32`} className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" alt="" />
                  </div>
                  <span className="text-sm font-black text-white">{p}</span>
                </div>
                <button className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors">Connect</button>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-red-600/5 rounded-3xl border border-red-600/10">
            <p className="text-xs text-red-500/80 font-bold leading-relaxed">
              שים לב: חלק מהחיבורים דורשים אימות מחדש כל 30 יום מטעמי אבטחה.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
