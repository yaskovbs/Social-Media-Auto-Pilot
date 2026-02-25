import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Youtube, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = '/auth/google';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !name)) return;
    
    setIsLoading(true);
    try {
      const endpoint = isRegisterMode ? '/api/register' : '/api/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = '/';
      } else {
        alert(data.message || 'הפעולה נכשלה');
      }
    } catch (error) {
      alert('שגיאה בחיבור לשרת');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-sans relative overflow-hidden" dir="rtl">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#121214] p-12 rounded-[48px] border border-white/10 shadow-2xl space-y-10 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-red-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-red-600/30">
            <Share2 className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Social Media Auto Pilot</h1>
            <p className="text-slate-400 text-sm font-bold">
              סנכרן ופרסם את סרטוני ה-YouTube שלך באופן אוטומטי ל-TikTok, Instagram ו-X.
            </p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-3">
          <h2 className="text-xs font-black text-red-500 uppercase tracking-widest">מטרת האפליקציה</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Social Media Auto Pilot עוזרת ליוצרי תוכן להרחיב את החשיפה שלהם על ידי הפצה אוטומטית של תוכן וידאו מפלטפורמת YouTube לרשתות חברתיות אחרות, תוך שימוש בבינה מלאכותית ליצירת קאפשנים מותאמים.
          </p>
        </div>
        
        <div className="space-y-4">
          {!showEmailLogin ? (
            <>
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Youtube className="w-6 h-6" />}
                התחבר עם Google
              </button>
              <button 
                onClick={() => setShowEmailLogin(true)}
                disabled={isLoading}
                className="w-full py-5 bg-white/5 text-slate-300 font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Mail className="w-5 h-5" />
                התחבר עם אימייל
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="flex border-b border-white/5 mb-6">
                <button 
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${!isRegisterMode ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-500'}`}
                >
                  התחברות
                </button>
                <button 
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${isRegisterMode ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-500'}`}
                >
                  הרשמה
                </button>
              </div>

              {isRegisterMode && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">שם מלא</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                    placeholder="ישראל ישראלי"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">אימייל</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">סיסמה</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRegisterMode ? 'הרשמה' : 'התחברות')}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowEmailLogin(false);
                  setIsRegisterMode(false);
                }}
                className="w-full text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                חזור לאפשרויות נוספות
              </button>
            </form>
          )}
        </div>
        
        <div className="pt-6 border-t border-white/5 space-y-4">
          <p className="text-center text-[10px] text-slate-600 leading-relaxed uppercase tracking-widest font-bold">
            בשימוש באפליקציה אתה מסכים <br />
            <Link to="/terms" className="text-slate-500 hover:text-red-500 cursor-pointer transition-colors">לתנאי השימוש</Link> ו<Link to="/privacy" className="text-slate-500 hover:text-red-500 cursor-pointer transition-colors">למדיניות הפרטיות</Link>
          </p>
          <div className="flex justify-center gap-4 text-[9px] text-slate-700 font-bold uppercase tracking-tighter">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
