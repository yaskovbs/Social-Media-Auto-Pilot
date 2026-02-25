import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Smartphone, Fingerprint, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Security() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl space-y-12"
    >
      <header className="space-y-2">
        <div className="flex items-center gap-3 text-red-500 mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Security Center</span>
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">אבטחת חשבון</h2>
        <p className="text-slate-400 text-lg">נהל את הגדרות האבטחה והגנה על החשבון שלך.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* 2FA Section */}
        <section className="bg-[#121214] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600/10 rounded-3xl flex items-center justify-center text-red-500 shadow-2xl">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-white text-2xl tracking-tight">אימות דו-שלבי (2FA)</h3>
                <p className="text-slate-500 font-bold mt-1">הוסף שכבת הגנה נוספת לחשבון שלך.</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${is2FAEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {is2FAEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="flex items-start gap-6 p-8 bg-white/[0.02] rounded-[32px] border border-white/5">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                <Fingerprint className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="font-black text-white">אימות באמצעות אפליקציה</h4>
                  <p className="text-sm text-slate-500 mt-1">השתמש באפליקציות כמו Google Authenticator או Authy כדי לקבל קודי אימות.</p>
                </div>
                <button 
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${is2FAEnabled ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-600/20'}`}
                >
                  {is2FAEnabled ? 'השבת אימות דו-שלבי' : 'הפעל אימות דו-שלבי'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
                <div className="flex items-center gap-3 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Recommended</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">אימות דו-שלבי מגן עליך מפני גישה לא מורשית גם אם הסיסמה שלך נגנבה.</p>
              </div>
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
                <div className="flex items-center gap-3 text-amber-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Backup Codes</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">וודא ששמרת את קודי הגיבוי שלך במקום בטוח למקרה שתאבד את המכשיר.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-[#121214] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">שינוי סיסמה</h3>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">סיסמה נוכחית</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">סיסמה חדשה</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-[0.98]">
              עדכן סיסמה
            </button>
          </div>
        </section>
      </div>

      <div className="pt-12 border-t border-white/5 flex justify-between items-center">
        <Link to="/settings" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold">
          <ArrowRight className="w-4 h-4 rotate-180" />
          חזרה להגדרות
        </Link>
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">AutoSocial Security Engine v1.0</p>
      </div>
    </motion.div>
  );
}
