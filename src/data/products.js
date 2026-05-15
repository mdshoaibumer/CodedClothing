/**
 * products.js — Unified Product Catalog
 * 
 * All product categories in a single data source.
 * Each product has a `category` field matching a CATEGORIES slug.
 * 
 * Image Convention:
 * - Images stored in /public/images/{category}/
 * - Naming: {color}_{view}_side.png
 * - If no image exists, the app renders a colored SVG placeholder
 * 
 * Pricing: All values in INR (₹)
 */

/* ─── Categories ─── */
export const CATEGORIES = [
  { slug: 'tshirts',       label: 'T-Shirts',          icon: '◈' },
  { slug: 'hoodies',       label: 'Hoodies',           icon: '▣' },
  { slug: 'polos',         label: 'Polo Shirts',       icon: '⬡' },
  { slug: 'jackets',       label: 'Jackets',           icon: '◇' },
];

/* ─── Per-category specs ─── */
export const CATEGORY_SPECS = {
  tshirts: {
    material: '100% Long-Staple Egyptian Cotton',
    weight: '180 GSM Bio-Washed',
    fit: 'Regular / Relaxed Fit',
    print: 'DTG (Direct-to-Garment) — 1200 DPI',
    neckline: 'Ribbed crew neck with reinforced stitching',
    care: [
      'Machine wash cold (30°C) inside-out',
      'Use mild detergent — avoid bleach',
      'Tumble dry low or hang dry',
      'Iron inside-out on low heat',
      'Do not dry clean',
    ],
    delivery: 'Ships in 2–4 business days',
    deliveryExpress: 'Express delivery available (24–48 hrs)',
  },
  hoodies: {
    material: '80% Cotton, 20% Polyester Heavyweight Fleece',
    weight: '320 GSM Super-Soft',
    fit: 'Oversized / Streetwear Fit',
    print: 'DTG or High-Density Screen Print',
    neckline: 'Double-layered hood with metal-tipped drawstrings',
    care: [
      'Wash cold with like colors',
      'Turn inside out before washing',
      'Air dry recommended to maintain loft',
      'Do not iron directly on the design',
    ],
    delivery: 'Ships in 3–5 business days',
    deliveryExpress: 'Express delivery available',
  },
  polos: {
    material: '100% Premium Pique Cotton',
    weight: '220 GSM Breathable Knit',
    fit: 'Classic Tailored Fit',
    print: 'Precision Embroidery or DTG',
    neckline: 'Ribbed collar with three-button placket',
    care: [
      'Wash cold, gentle cycle',
      'Flat dry to maintain collar shape',
      'Iron on low heat if needed',
    ],
    delivery: 'Ships in 2–4 business days',
    deliveryExpress: 'Express delivery available',
  },
  jackets: {
    material: 'Melton Wool Body / Premium Synthetic Sleeves',
    weight: 'Heavyweight Seasonal Wear',
    fit: 'Classic Varsity Bomber Fit',
    print: 'Custom Chenille Patches or Embroidery',
    neckline: 'Striped ribbed stand-up collar',
    care: [
      'Professional dry clean recommended',
      'Spot clean with damp cloth',
      'Store on wide-shoulder hanger',
    ],
    delivery: 'Ships in 5–7 business days',
    deliveryExpress: 'Not available for custom varsity',
  },
};

/** Backward-compatible alias */
export const PRODUCT_SPECS = CATEGORY_SPECS.tshirts;

/* ─── Shared color palette ─── */
const COLORS = {
  black:       { name: 'Classic Black',   hex: '#1a1a1a' },
  white:       { name: 'Pure White',      hex: '#ffffff' },
  navy:        { name: 'Navy Blue',       hex: '#1e3a8a' },
  grey:        { name: 'Heather Grey',    hex: '#9ca3af' },
  crimson:     { name: 'Crimson Red',     hex: '#b91c1c' },
  red:         { name: 'Classic Red',     hex: '#ff0000' },
  maroon:      { name: 'Deep Maroon',     hex: '#800000' },
  royal_blue:  { name: 'Royal Blue',      hex: '#4169e1' },
  sky_blue:    { name: 'Sky Blue',        hex: '#87ceeb' },
  olive:       { name: 'Military Olive',  hex: '#4b5320' },
  beige:       { name: 'Desert Beige',    hex: '#d2b48c' },
};

/**
 * Helper: generate image paths for a product.
 * Returns paths under /public/images/{category}/{colorKey}_*.png
 * The placeholder component handles missing images gracefully.
 */
