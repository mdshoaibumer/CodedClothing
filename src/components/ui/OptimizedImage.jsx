/**
 * OptimizedImage.jsx — Performance-optimized image component
 * 
 * Features:
 * - Lazy loading with native loading="lazy"
 * - Blur-up placeholder while loading
 * - Proper width/height attributes to prevent CLS
 * - fetchpriority for above-fold images
 * - Responsive sizes attribute support
 * - WebP format with fallback via <picture> (when webpSrc prop provided)
 * - Fallback for broken images
 */

import { useState, useRef, useEffect, memo } from 'react';

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  webpSrc,
  onLoad,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      imgRef.current.loading = 'eager';
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-obsidian-50 text-obsidian-300 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-obsidian-50 skeleton-wave"
          aria-hidden="true"
        />
      )}
      <picture>
        {webpSrc && (
          <source type="image/webp" srcSet={webpSrc} sizes={sizes} />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : loading}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
          {...props}
        />
      </picture>
    </div>
  );
});

export default OptimizedImage;
