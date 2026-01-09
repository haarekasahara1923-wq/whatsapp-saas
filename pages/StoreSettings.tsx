
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Store } from '../types';
import { generateStoreBio } from '../services/geminiService';

import { SOCIAL_PLATFORMS } from '../constants';



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
              onChange={(e) => setStore({ ...store, settings: { ...store.settings, bio: e.target.value } })}
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
