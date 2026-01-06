
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Store } from '../types';
import { generateStoreBio } from '../services/geminiService';

const SOCIAL_PLATFORMS = [
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  { id: 'instagram', name: 'Instagram', color: '#E4405F', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.78-2.618 6.981-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.353-2.612-6.78-6.981-6.981C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id: 'telegram', name: 'Telegram', color: '#24A1DE', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.203 8.32l-1.761 8.303c-.13.585-.477.728-.967.453l-2.684-1.979-1.295 1.246c-.143.143-.263.263-.538.263l.192-2.73 4.97-4.492c.216-.192-.047-.3-.332-.11l-6.142 3.867-2.645-.826c-.575-.18-.585-.575.12-.852l10.332-3.98c.477-.18.895.105.748.83z"/></svg> },
  { id: 'snapchat', name: 'Snapchat', color: '#FFFC00', textColor: '#000', icon: <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24"><path d="M11.99 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 11.99 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12zM12 18.25c-.24 0-.46-.01-.67-.04-1.11-.13-1.63-.48-1.96-1.3-.06-.15-.1-.31-.1-.47 0-.39.15-.76.42-1.04l.21-.21c-.42-.18-.84-.42-1.22-.72-.34-.26-.63-.57-.86-.91-.32-.47-.46-.98-.4-1.51.05-.4.18-.75.4-1.05.28-.39.69-.64 1.15-.7.21-.03.41-.01.61.05.02-.12.04-.24.08-.36.16-.48.43-.9.79-1.23.43-.39.95-.59 1.54-.59s1.11.2 1.54.59c.36.33.63.75.79 1.23.04.12.06.24.08.36.2-.06.4-.08.61-.05.46.06.87.31 1.15.7.22.3.35.65.4 1.05.06.53-.08 1.04-.4 1.51-.23.34-.52.65-.86.91-.38.3-.8.54-1.22.72l.21.21c.27.28.42.65.42 1.04 0 .16-.04.32-.1.47-.33.82-.85 1.17-1.96 1.3-.21.03-.43.04-.67.04z"/></svg> },
  { id: 'tiktok', name: 'TikTok', color: '#000000', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31 0 2.591.215 3.793.63V4.96c-.799-.24-1.642-.365-2.503-.365-2.91 0-5.27 2.36-5.27 5.27v2.487c0 2.91 2.36 5.27 5.27 5.27s5.27-2.36 5.27-5.27V0h4.41c.209 2.115 1.258 4.02 2.894 5.342v4.41c-2.455 0-4.693-.934-6.393-2.463v8.196c0 5.234-4.244 9.478-9.478 9.478s-9.478-4.244-9.478-9.478c0-5.127 4.062-9.303 9.155-9.472V4.41C4.418 4.58 0 8.784 0 13.985c0 5.485 4.446 9.931 9.931 9.931s9.931-4.446 9.931-9.931V5.21c1.474.928 3.208 1.468 5.069 1.468v-4.41c-2.193 0-4.161-1.01-5.46-2.585l.004-.004v-.004c.148-.182.28-.376.395-.579h-4.41a9.922 9.922 0 01-2.935.441z"/></svg> },
  { id: 'x', name: 'X', color: '#000000', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg> },
  { id: 'threads', name: 'Threads', color: '#000000', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm0-11c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5z"/></svg> },
];

const StoreSettings: React.FC = () => {
  const navigate = useNavigate();
  const user = mockDb.getCurrentUser();
  const [store, setStore] = useState<Store | undefined>();
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeSocialField, setActiveSocialField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userStore = mockDb.getStoreByUserId(user.id);
    if (!userStore) {
      navigate('/setup');
      return;
    }
    setStore(userStore);
  }, [user?.id, navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStore(prev => prev ? {
          ...prev,
          settings: { ...prev.settings, [field]: reader.result as string }
        } : undefined);
      };
      reader.readAsDataURL(file as Blob);
    }
  };

  const handleAiBio = async () => {
    if (!store) return;
    setLoadingAi(true);
    const bio = await generateStoreBio(user?.storeName || 'My Store', store.settings.category);
    setStore({ ...store, settings: { ...store.settings, bio } });
    setLoadingAi(false);
  };

  const saveChanges = () => {
    if (store) {
      mockDb.saveStore(store);
      alert('Changes saved successfully!');
      navigate('/dashboard');
    }
  };

  if (!store) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10 text-center">
        <div>
          <h1 className="text-3xl font-black">Edit Store Profile</h1>
          <p className="text-gray-500">Update your branding and social presence.</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 font-bold hover:text-black">Cancel</button>
      </div>

      <div className="space-y-8">
        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          <h2 className="text-xl font-bold border-b pb-4">Branding</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest text-center">Logo</label>
              <div className="relative group w-32 h-32 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-all mx-auto">
                {store.settings.logoUrl ? <img src={store.settings.logoUrl} className="w-full h-full object-contain p-2" /> : <span className="text-2xl opacity-10">📸</span>}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest text-center">Banner</label>
              <div className="relative group h-32 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-all">
                {store.settings.bannerUrl ? <img src={store.settings.bannerUrl} className="w-full h-full object-cover" /> : <span className="text-2xl opacity-10">🖼️</span>}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'bannerUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Store Bio</label>
              <button onClick={handleAiBio} disabled={loadingAi} className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                {loadingAi ? 'AI Writing...' : '✨ Rewrite with AI'}
              </button>
            </div>
            <textarea 
              rows={3}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium"
              value={store.settings.bio || ''}
              onChange={(e) => setStore({...store, settings: { ...store.settings, bio: e.target.value }})}
            />
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold">Social Media Profiles</h2>
          <div className="flex flex-wrap gap-4">
            {SOCIAL_PLATFORMS.map(p => {
              const hasLink = (store.settings.socialLinks as any)?.[p.id];
              return (
                <button 
                  key={p.id}
                  onClick={() => setActiveSocialField(p.id)}
                  style={{ backgroundColor: hasLink ? p.color : '#f3f4f6', color: hasLink ? (p.textColor || 'white') : '#d1d5db' }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-sm ${activeSocialField === p.id ? 'ring-4 ring-green-100 ring-offset-2' : ''}`}
                >
                  {p.icon}
                </button>
              );
            })}
          </div>

          {activeSocialField && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-6 animate-in fade-in duration-300">
              <p className="text-xs font-black uppercase text-gray-400 mb-2">{SOCIAL_PLATFORMS.find(p => p.id === activeSocialField)?.name} Link</p>
              <input 
                type="url"
                className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-medium"
                value={(store.settings.socialLinks as any)?.[activeSocialField] || ''}
                onChange={(e) => setStore({
                  ...store,
                  settings: {
                    ...store.settings,
                    socialLinks: { ...store.settings.socialLinks, [activeSocialField]: e.target.value }
                  }
                })}
              />
            </div>
          )}
        </section>

        <button 
          onClick={saveChanges}
          className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-green-100 hover:bg-green-700 transition-all"
        >
          Update Store Profile
        </button>
      </div>
    </div>
  );
};

export default StoreSettings;
