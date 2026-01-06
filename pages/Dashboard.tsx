
import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';
import { Store, Product } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = mockDb.getCurrentUser();
  const [store, setStore] = useState<Store | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy Link');

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
    setProducts(mockDb.getProductsByStoreId(userStore.id));
  }, [user?.id, navigate]);

  if (!store || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Verifying Workspace...</p>
        </div>
      </div>
    );
  }

  const storeSlug = user.storeSlug;

  /*
   * ROBUST URL GENERATION (Fixed)
   * We use HashRouter, so the URL is simply origin + /#/s/ + slug
   */
  const getPublicStoreUrl = () => {
    const origin = window.location.origin;
    // Ensure we handle trailing slashes in origin if any (rare but possible)
    const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    return `${cleanOrigin}/#/s/${storeSlug}`;
  };

  const publicStoreUrl = getPublicStoreUrl();
  // Using reliable public API for QR Code generation (no dependencies needed)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicStoreUrl)}&bgcolor=ffffff&color=000000&margin=10`;

  const handleCopyLink = () => {
    const textArea = document.createElement("textarea");
    textArea.value = publicStoreUrl;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyStatus('Copied! ✅');
    } catch (err) {
      setCopyStatus('Error ❌');
    }
    document.body.removeChild(textArea);
    setTimeout(() => setCopyStatus('Copy Link'), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = `Check out my store "${user.storeName}" on WhatsApp: ${publicStoreUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const kw = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(kw) ||
      p.category.toLowerCase().includes(kw)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Dashboard</h1>
          <p className="text-gray-500 font-bold mt-1 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Store Status: Active
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link to="/settings" className="flex-1 md:flex-none bg-white border-2 border-gray-100 text-gray-700 px-6 py-4 rounded-3xl font-black text-xs hover:bg-gray-50 transition-all flex items-center justify-center">
            Store Profile
          </Link>
          <Link to="/products/new" className="flex-1 md:flex-none bg-green-600 text-white px-8 py-4 rounded-3xl font-black text-xs hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center justify-center uppercase tracking-widest">
            + New Product
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white border-2 border-gray-50 p-8 md:p-10 rounded-[3rem] shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Share Your Store 🚀</h2>
            <p className="text-gray-500 text-sm font-medium mb-6">Send this link to customers or let them scan the QR code.</p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
              <div className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 flex items-center overflow-hidden">
                <code className="text-green-700 font-bold text-xs truncate select-all">{publicStoreUrl}</code>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-gray-800 transition-all shadow-lg shrink-0 whitespace-nowrap"
              >
                {copyStatus}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/s/${storeSlug}`}
                target="_blank"
                className="bg-green-50 text-green-600 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-100 transition-all flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Open Store
              </Link>
              <button
                onClick={handleWhatsAppShare}
                className="bg-[#25D366] text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#20bd5a] transition-all flex items-center shadow-md bg-opacity-90"
              >
                Share on WA
              </button>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="bg-white p-3 rounded-2xl border-2 border-gray-100 shadow-sm mb-3">
              <img src={qrCodeUrl} alt="Store QR Code" className="w-32 h-32 md:w-36 md:h-36 object-contain rounded-lg" />
            </div>
            <a href={qrCodeUrl} download="store_qr.png" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-600">
              Download QR
            </a>
          </div>
        </div>

        <div className="bg-green-600 p-8 md:p-10 rounded-[3rem] shadow-xl text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Inventory Summary</p>
          <h3 className="text-4xl font-black mb-1">{products.length} Products</h3>
          <p className="text-sm font-bold opacity-80 mb-8">Ready for sales.</p>
          <Link to="/products/new" className="inline-block bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl text-xs font-black uppercase backdrop-blur-md transition-all">Quick Add</Link>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Items</h2>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-[2rem] text-sm outline-none focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-300 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white border-2 border-gray-50 rounded-[2.5rem] p-6 flex flex-col group hover:shadow-xl transition-all">
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-6 relative">
              <img src={product.images[0]} className="w-full h-full object-cover" alt={product.name} />
              <div className="absolute top-4 right-4 flex gap-2">
                <Link to={`/products/${product.id}`} className="bg-white p-3 rounded-2xl shadow-lg hover:bg-gray-50 transition-all">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-gray-900 mb-1">{product.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-1 mb-4 font-medium">{product.category}</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <span className="text-xl font-black text-green-600">₹{product.discountPrice || product.price}</span>
              <span className="text-[10px] font-black text-gray-400">STOCK: {product.stock}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