function img(category, colorKey) {
  const base = `/images/${category}/${colorKey}`;
  return {
    image: `${base}_front_side.png`,
    views: {
      front: `${base}_front_side.png`,
      back:  `${base}_back_side.png`,
      both:  `${base}_both_side.png`,
    },
  };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  PRODUCTS                                                                     */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export const products = [

  /* ──── T-Shirts (Crew Neck) ──── */
  {
    id: 'ts-black-01', category: 'tshirts',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('tshirts', 'black'),
    price: 499, label: 'Bestseller',
    description: 'The definitive wardrobe essential. Our Classic Black pairs effortlessly with everything — from distressed denim to tailored trousers. The deepest black dye ensures zero fading.',
    styleTip: 'Layer under a bomber jacket for an effortlessly sharp look.',
  },
  {
    id: 'ts-white-02', category: 'tshirts',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('tshirts', 'white'),
    price: 449, label: 'Popular',
    description: 'Clean, crisp, and impossibly versatile. Our Pure White is the perfect canvas — wear it plain for a minimalist statement, or customize it for maximum visual impact.',
    styleTip: 'Roll the sleeves once and tuck into high-waisted jeans for a weekend-ready look.',
  },
  {
    id: 'ts-navy-03', category: 'tshirts',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('tshirts', 'navy_blue'),
    price: 549,
    description: 'Sophisticated depth without the weight of black. Our Navy Blue is the thinking person\'s neutral — refined enough for a dinner date, relaxed enough for Sunday brunch.',
    styleTip: 'Pair with khaki chinos and white sneakers for smart-casual perfection.',
  },
  {
    id: 'ts-grey-04', category: 'tshirts',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('tshirts', 'grey'),
    price: 449,
    description: 'The understated hero of any rotation. Heather Grey sits perfectly between casual and polished — soft marled texture adds visual interest without trying too hard.',
    styleTip: 'Works beautifully under a blazer for that startup-founder aesthetic.',
  },
  {
    id: 'ts-red-05', category: 'tshirts',
    color: COLORS.red.name, hex: COLORS.red.hex,
    ...img('tshirts', 'crimson_red'),
    price: 599, label: 'New',
    description: 'Bold, confident, unapologetic. Our Crimson Red commands attention with a rich, saturated hue that holds its intensity wash after wash.',
    styleTip: 'Keep the rest of the outfit neutral — let the red do the talking.',
  },
  {
    id: 'ts-olive-06', category: 'tshirts',
    color: COLORS.olive.name, hex: COLORS.olive.hex,
    ...img('tshirts', 'olive'),
    price: 549,
    description: 'Tactical meets refined. Our Military Olive brings an earthy, grounded tone to your collection — inspired by heritage workwear, elevated with premium cotton craft.',
    styleTip: 'Perfect with dark denim and boots for a rugged-refined crossover.',
  },
  {
    id: 'ts-beige-07', category: 'tshirts',
    color: COLORS.beige.name, hex: COLORS.beige.hex,
    ...img('tshirts', 'beige'),
    price: 499, label: 'Trending',
    description: 'Warm, earthy, and effortlessly cool. Desert Beige channels a laid-back luxury vibe — think Italian riviera meets California ease.',
    styleTip: 'Pair with linen trousers and loafers for that vacation-ready silhouette.',
  },
  {
    id: 'ts-red-08', category: 'tshirts',
    color: COLORS.red.name, hex: COLORS.red.hex,
    ...img('tshirts', 'red'),
    price: 499,
    description: 'The Classic Red — vibrant, energetic, and impossible to ignore. A staple for those who lead with confidence.',
    styleTip: 'Pair with indigo denim and white sneakers for a timeless primary-color pop.',
  },
  {
    id: 'ts-maroon-09', category: 'tshirts',
    color: COLORS.maroon.name, hex: COLORS.maroon.hex,
    ...img('tshirts', 'maroon'),
    price: 549, label: 'New',
    description: 'Deep Maroon offers a sophisticated alternative to bright red. Rich, earthy tones that bring a touch of luxury to your casual rotation.',
    styleTip: 'Looks exceptional with beige chinos or dark grey trousers.',
  },
  {
    id: 'ts-royal-10', category: 'tshirts',
    color: COLORS.royal_blue.name, hex: COLORS.royal_blue.hex,
    ...img('tshirts', 'royal_blue'),
    price: 549,
    description: 'Our Royal Blue is saturated and striking. A regal shade that stands out in any setting, from the boardroom to the boardwalk.',
    styleTip: 'Contrast with white shorts or keep it sleek with black joggers.',
  },
  {
    id: 'ts-sky-11', category: 'tshirts',
    color: COLORS.sky_blue.name, hex: COLORS.sky_blue.hex,
    ...img('tshirts', 'sky_blue'),
    price: 499, label: 'Trending',
    description: 'Sky Blue channels the ease of a summer day. Light, breathable, and refreshingly optimistic.',
    styleTip: 'Perfect with light-wash denim or linen trousers for a vacation-ready aesthetic.',
  },

  /* ──── Hoodies (Heavyweight Fleece) ──── */
  {
    id: 'hd-black-01', category: 'hoodies',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('hoodies', 'black'),
    price: 1299, label: 'Premium',
    description: 'Experience unparalleled comfort with our heavyweight black hoodie. Crafted from premium fleece, it offers a luxurious feel and a perfectly oversized silhouette.',
    styleTip: 'Pair with cargo pants and high-top sneakers for a modern streetwear look.',
  },
  {
    id: 'hd-navy-02', category: 'hoodies',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('hoodies', 'navy_blue'),
    price: 1349,
    description: 'Deep Navy Blue meets heavyweight warmth. This hoodie is built for durability and style, featuring reinforced stitching and a structured hood.',
    styleTip: 'Goes great with tan chinos or light-wash denim.',
  },
  {
    id: 'hd-crimson-03', category: 'hoodies',
    color: COLORS.red.name, hex: COLORS.red.hex,
    ...img('hoodies', 'crimson_red'),
    price: 1399, label: 'New',
    description: 'Bold Crimson Red in our signature heavyweight fleece. A statement piece that doesn\'t compromise on warmth or quality.',
    styleTip: 'Layer under a black leather jacket for an edgy contrast.',
  },
  {
    id: 'hd-white-04', category: 'hoodies',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('hoodies', 'white'),
    price: 1249,
    description: 'The essential white hoodie. Clean, minimal, and incredibly soft. Perfect for crisp morning walks or cozy nights in.',
    styleTip: 'Pair with grey joggers for the ultimate monochromatic lounge set.',
  },

  /* ──── Polo Shirts (Pique Cotton) ──── */
  {
    id: 'po-black-01', category: 'polos',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('polos', 'black'),
    price: 899, label: 'Essential',
    description: 'The timeless black polo. Made from breathable pique cotton with a refined tailored fit. A staple for every smart-casual wardrobe.',
    styleTip: 'Tuck into tailored trousers for a business-casual masterpiece.',
  },
  {
    id: 'po-navy-02', category: 'polos',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('polos', 'navy_blue'),
    price: 949,
    description: 'Classic Navy Blue polo. Featuring a structured ribbed collar and a comfortable, breathable knit. Perfect for the golf course or the gallery.',
    styleTip: 'Pair with white shorts and boat shoes for a nautical vibe.',
  },
  {
    id: 'po-maroon-03', category: 'polos',
    color: COLORS.maroon.name, hex: COLORS.maroon.hex,
    ...img('polos', 'maroon'),
    price: 999, label: 'New',
    description: 'Rich Deep Maroon pique polo. Elegant and versatile, this shade adds a touch of sophistication to your weekend rotation.',
    styleTip: 'Looks great with khaki or beige bottoms.',
  },
  {
    id: 'po-crimson-04', category: 'polos',
    color: COLORS.red.name, hex: COLORS.red.hex,
    ...img('polos', 'crimson_red'),
    price: 949,
    description: 'Energetic Crimson Red polo. Stand out with confidence in this high-quality pique knit that holds its shape and color.',
    styleTip: 'Pair with dark denim for a balanced, vibrant look.',
  },
  {
    id: 'po-grey-05', category: 'polos',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('polos', 'grey'),
    price: 849,
    description: 'Understated Heather Grey polo. The perfect neutral for any outfit, offering a soft texture and a classic silhouette.',
    styleTip: 'Works perfectly under a navy blazer.',
  },
  {
    id: 'po-olive-06', category: 'polos',
    color: COLORS.olive.name, hex: COLORS.olive.hex,
    ...img('polos', 'olive'),
    price: 899,
    description: 'Military Olive pique polo. An earthy tone that brings a rugged yet refined edge to your smart-casual collection.',
    styleTip: 'Pair with black jeans and desert boots.',
  },

  /* ──── Jackets (Varsity & Outerwear) ──── */
  {
    id: 'jk-black-01', category: 'jackets',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('jackets', 'black'),
    price: 2499, label: 'Limited Edition',
    description: 'The ultimate Varsity Jacket in Classic Black. Features a premium wool-blend body and contrasting white accents. A true heritage piece.',
    styleTip: 'Wear over a white t-shirt and distressed denim for a timeless collegiate look.',
  },
  {
    id: 'jk-navy-02', category: 'jackets',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('jackets', 'navy_blue'),
    price: 2599,
    description: 'Sophisticated Navy Blue Varsity Jacket. Meticulously crafted for a structured fit and maximum warmth. Elevate your outerwear game.',
    styleTip: 'Contrast with tan chinos and leather sneakers.',
  },
  {
    id: 'jk-maroon-03', category: 'jackets',
    color: COLORS.maroon.name, hex: COLORS.maroon.hex,
    ...img('jackets', 'maroon'),
    price: 2699, label: 'Premium',
    description: 'Rich Deep Maroon Varsity Jacket. A luxurious take on a classic silhouette, perfect for making a statement in colder months.',
    styleTip: 'Keep the rest of your outfit neutral to let the maroon pop.',
  },
];

/** Backward-compatible export: just the t-shirts */
export const tshirts = products.filter(p => p.category === 'tshirts');
export const hoodies = products.filter(p => p.category === 'hoodies');
export const polos = products.filter(p => p.category === 'polos');
export const jackets = products.filter(p => p.category === 'jackets');
