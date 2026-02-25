import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0A0B] text-slate-300 py-20 px-6 font-sans" 
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-6 text-center">
          <div className="w-20 h-20 bg-red-600/10 rounded-[28px] flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">מדיניות פרטיות</h1>
          <p className="text-slate-500 text-lg uppercase tracking-widest font-bold">Social Media Auto Pilot Privacy Policy</p>
        </header>

        <div className="bg-[#121214] p-10 rounded-[48px] border border-white/5 shadow-2xl space-y-8 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">1. איסוף מידע</h2>
            <p>
              אנו אוספים מידע בסיסי מחשבון ה-Google שלך בעת ההתחברות (שם, אימייל ותמונת פרופיל) כדי ליצור עבורך חשבון במערכת. 
              בנוסף, אנו מבקשים גישה לקריאת נתוני ה-YouTube שלך כדי לסנכרן את הסרטונים שלך באופן אוטומטי.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">2. שימוש במידע</h2>
            <p>
              המידע שנאסף משמש אך ורק לצורך תפעול האפליקציה Social Media Auto Pilot: הצגת הסרטונים שלך בלוח הבקרה, יצירת קאפשנים באמצעות AI, וניהול סטטוס הפרסום ברשתות החברתיות שחיברת.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">3. אבטחת מידע</h2>
            <p>
              אנו נוקטים באמצעי אבטחה מתקדמים כדי להגן על המידע שלך. פרטי הגישה (Tokens) נשמרים בצורה מוצפנת ומאובטחת בבסיס הנתונים שלנו.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">4. שיתוף עם צד שלישי</h2>
            <p>
              איננו מוכרים או משתפים את המידע האישי שלך עם גורמים חיצוניים, למעט שירותי ה-API ההכרחיים לתפעול המערכת (כמו Google YouTube API ו-Gemini AI).
            </p>
          </section>
        </div>

        <div className="text-center space-y-4">
          <p className="text-xs text-slate-600">
            Social Media Auto Pilot - {new Date().getFullYear()}
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 text-red-500 font-black uppercase tracking-widest hover:text-red-400 transition-colors">
            חזרה להתחברות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
