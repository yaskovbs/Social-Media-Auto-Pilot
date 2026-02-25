import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  SkipForward,
  Loader2,
  Sparkles,
  Edit3,
  X as CloseIcon,
  Tag,
  AlignLeft,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSocialCaption } from '../services/gemini';
import { Video, Platform, PostingStatus } from '../types';

const platforms: Platform[] = ['tiktok', 'instagram', 'facebook', 'x'];

const statusColors: Record<PostingStatus, string> = {
  posted: 'text-emerald-500 bg-emerald-500/10',
  pending: 'text-amber-500 bg-amber-500/10',
  failed: 'text-rose-500 bg-rose-500/10',
  skipped: 'text-slate-500 bg-slate-500/10',
  processing: 'text-blue-500 bg-blue-500/10 animate-pulse',
};

interface EditModalProps {
  video: Video;
  onClose: () => void;
  onSave: (id: string, metadata: any) => void;
}

function EditVideoModal({ video, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    customTitle: video.customTitle || video.title,
    customDescription: video.customDescription || video.description,
    customTags: video.customTags || video.tags || '',
    platformCaptions: {
      tiktok: video.platformCaptions?.tiktok || '',
      instagram: video.platformCaptions?.instagram || '',
      facebook: video.platformCaptions?.facebook || '',
      x: video.platformCaptions?.x || ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'platforms'>('general');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(video.id, formData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#121214] w-full max-w-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">עריכת פרטי סרטון</h3>
              <p className="text-xs text-slate-500">ערוך את המידע שיוצג ברשתות החברתיות</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b border-white/5 bg-black/10">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            מידע כללי
          </button>
          <button 
            onClick={() => setActiveTab('platforms')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'platforms' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            קאפשנים לפי פלטפורמה
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          {activeTab === 'general' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Type className="w-3 h-3" />
                  כותרת מותאמת
                </label>
                <input 
                  type="text"
                  value={formData.customTitle}
                  onChange={e => setFormData(f => ({ ...f, customTitle: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-all"
                  placeholder="הכנס כותרת..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <AlignLeft className="w-3 h-3" />
                  תיאור מותאם (ברירת מחדל)
                </label>
                <textarea 
                  rows={4}
                  value={formData.customDescription}
                  onChange={e => setFormData(f => ({ ...f, customDescription: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-all resize-none"
                  placeholder="הכנס תיאור..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Tag className="w-3 h-3" />
                  תיוגים (מופרדים בפסיקים)
                </label>
                <input 
                  type="text"
                  value={formData.customTags}
                  onChange={e => setFormData(f => ({ ...f, customTags: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-all"
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {platforms.map(p => (
                <div key={p} className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <img src={`https://www.google.com/s2/favicons?domain=${p === 'x' ? 'twitter.com' : p + '.com'}&sz=32`} className="w-3 h-3 grayscale" alt="" />
                    קאפשן עבור {p}
                  </label>
                  <textarea 
                    rows={2}
                    value={formData.platformCaptions[p]}
                    onChange={e => setFormData(f => ({ 
                      ...f, 
                      platformCaptions: { ...f.platformCaptions, [p]: e.target.value } 
                    }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all resize-none text-sm"
                    placeholder={`הכנס קאפשן ייחודי ל-${p}...`}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#121214] py-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
              שמור שינויים
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-4 rounded-2xl font-bold transition-all border border-white/10"
            >
              ביטול
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function ContentManager() {
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
      await fetchVideos();
    } catch (error) {
      alert('שגיאה בסנכרון');
    } finally {
      setSyncing(false);
    }
  };

  const updateStatus = async (videoId: string, platform: Platform, status: PostingStatus) => {
    try {
      await fetch(`/api/videos/${videoId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, status })
      });
      setVideos(prev => prev.map(v => 
        v.id === videoId 
          ? { ...v, status: { ...v.status, [platform]: status } }
          : v
      ));
    } catch (error) {
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const handleSaveMetadata = async (id: string, metadata: any) => {
    try {
      await fetch(`/api/videos/${id}/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      });
      setVideos(prev => prev.map(v => 
        v.id === id 
          ? { ...v, ...metadata }
          : v
      ));
    } catch (error) {
      alert('שגיאה בשמירת המידע');
    }
  };

  const handleGenerateCaption = async (video: Video, platform: Platform) => {
    setGeneratingCaption(`${video.id}-${platform}`);
    try {
      const caption = await generateSocialCaption(
        video.customTitle || video.title, 
        video.customDescription || video.description, 
        platform
      );
      if (caption) {
        // Automatically open edit modal with the new caption if user wants?
        // For now just alert and let them copy
        alert(`קאפשן נוצר עבור ${platform}:\n\n${caption}`);
      }
    } catch (error) {
      alert('שגיאה ביצירת קאפשן');
    } finally {
      setGeneratingCaption(null);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    (v.customTitle && v.customTitle.toLowerCase().includes(search.toLowerCase()))
  );

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
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">ניהול תוכן</h2>
          <p className="text-slate-400 mt-2">נהל ידנית את סטטוס הפרסום והמידע של הסרטונים שלך.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-bold transition-all border border-white/10 flex items-center gap-2 disabled:opacity-50"
        >
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          סנכרן מיוטיוב
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="חפש סרטונים או כותרות מותאמות..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#121214] border border-white/5 rounded-2xl px-12 py-4 text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <button className="bg-[#121214] border border-white/5 px-6 py-4 rounded-2xl text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          סינון
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-[#121214] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">סרטון</th>
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">סוג</th>
                {platforms.map(p => (
                  <th key={p} className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{p}</th>
                ))}
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-14 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate max-w-[250px]">
                          {video.customTitle || video.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-slate-500">{video.publishedAt}</p>
                          {video.customTitle && (
                            <span className="text-[8px] bg-red-600/10 text-red-500 px-1.5 py-0.5 rounded uppercase font-bold">Edited</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${video.videoType === 'short' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {video.videoType}
                    </span>
                  </td>
                  {platforms.map(p => {
                    const status = video.status[p] || 'pending';
                    return (
                      <td key={p} className="p-6">
                        <div className="flex flex-col gap-2">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${statusColors[status]}`}>
                            {status === 'posted' && <CheckCircle2 className="w-3 h-3" />}
                            {status === 'pending' && <Clock className="w-3 h-3" />}
                            {status === 'failed' && <AlertCircle className="w-3 h-3" />}
                            {status === 'skipped' && <SkipForward className="w-3 h-3" />}
                            {status}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleGenerateCaption(video, p)}
                              disabled={generatingCaption === `${video.id}-${p}`}
                              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                              title="צור קאפשן עם AI"
                            >
                              {generatingCaption === `${video.id}-${p}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            </button>
                            <select 
                              value={status}
                              onChange={(e) => updateStatus(video.id, p, e.target.value as PostingStatus)}
                              className="bg-transparent text-[9px] text-slate-500 border-none focus:ring-0 cursor-pointer font-bold uppercase"
                            >
                              <option value="pending">Pending</option>
                              <option value="posted">Posted</option>
                              <option value="failed">Failed</option>
                              <option value="skipped">Skipped</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingVideo(video)}
                        className="p-2.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                        title="ערוך פרטים"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <a 
                        href={`https://youtube.com/watch?v=${video.youtubeId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                        title="צפה ביוטיוב"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editingVideo && (
          <EditVideoModal 
            video={editingVideo} 
            onClose={() => setEditingVideo(null)} 
            onSave={handleSaveMetadata}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
