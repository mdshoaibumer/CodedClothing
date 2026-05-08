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
  oversized: (
    <>
      {/* Oversized/boxy tee — wider shoulders, longer body */}
      <path d="M100,45 L82,42 Q70,38 62,28 L45,10 Q40,7 35,10 L18,48 Q15,55 20,60 L38,72 L38,165 Q38,170 43,170 L157,170 Q162,170 162,165 L162,72 L180,60 Q185,55 182,48 L165,10 Q160,7 155,10 L138,28 Q130,38 118,42 L100,45 Z" />
      <path d="M85,42 Q100,55 115,42" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
    </>
  ),
  polos: (
    <>
      {/* Polo with collar and button placket */}
      <path d="M100,48 L85,45 Q75,40 68,32 L52,14 Q48,10 43,14 L28,46 Q25,52 30,57 L45,70 L45,158 Q45,162 50,162 L150,162 Q155,162 155,158 L155,70 L170,57 Q175,52 172,46 L157,14 Q152,10 148,14 L132,32 Q125,40 115,45 L100,48 Z" />
      {/* Collar */}
      <path d="M82,40 L75,28 Q73,25 76,24 L88,32 Q100,38 112,32 L124,24 Q127,25 125,28 L118,40" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" />
      {/* Button placket */}
      <line x1="100" y1="48" x2="100" y2="85" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
      <circle cx="100" cy="55" r="2" fill="rgba(0,0,0,0.15)" />
      <circle cx="100" cy="68" r="2" fill="rgba(0,0,0,0.15)" />
    </>
  ),
  hoodies: (
    <>
      {/* Hoodie with hood and kangaroo pocket */}
      <path d="M100,35 L82,38 Q72,42 65,50 L48,12 Q44,6 38,10 L18,50 Q14,58 20,64 L40,78 L40,168 Q40,172 45,172 L155,172 Q160,172 160,168 L160,78 L180,64 Q186,58 182,50 L162,10 Q156,6 152,12 L135,50 Q128,42 118,38 L100,35 Z" />
      {/* Hood */}
      <path d="M65,50 Q68,20 100,15 Q132,20 135,50" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2.5" />
      {/* Hood drawstrings */}
      <line x1="92" y1="50" x2="88" y2="68" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      <line x1="108" y1="50" x2="112" y2="68" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
      {/* Kangaroo pocket */}
      <path d="M65,120 Q65,140 100,142 Q135,140 135,120" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
    </>
  ),
  sweatshirts: (
    <>
      {/* Crew neck sweatshirt — thicker build, ribbed cuffs implied */}
      <path d="M100,42 L84,40 Q72,36 65,28 L50,12 Q46,8 40,12 L22,48 Q18,55 24,60 L42,74 L42,162 Q42,166 47,166 L153,166 Q158,166 158,162 L158,74 L176,60 Q182,55 178,48 L160,12 Q154,8 150,12 L135,28 Q128,36 116,40 L100,42 Z" />
      <path d="M86,38 Q100,50 114,38" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2.5" />
      {/* Ribbed cuffs hint */}
      <line x1="42" y1="158" x2="42" y2="166" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
      <line x1="158" y1="158" x2="158" y2="166" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
    </>
  ),
  'full-sleeves': (
    <>
      {/* Long sleeve tee */}
      <path d="M100,45 L85,42 Q75,38 68,30 L55,15 Q50,12 45,15 L28,48 Q24,55 28,58 L30,60 L22,130 Q20,138 28,138 L42,136 L45,155 Q45,160 50,160 L150,160 Q155,160 155,155 L155,136 L172,138 Q180,138 178,130 L170,60 L172,58 Q176,55 172,48 L155,15 Q150,12 145,15 L132,30 Q125,38 115,42 L100,45 Z" />
      <path d="M88,42 Q100,52 112,42" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      {/* Sleeve seam lines */}
      <path d="M42,70 L28,132" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      <path d="M158,70 L172,132" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
    </>
  ),
  vnecks: (
    <>
      {/* V-neck t-shirt */}
      <path d="M100,55 L85,42 Q75,38 68,30 L55,15 Q50,12 45,15 L30,45 Q28,50 32,55 L45,68 L45,155 Q45,160 50,160 L150,160 Q155,160 155,155 L155,68 L168,55 Q172,50 170,45 L155,15 Q150,12 145,15 L132,30 Q125,38 115,42 L100,55 Z" />
      {/* V-neckline */}
      <path d="M85,42 L100,60 L115,42" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
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
