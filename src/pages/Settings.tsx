import React from 'react';
import { 
  Youtube, 
  Globe, 
  Lock, 
  Bell,
  Trash2,
  ExternalLink,
  Shield,
  User,
  CreditCard,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';

import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl space-y-12"
    >
      <header>
        <h2 className="text-4xl font-black text-white tracking-tight">הגדרות חשבון</h2>
        <p className="text-slate-400 mt-2 text-lg">נהל את החיבורים, האבטחה והעדפות המערכת שלך.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* YouTube Connection */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121214] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl"
        >
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-red-600/[0.03]">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-red-600/20">
                <Youtube className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-white text-2xl tracking-tight">YouTube</h3>
                <p className="text-slate-500 font-bold mt-1">ערוץ מחובר: <span className="text-red-500">המתכנת הישראלי</span></p>
              </div>
            </div>
            <button className="text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors">נתק ערוץ</button>
          </div>
          <div className="p-10 space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-red-600/10 transition-colors">
                  <Globe className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-black text-white">סנכרון אוטומטי</span>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">סנכרן סרטונים חדשים ברגע שהם עולים</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Social Connections */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-white tracking-tight">חיבורי רשתות חברתיות</h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">3 מתוך 4 מחוברים</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'TikTok', connected: true, user: '@israel_dev' },
              { name: 'Instagram', connected: true, user: '@israel.codes' },
              { name: 'Facebook', connected: false, user: null },
              { name: 'X (Twitter)', connected: true, user: '@israel_tech' },
            ].map((platform, i) => (
              <motion.div 
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#121214] p-8 rounded-[32px] border border-white/5 flex items-center justify-between shadow-xl group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-red-600/10 transition-colors">
                    <img src={`https://www.google.com/s2/favicons?domain=${platform.name.toLowerCase().includes('x') ? 'twitter.com' : platform.name.toLowerCase() + '.com'}&sz=32`} className="w-7 h-7 grayscale group-hover:grayscale-0 transition-all" alt="" />
                  </div>
                  <div>
                    <p className="font-black text-white">{platform.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{platform.connected ? platform.user : 'לא מחובר'}</p>
                  </div>
                </div>
                <button className={`px-6 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${platform.connected ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'}`}>
                  {platform.connected ? 'נתק' : 'חבר'}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#121214] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">התראות מערכת</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'התראות על פרסום מוצלח', desc: 'קבל עדכון כשהתוכן עלה לאוויר' },
                { label: 'התראות על שגיאות', desc: 'קבל עדכון אם פרסום נכשל' },
                { label: 'דוחות שבועיים', desc: 'סיכום ביצועים שבועי באימייל' },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-red-500 transition-colors">{item.label}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6 accent-red-600 rounded-lg" />
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#121214] p-10 rounded-[40px] border border-white/5 space-y-8 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">אבטחה ופרטיות</h3>
            </div>
            <div className="space-y-4">
              <Link to="/security" className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-white transition-all border border-white/5 flex items-center justify-between px-8 group">
                הגדרות אבטחה ו-2FA
                <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </Link>
              <Link to="/privacy" className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-white transition-all border border-white/5 flex items-center justify-between px-8 group">
                מדיניות פרטיות
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </Link>
              <Link to="/terms" className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-white transition-all border border-white/5 flex items-center justify-between px-8 group">
                תנאי שימוש
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </Link>
              <button className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-white transition-all border border-white/5 flex items-center justify-between px-8 group">
                שנה סיסמה
                <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-white transition-all border border-white/5 flex items-center justify-between px-8 group">
                אימות דו-שלבי
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg uppercase">Active</span>
              </button>
              <button className="w-full py-5 text-rose-500 hover:text-rose-400 text-sm font-black transition-colors flex items-center justify-center gap-3 mt-4">
                <Trash2 className="w-4 h-4" />
                מחק חשבון לצמיתות
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
