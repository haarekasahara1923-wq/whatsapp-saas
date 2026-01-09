
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { Product, ProductVariant } from '../types';
import { CATEGORIES } from '../constants';
import { generateProductDescription, editProductImage, optimizeProductCopy, generateProductVideo } from '../services/geminiService';

const ProductEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = mockDb.getCurrentUser();

  const [loadingAi, setLoadingAi] = useState(false);
  const [editingImageIdx, setEditingImageIdx] = useState<number | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Video Gen State
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    discountPrice: undefined,
    category: CATEGORIES[0],
    stock: 10,
    images: [],
    variants: []
  });

  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    type: 'size',
    value: '',
    additionalPrice: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const store = mockDb.getStoreByUserId(user.id);
    if (!store) {
      navigate('/setup');
      return;
    }

    if (id) {
      const existing = mockDb.getProducts().find(p => p.id === id);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, user?.id, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 3 - (formData.images?.length || 0);
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      if (filesToProcess.length === 0 && (formData.images?.length || 0) >= 3) {
        alert("Maximum 3 images allowed.");
        return;
      }

      filesToProcess.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleAiEdit = async () => {
    if (editingImageIdx === null || !editPrompt) return;
    setIsProcessingImage(true);
    const originalImage = formData.images![editingImageIdx];
    const editedImage = await editProductImage(originalImage, editPrompt);

    if (editedImage) {
      const newImages = [...formData.images!];
      newImages[editingImageIdx] = editedImage;
      setFormData({ ...formData, images: newImages });
      setEditingImageIdx(null);
      setEditPrompt('');
    } else {
      alert("Failed to edit image. Check if Hugging Face Key is configured in Settings.");
    }
    setIsProcessingImage(false);
  };

  const handleVideoGen = async (imageIdx: number) => {
    setIsVideoGenerating(true);
    // const originalImage = formData.images![imageIdx]; // Not used for text-to-video fallback
    try {
      const videoData = await generateProductVideo();
      if (videoData) {
        setGeneratedVideo(videoData);
      } else {
        alert("Video generation failed. Ensure your Hugging Face Token has access to video models.");
      }
    } catch (e) {
      alert("Error generating video: " + e);
    }
    setIsVideoGenerating(false);
  };

  const handleOptimizeDescription = async () => {
    if (!formData.name || !formData.description) return alert("Enter name and basic description first.");
    setLoadingAi(true);
    const optimized = await optimizeProductCopy(formData.name, formData.description);
    setFormData({ ...formData, description: optimized });
    setLoadingAi(false);
  };

  const addVariant = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newVariant.value || newVariant.value.trim() === '') {
      alert('Please enter a value for the variant');
      return;
    }
    const variant: ProductVariant = {
      id: Math.random().toString(36).substr(2, 9),
      type: newVariant.type as any,
      value: newVariant.value.trim(),
      additionalPrice: Number(newVariant.additionalPrice || 0)
    };
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), variant]
    }));
    setNewVariant({ type: 'size', value: '', additionalPrice: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const store = mockDb.getStoreByUserId(user.id);
    if (!store) return;

    const product: Product = {
      id: id || Math.random().toString(36).substr(2, 9),
      storeId: store.id,
      name: formData.name!,
      description: formData.description!,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      images: formData.images!,
      category: formData.category!,
      stock: Number(formData.stock || 0),
      variants: formData.variants || [],
      createdAt: new Date().toISOString()
    };

    mockDb.saveProduct(product);
    navigate('/dashboard');
  };

  const canPublish = formData.name && formData.description && formData.price! > 0 && formData.images!.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">{id ? 'Edit Product' : 'Add New Product'}</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 font-bold flex items-center transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
      </div>

      <div className="relative">
        {/* Loading Overlay for Video */}
        {isVideoGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="text-center text-white space-y-4">
              <div className="animate-spin text-5xl">🎬</div>
              <h3 className="text-2xl font-black animate-pulse">Generating Marketing Video...</h3>
              <p className="opacity-70">This allows AI to hallucinate motion from your product photo. Takes ~10-30s.</p>
            </div>
          </div>
        )}

        {/* Video Result Modal */}
        {generatedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl max-w-lg w-full space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white">Your Product Video 🎉</h3>
                <button onClick={() => setGeneratedVideo(null)} className="text-gray-400 hover:text-white">✕</button>
              </div>
              <video src={generatedVideo} controls autoPlay loop className="w-full rounded-xl border border-gray-700 shadow-2xl" />
              <div className="flex gap-4">
                <a href={generatedVideo} download="product-video.mp4" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-all">
                  ⬇️ Download
                </a>
                <button onClick={() => setGeneratedVideo(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <label className="block text-sm font-bold text-gray-700">Images ({formData.images?.length}/3)</label>
              <div className="grid grid-cols-1 gap-4">
                {formData.images?.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group border border-gray-200 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                        className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >✕</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingImageIdx(idx)}
                        className="bg-purple-50 text-purple-600 text-[10px] font-black uppercase py-2.5 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors flex items-center justify-center"
                      >
                        <span className="mr-1">✨</span> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVideoGen(idx)}
                        className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase py-2.5 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors flex items-center justify-center"
                      >
                        <span className="mr-1">🎬</span> Video
                      </button>
                    </div>
                  </div>
                ))}
                {(formData.images?.length || 0) < 3 && (
                  <div className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 relative hover:bg-gray-100 transition-all">
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <label className="block text-sm font-bold text-gray-700">Product Variants</label>
              <div className="space-y-3">
                {formData.variants?.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="font-bold text-sm text-gray-800">{v.value} ({v.type})</span>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, variants: prev.variants?.filter(x => x.id !== v.id) }))} className="text-red-300">✕</button>
                  </div>
                ))}
                <div className="p-4 border border-green-100 bg-green-50/20 rounded-2xl space-y-3">
                  <div className="flex gap-2">
                    <select className="flex-1 p-2 text-xs rounded-lg bg-white" value={newVariant.type} onChange={e => setNewVariant({ ...newVariant, type: e.target.value as any })}>
                      <option value="size">Size</option>
                      <option value="color">Color</option>
                    </select>
                    <input placeholder="e.g. XL" className="flex-[2] p-2 text-xs rounded-lg bg-white" value={newVariant.value} onChange={e => setNewVariant({ ...newVariant, value: e.target.value })} />
                  </div>
                  <button type="button" onClick={addVariant} className="w-full bg-green-600 text-white py-2.5 rounded-lg text-xs font-black uppercase">Add Variant</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">Product Name</label>
                  <input required className="w-full p-4 bg-gray-50 rounded-xl border border-transparent outline-none focus:ring-2 focus:ring-green-500 font-bold text-xl" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">Original Price (₹)</label>
                    <input type="number" required className="w-full p-4 bg-gray-50 rounded-xl border border-transparent outline-none" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-600">Sale Price (₹)</label>
                    <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-transparent outline-none" value={formData.discountPrice || ''} onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-600">Description</label>
                    <button
                      type="button"
                      onClick={handleOptimizeDescription}
                      disabled={loadingAi}
                      className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border flex items-center shadow-sm transition-all ${loadingAi ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 hover:scale-105 cursor-pointer'}`}
                    >
                      {loadingAi ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Creating Magic...
                        </>
                      ) : '✨ AI Enhance Description'}
                    </button>
                  </div>
                  <textarea rows={6} required className="w-full p-4 bg-gray-50 rounded-xl border border-transparent outline-none leading-relaxed text-gray-700" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>

              <button type="submit" disabled={!canPublish} className={`w-full py-5 rounded-2xl font-black text-xl shadow-2xl transition-all ${canPublish ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {id ? 'Update Catalog' : 'Publish Product'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Magic Edit Modal */}
      {editingImageIdx !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="text-xl font-black">AI Image Lab</h3>
            <img src={formData.images![editingImageIdx]} className="w-full h-48 object-contain bg-gray-50 rounded-2xl shadow-sm" />
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Describe the changes</label>
              <textarea
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                placeholder="Ex: Add a luxury studio background, apply a vintage filter, remove small details..."
                value={editPrompt}
                onChange={e => setEditPrompt(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setEditingImageIdx(null)} className="flex-1 py-3 font-bold text-gray-500">Cancel</button>
              <button onClick={handleAiEdit} disabled={isProcessingImage} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-black shadow-lg">
                {isProcessingImage ? 'Generating...' : 'Magic Edit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditor;
