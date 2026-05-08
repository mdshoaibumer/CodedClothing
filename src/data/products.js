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
  { slug: 'oversized',     label: 'Oversized Tees',    icon: '◇' },
  { slug: 'polos',         label: 'Polo T-Shirts',     icon: '△' },
  { slug: 'hoodies',       label: 'Hoodies',           icon: '○' },
  { slug: 'sweatshirts',   label: 'Sweatshirts',       icon: '▢' },
  { slug: 'full-sleeves',  label: 'Full Sleeve Tees',  icon: '◆' },
  { slug: 'vnecks',        label: 'V-Neck T-Shirts',   icon: '▽' },
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
  oversized: {
    material: '100% Heavy-Weight Cotton',
    weight: '220 GSM Bio-Washed',
    fit: 'Oversized / Drop Shoulder',
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
  polos: {
    material: '100% Piqué Cotton',
    weight: '220 GSM',
    fit: 'Classic Fit',
    print: 'DTG / Embroidery — 1200 DPI',
    neckline: 'Ribbed collar with 2-button placket',
    care: [
      'Machine wash cold (30°C) inside-out',
      'Use mild detergent — avoid bleach',
      'Tumble dry low or hang dry',
      'Iron inside-out on medium heat',
      'Do not dry clean',
    ],
    delivery: 'Ships in 2–4 business days',
    deliveryExpress: 'Express delivery available (24–48 hrs)',
  },
  hoodies: {
    material: '80/20 Cotton-Polyester Fleece',
    weight: '320 GSM Brushed',
    fit: 'Regular / Relaxed Fit',
    print: 'DTG (Direct-to-Garment) — 1200 DPI',
    neckline: 'Adjustable drawstring hood with kangaroo pocket',
    care: [
      'Machine wash cold (30°C) inside-out',
      'Use mild detergent — avoid bleach',
      'Tumble dry low — avoid high heat',
      'Do not iron on print area',
      'Do not dry clean',
    ],
    delivery: 'Ships in 3–5 business days',
    deliveryExpress: 'Express delivery available (48–72 hrs)',
  },
  sweatshirts: {
    material: '80/20 Cotton-Polyester Fleece',
    weight: '280 GSM Brushed',
    fit: 'Regular Fit',
    print: 'DTG (Direct-to-Garment) — 1200 DPI',
    neckline: 'Ribbed crew neck with reinforced stitching',
    care: [
      'Machine wash cold (30°C) inside-out',
      'Use mild detergent — avoid bleach',
      'Tumble dry low — avoid high heat',
      'Do not iron on print area',
      'Do not dry clean',
    ],
    delivery: 'Ships in 3–5 business days',
    deliveryExpress: 'Express delivery available (48–72 hrs)',
  },
  'full-sleeves': {
    material: '100% Long-Staple Cotton',
    weight: '190 GSM Bio-Washed',
    fit: 'Regular Fit',
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
  vnecks: {
    material: '100% Combed Cotton',
    weight: '170 GSM Bio-Washed',
    fit: 'Slim / Regular Fit',
    print: 'DTG (Direct-to-Garment) — 1200 DPI',
    neckline: 'V-neck with taped seam',
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
};

/** Backward-compatible alias */
export const PRODUCT_SPECS = CATEGORY_SPECS.tshirts;

/* ─── Shared color palette ─── */
const COLORS = {
  black:  { name: 'Classic Black',   hex: '#1a1a1a' },
  white:  { name: 'Pure White',      hex: '#ffffff' },
  navy:   { name: 'Navy Blue',       hex: '#1e3a8a' },
  grey:   { name: 'Heather Grey',    hex: '#9ca3af' },
  red:    { name: 'Crimson Red',     hex: '#b91c1c' },
  olive:  { name: 'Military Olive',  hex: '#4b5320' },
  beige:  { name: 'Desert Beige',    hex: '#d2b48c' },
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

  /* ──── Oversized Tees ──── */
  {
    id: 'os-black-01', category: 'oversized',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('oversized', 'black'),
    price: 699, label: 'Trending',
    description: 'Streetwear meets premium craft. Our drop-shoulder oversized tee drapes effortlessly with a boxy silhouette — 220 GSM heavy-weight cotton that holds its structure.',
    styleTip: 'Tuck the front into wide-leg pants for that editorial street style.',
  },
  {
    id: 'os-white-02', category: 'oversized',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('oversized', 'white'),
    price: 649,
    description: 'The oversized white tee — an icon of effortless cool. Extra room, dropped shoulders, and a longer hem for that perfectly undone look.',
    styleTip: 'Layer with a vest and chunky sneakers for weekend vibes.',
  },
  {
    id: 'os-grey-03', category: 'oversized',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('oversized', 'grey'),
    price: 649,
    description: 'Relaxed, easy, and endlessly wearable. The oversized grey tee is the Sunday essential that works every other day too.',
    styleTip: 'Pair with joggers and slides for peak comfort-luxe.',
  },
  {
    id: 'os-beige-04', category: 'oversized',
    color: COLORS.beige.name, hex: COLORS.beige.hex,
    ...img('oversized', 'beige'),
    price: 699,
    description: 'Warm tones, relaxed fit, maximum impact. Our Desert Beige oversized tee is the neutral statement piece your wardrobe is missing.',
    styleTip: 'Goes perfectly with cargo pants and earth-tone accessories.',
  },
  {
    id: 'os-olive-05', category: 'oversized',
    color: COLORS.olive.name, hex: COLORS.olive.hex,
    ...img('oversized', 'olive'),
    price: 699,
    description: 'Military-inspired in an oversized silhouette. Heavy cotton, deep olive hue, and that effortless drop-shoulder drape.',
    styleTip: 'Add a crossbody bag and combat boots for urban utility.',
  },

  /* ──── Polo T-Shirts ──── */
  {
    id: 'pl-black-01', category: 'polos',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('polos', 'black'),
    price: 799, label: 'Popular',
    description: 'The timeless polo, elevated. Premium piqué cotton with a structured collar and two-button placket. Smart enough for the office, cool enough for the weekend.',
    styleTip: 'Tuck into tailored chinos for a sharp smart-casual look.',
  },
  {
    id: 'pl-white-02', category: 'polos',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('polos', 'white'),
    price: 749,
    description: 'Clean and classic. Our white polo is the foundation of effortless style — perfect for custom embroidery or logo placement.',
    styleTip: 'Pair with navy shorts and boat shoes for a weekend brunch.',
  },
  {
    id: 'pl-navy-03', category: 'polos',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('polos', 'navy_blue'),
    price: 799,
    description: 'Deep navy in premium piqué. Ideal for corporate branding, team uniforms, or simply looking put-together without trying too hard.',
    styleTip: 'Layer under a blazer for a polished yet relaxed ensemble.',
  },
  {
    id: 'pl-grey-04', category: 'polos',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('polos', 'grey'),
    price: 749,
    description: 'Versatile grey piqué polo. The structured collar adds formality while the soft cotton keeps you comfortable all day.',
    styleTip: 'Works great with dark jeans for a casual Friday look.',
  },
  {
    id: 'pl-red-05', category: 'polos',
    color: COLORS.red.name, hex: COLORS.red.hex,
    ...img('polos', 'crimson_red'),
    price: 849, label: 'New',
    description: 'Bold crimson in a classic polo silhouette. Make a statement at the golf course, the office, or anywhere in between.',
    styleTip: 'Keep bottoms neutral — white or khaki — and let the color pop.',
  },

  /* ──── Hoodies ──── */
  {
    id: 'hd-black-01', category: 'hoodies',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('hoodies', 'black'),
    price: 1299, label: 'Bestseller',
    description: 'The ultimate layering piece. 320 GSM brushed fleece with an adjustable hood and kangaroo pocket. Soft inside, structured outside — built for all-day warmth.',
    styleTip: 'Layer under a denim jacket for a textured winter look.',
  },
  {
    id: 'hd-white-02', category: 'hoodies',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('hoodies', 'white'),
    price: 1249,
    description: 'Clean white fleece hoodie — the blank canvas for custom designs. Premium brushed interior for cloud-level comfort.',
    styleTip: 'Pair with black joggers for a monochrome streetwear moment.',
  },
  {
    id: 'hd-navy-03', category: 'hoodies',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('hoodies', 'navy_blue'),
    price: 1299,
    description: 'Deep navy fleece with a premium hand-feel. The adjustable drawstring hood and ribbed cuffs keep everything locked in.',
    styleTip: 'Layer with a puffer vest on cooler days.',
  },
  {
    id: 'hd-grey-04', category: 'hoodies',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('hoodies', 'grey'),
    price: 1249, label: 'Popular',
    description: 'The classic grey hoodie — wardrobe essential #1. Our version elevates the basics with premium fleece and a tailored-casual fit.',
    styleTip: 'Throw on over a collared shirt for that preppy-meets-street vibe.',
  },
  {
    id: 'hd-olive-05', category: 'hoodies',
    color: COLORS.olive.name, hex: COLORS.olive.hex,
    ...img('hoodies', 'olive'),
    price: 1349,
    description: 'Earthy olive in heavyweight fleece. Military-inspired colorway with modern construction — perfect for outdoor adventures or urban exploring.',
    styleTip: 'Combine with cargo pants for a utilitarian fit.',
  },

  /* ──── Sweatshirts (Crew Neck) ──── */
  {
    id: 'sw-black-01', category: 'sweatshirts',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('sweatshirts', 'black'),
    price: 999,
    description: 'The no-hood alternative. All the warmth and softness of our fleece, in a clean crew-neck silhouette. Perfect for layering under coats or wearing solo.',
    styleTip: 'Layer over a button-down with the collar peeking out.',
  },
  {
    id: 'sw-white-02', category: 'sweatshirts',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('sweatshirts', 'white'),
    price: 949,
    description: 'Clean, minimal, and endlessly customizable. Our white crew-neck sweatshirt is the ideal canvas for oversized logos and bold graphics.',
    styleTip: 'Pair with pleated trousers for a high-low fashion mix.',
  },
  {
    id: 'sw-navy-03', category: 'sweatshirts',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('sweatshirts', 'navy_blue'),
    price: 999, label: 'New',
    description: 'Refined navy in a relaxed sweatshirt silhouette. The ribbed crew neck and cuffs add structure to the soft fleece body.',
    styleTip: 'Works beautifully with white sneakers and straight-leg jeans.',
  },
  {
    id: 'sw-grey-04', category: 'sweatshirts',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('sweatshirts', 'grey'),
    price: 949, label: 'Popular',
    description: 'The quintessential crew-neck sweatshirt in heather grey. Soft brushed interior, clean exterior — the one you\'ll reach for daily.',
    styleTip: 'Throw on with shorts and high-tops for a relaxed look.',
  },

  /* ──── Full Sleeve Tees ──── */
  {
    id: 'fs-black-01', category: 'full-sleeves',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('full-sleeves', 'black'),
    price: 649,
    description: 'Long-sleeve crew neck in premium cotton. Extra coverage for cooler days without the bulk of a sweatshirt — the perfect transitional piece.',
    styleTip: 'Roll the sleeves up to the forearm for a casual look.',
  },
  {
    id: 'fs-white-02', category: 'full-sleeves',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('full-sleeves', 'white'),
    price: 599,
    description: 'A clean white long-sleeve that works year-round. Layer it, tuck it, or let it flow — this piece adapts to your style.',
    styleTip: 'Works perfectly under a sleeveless vest or open shirt.',
  },
  {
    id: 'fs-navy-03', category: 'full-sleeves',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('full-sleeves', 'navy_blue'),
    price: 649,
    description: 'Deep navy long-sleeve with a modern fit. The extended sleeves add sophistication while keeping the vibe relaxed.',
    styleTip: 'Layer under a gilet for smart-casual winter styling.',
  },
  {
    id: 'fs-grey-04', category: 'full-sleeves',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('full-sleeves', 'grey'),
    price: 599, label: 'New',
    description: 'Heather grey long-sleeve — the layering essential. Slim enough to wear under a jacket, soft enough to sleep in.',
    styleTip: 'Push the sleeves up and pair with raw denim for an effortless edge.',
  },

  /* ──── V-Neck T-Shirts ──── */
  {
    id: 'vn-black-01', category: 'vnecks',
    color: COLORS.black.name, hex: COLORS.black.hex,
    ...img('vnecks', 'black'),
    price: 499,
    description: 'The V-neck adds a subtle dash of elegance to the classic tee. Our black V-neck elongates the silhouette and flatters every build.',
    styleTip: 'Wear under a cardigan with the V-neck peeking through.',
  },
  {
    id: 'vn-white-02', category: 'vnecks',
    color: COLORS.white.name, hex: COLORS.white.hex,
    ...img('vnecks', 'white'),
    price: 449,
    description: 'A fresh white V-neck — clean lines, comfortable cotton, and a neckline that opens up your look. Essential layering piece.',
    styleTip: 'Great under a blazer for a dressed-down smart look.',
  },
  {
    id: 'vn-navy-03', category: 'vnecks',
    color: COLORS.navy.name, hex: COLORS.navy.hex,
    ...img('vnecks', 'navy_blue'),
    price: 549,
    description: 'Navy V-neck with a refined fit. The V-cut neckline adds visual interest while the deep blue keeps things versatile.',
    styleTip: 'Pair with light chinos and loafers for an evening out.',
  },
  {
    id: 'vn-grey-04', category: 'vnecks',
    color: COLORS.grey.name, hex: COLORS.grey.hex,
    ...img('vnecks', 'grey'),
    price: 449,
    description: 'Heather grey in a flattering V-neck cut. Soft, breathable, and sits perfectly whether you\'re seated or standing.',
    styleTip: 'Stack a pendant necklace over it for a layered accessory look.',
  },
];

/** Backward-compatible export: just the t-shirts */
export const tshirts = products.filter(p => p.category === 'tshirts');
