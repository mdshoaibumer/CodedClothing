import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../ui/Skeleton';

export default function TShirtCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden
                 shadow-md hover:shadow-xl transition-all duration-300 ease-out
                 hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <img
          src={product.image}
          alt={`${product.color} T-Shirt`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-500 ease-out ${
            imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
          }`}
        />

        {product.label && (
          <span className="absolute top-3 left-3
                           bg-white text-xs font-semibold
                           px-3 py-1 rounded-full
                           text-gray-800 shadow-sm border border-gray-100 z-10">
            {product.label}
          </span>
        )}
        
        {/* Shimmer loading effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-200 shadow-inner"
            style={{ backgroundColor: product.hex }}
          />
          <h3 className="text-sm font-semibold text-gray-900">
            {product.color}
          </h3>
        </div>

        <p className="text-sm text-gray-600">
          Starting at <span className="text-gray-900 font-bold">₹{product.price}</span>
        </p>
      </div>
    </Link>
  );
}
