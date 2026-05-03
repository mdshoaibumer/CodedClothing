import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getAvailableSizes, formatPrice } from './product.utils';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeView, setActiveView] = useState('front');

  const product = getProductById(id);
  const sizes = getAvailableSizes();

  const handleCustomize = () => {
    navigate(`/customize/${id}`);
  };

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">
          Return to Collection
        </button>
      </div>
    );
  }

  const sizeChart = [
    { size: 'S', chest: '38"', length: '27"' },
    { size: 'M', chest: '40"', length: '28"' },
    { size: 'L', chest: '42"', length: '29"' },
    { size: 'XL', chest: '44"', length: '30"' },
    { size: 'XXL', chest: '46"', length: '31"' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-white p-4 md:p-8 rounded-3xl shadow-sm">
      
      {/* Size Guide Modal */}
      <Modal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)}
        title="Size Guide"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500 font-medium">
            Measurements are in inches. All our tees are pre-shrunk and feature a premium tailored fit.
          </p>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-400 font-black uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Chest</th>
                  <th className="px-6 py-4">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-bold text-gray-900">
                {sizeChart.map((row) => (
                  <tr key={row.size} className={selectedSize === row.size ? "bg-blue-50/50" : ""}>
                    <td className="px-6 py-4">{row.size}</td>
                    <td className="px-6 py-4">{row.chest}</td>
                    <td className="px-6 py-4">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl flex items-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
             <p className="text-xs text-blue-700 font-medium leading-relaxed">
               Tip: For an oversized look, we recommend ordering one size up from your standard fit.
             </p>
          </div>
        </div>
      </Modal>

      {/* Product Image & Gallery */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="relative bg-gray-50 rounded-[2.5rem] overflow-hidden aspect-[3/4] md:aspect-square lg:aspect-[3/4] group">
          <img 
            src={product.views?.[activeView] || product.image} 
            alt={`${product.color} - ${activeView}`} 
            className="object-contain w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
          {product.label && (
            <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px]">
              {product.label}
            </Badge>
          )}
          
          {/* Active View Label */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] pointer-events-none">
            {activeView.replace('_', ' ')}
          </div>
        </div>

        {/* Thumbnail Switcher */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(product.views || {}).map(([key, url]) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                activeView === key 
                  ? 'border-gray-900 bg-white shadow-lg' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <img src={url} alt={key} className="w-full h-full object-contain p-2 mix-blend-multiply" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <button 
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 w-fit flex items-center gap-1 font-bold uppercase tracking-widest text-[10px]"
        >
          ← Collection
        </button>

        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Premium Cotton Tee</h1>
        <p className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">{formatPrice(product.price)}</p>

        <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium max-w-sm">
          Crafted from 100% long-staple cotton. Breathable, durable, and engineered for the perfect custom print.
        </p>

        <div className="mb-8 border-t border-gray-100 pt-6">
          <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">
            Surface Color
          </h3>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl w-fit ring-1 ring-gray-100">
            <div 
              className="w-5 h-5 rounded-full border border-gray-200 shadow-inner" 
              style={{ backgroundColor: product.hex }}
            />
            <span className="text-gray-900 font-bold text-sm tracking-tight">{product.color}</span>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Dimensions
            </h3>
            <button 
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline"
            >
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-4 rounded-2xl border-2 text-xs font-black transition-all ${
                  selectedSize === size 
                    ? 'border-gray-900 bg-black text-white shadow-xl shadow-black/10' 
                    : 'border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 md:relative md:border-t-0 md:bg-transparent md:p-0 z-40">
          <button
            onClick={handleCustomize}
            className="w-full bg-black hover:bg-gray-800
                       text-white font-black text-lg uppercase tracking-widest
                       py-5 rounded-[1.5rem] shadow-2xl shadow-black/20 transition-all
                       active:scale-[0.98] hover:-translate-y-1"
          >
            Design This Tee
          </button>
        </div>
        <div className="h-24 md:hidden"></div>
      </div>
    </div>
  );
}
