import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  FileVideo, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Youtube,
  Share2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USER_PHOTO = "https://picsum.photos/seed/user/200/200";

const navItems = [
  { label: 'דשבורד', icon: LayoutDashboard, path: '/' },
  { label: 'ניהול תוכן', icon: FileVideo, path: '/content' },
  { label: 'אוטומציה', icon: Zap, path: '/automation' },
  { label: 'הגדרות', icon: Settings, path: '/settings' },
];

export default function Layout({ children, user, onLogout }: { children: React.ReactNode, user: any, onLogout: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 flex font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 w-80 bg-[#121214] border-l border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Brand */}
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/30">
            <Share2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-tight">Social Media Auto Pilot</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Sync Engine</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group",
                  isActive 
                    ? "bg-red-600 text-white shadow-xl shadow-red-600/20" 
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-slate-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar_url || USER_PHOTO}
                alt="Profile"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#121214] rounded-full shadow-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-bold transition-all border border-white/5 active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
              התנתקות
            </button>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link to="/privacy" className="text-[9px] font-bold text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors">Privacy</Link>
              <div className="w-1 h-1 bg-slate-800 rounded-full" />
              <Link to="/terms" className="text-[9px] font-bold text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#121214] border-b border-white/5">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Share2 className="w-6 h-6 text-red-600" />
            <span className="font-bold text-white text-xs">Social Media Auto Pilot</span>
          </div>
          <div className="w-10" />
        </header>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 p-4 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
