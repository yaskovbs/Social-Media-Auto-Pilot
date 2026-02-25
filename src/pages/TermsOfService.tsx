import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
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
            <FileText className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">תנאי שימוש</h1>
          <p className="text-slate-500 text-lg uppercase tracking-widest font-bold">Social Media Auto Pilot Terms of Service</p>
        </header>

        <div className="bg-[#121214] p-10 rounded-[48px] border border-white/5 shadow-2xl space-y-8 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">1. קבלת התנאים</h2>
            <p>
              בשימוש באפליקציית Social Media Auto Pilot, אתה מסכים להיות מחויב לתנאי שימוש אלו. אם אינך מסכים לאחד התנאים, עליך להפסיק את השימוש בשירות באופן מיידי.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">2. תיאור השירות</h2>
            <p>
              Social Media Auto Pilot מספקת כלים לאוטומציה וניהול תוכן ברשתות חברתיות, כולל סנכרון מ-YouTube ויצירת קאפשנים מבוססי בינה מלאכותית.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">3. אחריות המשתמש</h2>
            <p>
              המשתמש אחראי באופן בלעדי על התוכן המפורסם דרך המערכת. עליך לוודא שהתוכן עומד בתנאי הקהילה של הפלטפורמות השונות (YouTube, TikTok, Instagram וכו').
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white">4. הגבלת אחריות</h2>
            <p>
              AutoSocial אינה אחראית לכל נזק ישיר או עקיף שייגרם כתוצאה מהשימוש בשירות, כולל חסימת חשבונות ברשתות חברתיות או אובדן נתונים.
            </p>
          </section>
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-red-500 font-black uppercase tracking-widest hover:text-red-400 transition-colors">
            חזרה להתחברות
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
