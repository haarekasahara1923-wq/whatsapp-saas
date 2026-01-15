
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { STORE_TEMPLATES, SOCIAL_PLATFORMS, CATEGORIES, PRICING_PLANS, slugify } from '../constants';
import { SubscriptionPlan, Store, StoreStatus, SocialLinks } from '../types';
import { generateStoreBio } from '../services/geminiService';



const StoreSetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const user = mockDb.getCurrentUser();
  const [step, setStep] = useState(1);
  const [loadingAi, setLoadingAi] = useState(false);
  const [formData, setFormData] = useState({
    category: CATEGORIES[0],
    templateId: STORE_TEMPLATES[0].id,
    whatsappNumber: user?.whatsappNumber || '',
    logoUrl: '',
    bannerUrl: '',
    bio: '',
    plan: (user as any)?.selectedPlan || 'monthly',
    socialLinks: {} as SocialLinks
  });

  const [activeSocialField, setActiveSocialField] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const existingStore = mockDb.getStoreByUserId(user.id);
    if (existingStore && existingStore.setupPaid) {
      navigate('/dashboard');
    }
  }, [user?.id, navigate]);

  const saveDraftStore = (isFinal: boolean = false) => {
    if (!user) return;
    const draft: Store = {
      id: user.id + '_store',
      userId: user.id,
      templateId: formData.templateId,
      status: StoreStatus.ACTIVE,
      subscriptionType: formData.plan as SubscriptionPlan,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      setupPaid: isFinal,
      settings: {
        category: formData.category,
        primaryColor: STORE_TEMPLATES.find(t => t.id === formData.templateId)?.config.primaryColor || '#16a34a',
        templateId: formData.templateId,
        whatsappNumber: formData.whatsappNumber,
        logoUrl: formData.logoUrl,
        bannerUrl: formData.bannerUrl,
        bio: formData.bio,
        socialLinks: formData.socialLinks
      }
    };
    mockDb.saveStore(draft);
    return draft;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'bannerUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file as Blob);
    }
  };

  const handleAiBio = async () => {
    setLoadingAi(true);
    const bio = await generateStoreBio(user?.storeName || 'My Store', formData.category);
    setFormData(prev => ({ ...prev, bio }));
    setLoadingAi(false);
  };

  const handleSocialLink = (platformId: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platformId]: url }
    }));
  };

  const handlePayment = () => {
    const options = {
      key: 'rzp_live_RsbFKZwt1ZtSQF',
      amount: 39900,
      currency: 'INR',
      name: 'WS-Store SaaS',
      description: 'Store Activation Fee',
      handler: function (response: any) {
        if (response.razorpay_payment_id) {
          saveDraftStore(true);
          navigate('/dashboard');
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.whatsappNumber
      },
      theme: { color: '#16a34a' }
    };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  };



  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black mb-2">Build Your Store</h1>
        <div className="flex justify-center items-center space-x-2 mt-6">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {s}
              </div>
              {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 min-h-[500px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h2 className="text-2xl font-black mb-2 text-center">Pick Your Theme</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center">Choose a style that fits your niche</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
              {STORE_TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => setFormData({ ...formData, templateId: t.id, category: t.niche })}
                  className={`cursor-pointer rounded-2xl border-4 transition-all overflow-hidden ${formData.templateId === t.id ? 'border-green-500 scale-[1.02] shadow-xl' : 'border-transparent hover:border-gray-200 opacity-60 hover:opacity-100'}`}
                >
                  <img src={t.thumbnail} className="h-40 w-full object-cover" />
                  <div className="p-4 bg-white flex justify-between items-center">
                    <div>
                      <p className="font-black text-sm">{t.name}</p>
                    </div>
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded font-black uppercase tracking-widest">{t.niche}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-95">
              Next: Branding
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div>
              <h2 className="text-2xl font-black mb-2 text-center">Store Branding</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center">Make your store stand out</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Logo</label>
                <div className="border-2 border-dashed border-gray-100 rounded-3xl h-36 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} className="w-full h-full object-contain p-4" />
                  ) : (
                    <span className="text-gray-300 text-[10px] font-black uppercase">Upload</span>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">Banner</label>
                <div className="border-2 border-dashed border-gray-100 rounded-3xl h-36 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group">
                  {formData.bannerUrl ? (
                    <img src={formData.bannerUrl} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-300 text-[10px] font-black uppercase">Upload</span>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'bannerUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Store Bio</label>
                <button onClick={handleAiBio} disabled={loadingAi} className="text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 hover:bg-green-100">
                  {loadingAi ? 'AI Generating...' : '✨ Write Bio with AI'}
                </button>
              </div>
              <textarea
                rows={2}
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm"
                placeholder="Ex: Premium handcrafted jewelry..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Socials</label>
              <div className="flex flex-wrap gap-4">
                {SOCIAL_PLATFORMS.map(p => {
                  const hasLink = (formData.socialLinks as any)[p.id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveSocialField(p.id)}
                      style={{ backgroundColor: hasLink ? p.color : '#f3f4f6', color: hasLink ? ((p as any).textColor || 'white') : '#d1d5db' }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-sm ${activeSocialField === p.id ? 'ring-4 ring-green-100 ring-offset-2' : ''}`}
                    >
                      {p.icon}
                    </button>
                  );
                })}
              </div>

              {activeSocialField && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <input
                    type="url"
                    className="w-full p-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-green-500 font-medium"
                    placeholder={`Paste link for ${activeSocialField}...`}
                    value={(formData.socialLinks as any)[activeSocialField] || ''}
                    onChange={(e) => handleSocialLink(activeSocialField, e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all">Back</button>
              <button onClick={() => {
                saveDraftStore();
                setStep(3);
              }} className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-green-700 transition-all">Preview Store</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-black text-center">Confirm Profile</h2>
            <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-2xl">
              <div className="h-40 bg-gray-100 relative">
                {formData.bannerUrl ? <img src={formData.bannerUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-r from-green-50 to-green-100" />}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center overflow-hidden z-10">
                  {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain p-1" /> : <div className="w-full h-full bg-green-500 text-white font-black text-4xl flex items-center justify-center">{user?.storeName.charAt(0)}</div>}
                </div>
              </div>
              <div className="pt-14 pb-8 px-8 text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-1">{user?.storeName}</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">{formData.category}</p>
                <p className="text-sm text-gray-600 font-medium mb-6 italic">"{formData.bio || 'Order via WhatsApp'}"</p>

                <div className="bg-green-50 p-3 rounded-xl border border-green-100 inline-flex items-center text-xs text-green-700 font-bold">
                  WA: {formData.whatsappNumber}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold">Back</button>
              <button
                onClick={() => setStep(4)}
                className="flex-[2] bg-green-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg"
              >
                Go to Activation
              </button>
            </div>
          </div>
        )}


        {step === 4 && (
          <div className="space-y-8 py-10 text-center animate-in zoom-in duration-500">
            <div>
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-4xl font-black">Ready to Launch?</h2>
              <p className="text-gray-500 font-medium mt-2 text-center">Complete setup to activate your store.</p>
            </div>

            {/* Plan Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => setFormData({ ...formData, plan: 'monthly' })}
                  className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${formData.plan === 'monthly' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setFormData({ ...formData, plan: 'yearly' })}
                  className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${formData.plan === 'yearly' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Dynamic Plan Display */}
            {formData.plan === 'yearly' ? (
              <div className="bg-gradient-to-br from-green-900 to-green-800 text-white p-10 rounded-3xl border-4 border-green-700 relative max-w-sm mx-auto shadow-xl">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">Yearly Deal</span>
                <h4 className="text-6xl font-black mb-1">₹2399</h4>
                <p className="text-xs text-green-200 font-black uppercase tracking-widest mb-6 text-center">/year</p>
                <div className="space-y-4 text-left border-t border-green-700 pt-6">
                  <p className="flex items-center text-sm font-bold text-green-100"><span className="text-yellow-400 mr-3">✓</span> Setup Fee (₹399) <strong className="ml-2 text-white">WAIVED</strong></p>
                  <p className="flex items-center text-sm font-bold text-green-100"><span className="text-yellow-400 mr-3">✓</span> Save ₹1500+ Annually</p>
                  <div className="mt-4 bg-green-800 p-3 rounded-xl text-xs text-center text-green-200">
                    Total Payable Now: <strong className="text-white text-lg">₹2399</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-white p-10 rounded-3xl border-2 border-green-100 relative max-w-sm mx-auto shadow-xl">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">Starter Offer</span>
                <h4 className="text-6xl font-black text-gray-900 mb-1">₹399</h4>
                <p className="text-xs text-green-700 font-black uppercase tracking-widest mb-6 text-center">One-time Setup Fee</p>
                <div className="space-y-4 text-left border-t border-green-100 pt-6">
                  <p className="flex items-center text-sm font-bold text-gray-600"><span className="text-green-500 mr-3">✓</span> 1st Month Subscription <strong className="ml-2 text-green-700">FREE</strong></p>
                  <p className="flex items-center text-sm font-bold text-gray-600"><span className="text-green-500 mr-3">✓</span> <span className="opacity-50 line-through mr-1">₹299</span> Pays ₹0 for Month 1</p>
                  <div className="mt-4 bg-green-50 p-3 rounded-xl text-xs text-center text-gray-500">
                    Subscription (₹299/mo) starts from <strong>2nd Month</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 max-w-sm mx-auto">
              <button
                onClick={() => {
                  const isYearly = formData.plan === 'yearly';
                  // Payment Logic: 399 for Monthly (Setup Only), 2399 for Yearly (Sub Only)
                  const amount = isYearly ? 239900 : 39900;
                  const description = isYearly ? 'Yearly Subscription' : 'Store Setup Fee';

                  const options = {
                    key: 'rzp_live_RsbFKZwt1ZtSQF',
                    amount: amount,
                    currency: 'INR',
                    name: 'WS-Store SaaS',
                    description: description,
                    handler: function (response: any) {
                      if (response.razorpay_payment_id) {
                        saveDraftStore(true);
                        navigate('/dashboard');
                      }
                    },
                    prefill: {
                      name: user?.name,
                      email: user?.email,
                      contact: user?.whatsappNumber
                    },
                    theme: { color: isYearly ? '#14532d' : '#16a34a' }
                  };

                  const script = document.createElement('script');
                  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                  script.onload = () => {
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                  };
                  document.body.appendChild(script);
                }}
                className={`w-full text-white py-6 rounded-2xl font-black text-2xl shadow-2xl transition-all hover:-translate-y-1 ${formData.plan === 'yearly' ? 'bg-green-800 hover:bg-green-900' : 'bg-green-600 hover:bg-green-700'
                  }`}
              >
                Pay & Launch 🚀
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StoreSetupWizard;
