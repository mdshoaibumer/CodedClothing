/**
 * ProductPlaceholder.jsx — SVG Product Silhouette Placeholder
 * 
 * Renders a colored product shape based on category when no image is available.
 * Each category has a unique silhouette (hoodie, polo collar, v-neck, etc.).
 * Swap in real photos later — no code changes needed.
 */

import { memo } from 'react';

/** SVG silhouette paths per category */
const SILHOUETTES = {
  tshirts: (
    <>
      {/* Crew neck t-shirt */}
      <path d="M100,45 L85,42 Q75,38 68,30 L55,15 Q50,12 45,15 L30,45 Q28,50 32,55 L45,68 L45,155 Q45,160 50,160 L150,160 Q155,160 155,155 L155,68 L168,55 Q172,50 170,45 L155,15 Q150,12 145,15 L132,30 Q125,38 115,42 L100,45 Z" />
      {/* Neckline */}
      <path d="M88,42 Q100,52 112,42" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      {/* Sleeves */}
      <path d="M45,68 L25,95 Q22,100 28,102 L45,98" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
      <path d="M155,68 L175,95 Q178,100 172,102 L155,98" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
    </>
  ),
};

/**
 * ProductPlaceholder — renders a category-specific colored silhouette.
 * Used when product images are not yet available.
 */
const ProductPlaceholder = memo(function ProductPlaceholder({
  category = 'tshirts',
  hex = '#1a1a1a',
  label,
  className = '',
}) {
  const silhouette = SILHOUETTES[category] || SILHOUETTES.tshirts;

  // Determine text/accent colors based on hex brightness
  const isLight = isLightColor(hex);
  const textColor = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}
         style={{ backgroundColor: lightenColor(hex, 0.92) }}>
      <svg
        viewBox="0 0 200 185"
        className="w-3/4 h-3/4 max-w-[280px] drop-shadow-lg"
        style={{ filter: `drop-shadow(0 4px 12px ${hex}30)` }}
      >
        <g fill={hex} fillOpacity="0.9">
          {silhouette}
        </g>
      </svg>

      {/* Category label watermark */}
      <span
        className="absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 select-none"
        style={{ color: textColor }}
      >
        Preview
      </span>
    </div>
  );
});

/** Check if a hex color is light */
function isLightColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

/** Lighten a hex color toward white by a factor (0–1) */
function lightenColor(hex, factor) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const lr = Math.round(r + (255 - r) * factor);
  const lg = Math.round(g + (255 - g) * factor);
  const lb = Math.round(b + (255 - b) * factor);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

export default ProductPlaceholder;
