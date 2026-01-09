
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Store, Product, StoreTemplate, ProductVariant, SocialLinks } from '../types';
import { STORE_TEMPLATES, SOCIAL_PLATFORMS } from '../constants';
import { Facebook, Instagram, Youtube, Twitter, MessageCircle } from 'lucide-react';

const PublicStore: React.FC = () => {
  const navigate = useNavigate();
  const { storeName: urlSlug } = useParams<{ storeName: string }>();
  const [store, setStore] = useState<Store | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [template, setTemplate] = useState<StoreTemplate | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestedSlug = urlSlug?.toLowerCase().trim();
    if (!requestedSlug) {
      setError(true);
      setErrorMsg('No store link provided.');
      setLoading(false);
      return;
    }

    const fetchStoreData = async () => {
      // @ts-ignore
      const result = await mockDb.fetchStoreBySlug(requestedSlug);

      if (result && result.data) {
        setStore(result.data.store);
        setProducts(result.data.products);
        setTemplate(STORE_TEMPLATES.find(t => t.id === result.data.store.templateId));
        setError(false);
      } else {
        setError(true);
        setErrorMsg(result?.error || 'Unknown Error');
      }
      setLoading(false);
    };

    fetchStoreData();
  }, [urlSlug]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedVariants({});
    }
  }, [selectedProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="text-8xl mb-6 grayscale opacity-20">🏪</div>
        <h2 className="text-3xl font-black mb-2 text-gray-900">Store Offline</h2>
        <p className="text-gray-500 mb-8 max-w-sm font-medium leading-relaxed">This store link is incorrect or the store is no longer active.</p>

        {/* Debug Info */}


        <button onClick={() => navigate('/')} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl">Return Home</button>
      </div>
    );
  }

  if (!store || !template) return null;

  const { config } = template;
  const categories: string[] = ['All', ...Array.from(new Set(products.map(p => p.category))) as string[]];

  const filteredProducts = products.filter(p => {
    const kw = searchTerm.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw);
    return matchesCategory && matchesSearch;
  });

  const calculateTotalPrice = (product: Product) => {
    let total = product.discountPrice || product.price;
    Object.values(selectedVariants).forEach((v: ProductVariant) => {
      total += (v.additionalPrice || 0);
    });
    return total;
  };

  const handleVariantToggle = (variant: ProductVariant) => {
    setSelectedVariants(prev => {
      const next = { ...prev };
      if (next[variant.type]?.id === variant.id) delete next[variant.type];
      else next[variant.type] = variant;
      return next;
    });
  };

  return (
    <div className={`min-h-screen ${config.fontFamily} bg-white pb-24`}>
      {/* CLEAN STORE HEADER - NO LOGIN LINKS */}
      <nav className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50">
              {store.settings.logoUrl ? <img src={store.settings.logoUrl} className="w-full h-full object-contain" /> : <span className="font-black text-[10px] text-gray-400">SHOP</span>}
            </div>
            <span className="font-black text-sm text-gray-900 uppercase tracking-tighter">
              {mockDb.getUsers().find(u => u.id === store.userId)?.storeName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Admin View Request Removed for Customer Privacy */}
            <a
              href={`https://wa.me/${store.settings.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              className="bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-100 flex items-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </nav>

      {/* BANNER SECTION */}
      <div className="relative h-64 md:h-80 bg-gray-100 overflow-hidden">
        {store.settings.bannerUrl ? (
          <img src={store.settings.bannerUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* BIO SECTION */}
      <header className="px-4 -mt-10 mb-10 text-center relative z-10">
        <div className="inline-block p-1 bg-white rounded-[2rem] shadow-2xl mb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[1.8rem] overflow-hidden bg-gray-50 flex items-center justify-center">
            {store.settings.logoUrl ? (
              <img src={store.settings.logoUrl} className="w-full h-full object-contain p-2" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-black text-5xl" style={{ backgroundColor: config.primaryColor }}>
                {mockDb.getUsers().find(u => u.id === store.userId)?.storeName.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-2">
          {mockDb.getUsers().find(u => u.id === store.userId)?.storeName}
        </h1>
        {store.settings.bio && <p className="text-gray-500 text-base font-medium italic mb-6 max-w-xl mx-auto leading-relaxed">"{store.settings.bio}"</p>}
      </header>

      {/* SEARCH & CATEGORY BAR */}
      <div className="sticky top-[73px] bg-white/80 backdrop-blur-2xl border-y border-gray-50 z-40 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex overflow-x-auto pb-2 md:pb-0 scrollbar-hide space-x-3 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all flex-shrink-0 border-2 ${selectedCategory === cat ? 'text-white border-transparent shadow-xl' : 'bg-transparent text-gray-400 border-gray-50 hover:border-gray-100'}`}
                style={{ backgroundColor: selectedCategory === cat ? config.primaryColor : undefined }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-opacity-20 transition-all border-none font-medium"
              style={{ '--tw-ring-color': config.primaryColor } as any}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="group cursor-pointer flex flex-col" onClick={() => setSelectedProduct(product)}>
            <div className={`aspect-square md:aspect-[4/5] overflow-hidden ${config.borderRadius} bg-gray-50 relative shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-1`}>
              <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              {product.discountPrice && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg tracking-widest">SALE</div>
              )}
            </div>
            <div className="mt-4 text-center px-1">
              <h3 className="text-xs md:text-sm font-black text-gray-900 line-clamp-1 uppercase tracking-tighter">{product.name}</h3>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <p className="text-sm md:text-lg font-black" style={{ color: config.primaryColor }}>₹{product.discountPrice || product.price}</p>
                {product.discountPrice && (
                  <p className="text-[10px] text-gray-300 line-through font-bold">₹{product.price}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="text-center py-20 border-t border-gray-50 text-gray-400">
        {store.settings.socialLinks && (
          <div className="flex justify-center space-x-6 mb-8 flex-wrap gap-y-4">
            {SOCIAL_PLATFORMS.map(p => {
              const link = (store.settings.socialLinks as any)?.[p.id];
              if (!link) return null;
              return (
                <a
                  key={p.id}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity transform hover:scale-110"
                  style={{ color: p.color !== '#000000' && p.color !== '#fff' ? p.color : 'currentColor' }}
                >
                  {p.icon}
                </a>
              );
            })}
          </div>
        )}
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">{mockDb.getUsers().find(u => u.id === store.userId)?.storeName} &copy; 2025</p>
      </footer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500" onClick={() => setSelectedProduct(null)} />
          <div className={`relative bg-white w-full max-w-5xl md:max-h-[90vh] overflow-y-auto rounded-t-3xl md:${config.borderRadius} shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-20 duration-500`}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-[110] bg-white/80 backdrop-blur-md text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-black">✕</button>

            <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col items-center justify-center min-h-[350px]">
              <img src={selectedProduct.images[activeImageIdx]} className="max-w-full max-h-[400px] object-contain drop-shadow-xl mb-6" alt={selectedProduct.name} />
              {/* Image Carousel Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto p-2 scrollbar-hide max-w-full">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition-all ${activeImageIdx === idx ? 'border-gray-900 ring-2 ring-gray-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-8 lg:p-12 bg-white flex flex-col">
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-2 leading-none text-gray-900 tracking-tighter uppercase">{selectedProduct.name}</h2>
                <div className="flex items-baseline space-x-4 mb-8 border-b border-gray-50 pb-6">
                  <p className="text-3xl font-black" style={{ color: config.primaryColor }}>₹{calculateTotalPrice(selectedProduct)}</p>
                  {selectedProduct.discountPrice && <p className="text-sm text-gray-300 line-through font-bold">₹{selectedProduct.price}</p>}
                </div>

                <div className="space-y-8 mb-10">
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="space-y-4">
                      {Array.from(new Set(selectedProduct.variants.map(v => v.type))).map(type => (
                        <div key={type} className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">{type}</label>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.variants
                              .filter(v => v.type === type)
                              .map(variant => (
                                <button
                                  key={variant.id}
                                  onClick={() => handleVariantToggle(variant)}
                                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border-2 ${selectedVariants[type]?.id === variant.id
                                    ? 'border-transparent text-white'
                                    : 'border-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                                  style={{ backgroundColor: selectedVariants[type]?.id === variant.id ? config.primaryColor : undefined }}
                                >
                                  {variant.value.toUpperCase()}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">About Product</label>
                    <p className="text-gray-500 leading-relaxed text-sm font-medium">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const variantDetails = (Object.entries(selectedVariants) as [string, ProductVariant][])
                    .map(([type, v]) => `${type}: ${v.value}`)
                    .join(', ');

                  // Constructing the personalized message as requested
                  const price = calculateTotalPrice(selectedProduct);
                  const message = `I am interested in ${selectedProduct.name} (Price: ₹${price})${variantDetails ? ` with options: ${variantDetails}` : ''}. Please provide me more details.`;

                  const phoneNumber = store.settings.whatsappNumber.replace(/\D/g, '');
                  if (phoneNumber) {
                    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                  } else {
                    alert('This store has not configured a WhatsApp number yet.');
                  }
                }}
                className="w-full text-white py-5 rounded-2xl font-black text-lg shadow-2xl transition-all flex items-center justify-center space-x-3 active:scale-95 mt-4"
                style={{ backgroundColor: config.primaryColor }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                <span>ORDER ON WHATSAPP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicStore;
