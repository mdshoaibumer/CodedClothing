/**
 * tshirts.js — Product Catalog Data
 * 
 * Contains the complete collection of available t-shirt products.
 * Each product defines its color variants, pricing, image paths, and labels.
 * 
 * Image Convention:
 * - All product images stored in /public/images/tshirts/
 * - Naming: {color}_{view}_side.png (e.g., black_front_side.png)
 * - Three views per product: front, back, both
 * 
 * Pricing: All values in INR (₹)
 */

/** Shared product specs — avoids duplication across products */
export const PRODUCT_SPECS = {
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
};

export const tshirts = [
  {
    id: "ts-black-01",
    color: "Classic Black",
    hex: "#1a1a1a",
    image: "/images/tshirts/black_front_side.png",
    views: {
      front: "/images/tshirts/black_front_side.png",
      back: "/images/tshirts/black_back_side.png",
      both: "/images/tshirts/black_both_side.png"
    },
    price: 499,
    label: "Bestseller",
    description: "The definitive wardrobe essential. Our Classic Black pairs effortlessly with everything — from distressed denim to tailored trousers. The deepest black dye ensures zero fading.",
    styleTip: "Layer under a bomber jacket for an effortlessly sharp look."
  },
  {
    id: "ts-white-02",
    color: "Pure White",
    hex: "#ffffff",
    image: "/images/tshirts/white_front_side.png",
    views: {
      front: "/images/tshirts/white_front_side.png",
      back: "/images/tshirts/white_back_side.png",
      both: "/images/tshirts/white_both_side.png"
    },
    price: 449,
    label: "Popular",
    description: "Clean, crisp, and impossibly versatile. Our Pure White is the perfect canvas — wear it plain for a minimalist statement, or customize it for maximum visual impact.",
    styleTip: "Roll the sleeves once and tuck into high-waisted jeans for a weekend-ready look."
  },
  {
    id: "ts-navy-03",
    color: "Navy Blue",
    hex: "#1e3a8a",
    image: "/images/tshirts/navy_blue_front_side.png",
    views: {
      front: "/images/tshirts/navy_blue_front_side.png",
      back: "/images/tshirts/navy_blue_back_side.png",
      both: "/images/tshirts/navy_blue_both_side.png"
    },
    price: 549,
    description: "Sophisticated depth without the weight of black. Our Navy Blue is the thinking person's neutral — refined enough for a dinner date, relaxed enough for Sunday brunch.",
    styleTip: "Pair with khaki chinos and white sneakers for smart-casual perfection."
  },
  {
    id: "ts-grey-04",
    color: "Heather Grey",
    hex: "#9ca3af",
    image: "/images/tshirts/grey_front_side.png",
    views: {
      front: "/images/tshirts/grey_front_side.png",
      back: "/images/tshirts/grey_back_side.png",
      both: "/images/tshirts/grey_both_side.png"
    },
    price: 449,
    description: "The understated hero of any rotation. Heather Grey sits perfectly between casual and polished — soft marled texture adds visual interest without trying too hard.",
    styleTip: "Works beautifully under a blazer for that startup-founder aesthetic."
  },
  {
    id: "ts-red-05",
    color: "Crimson Red",
    hex: "#b91c1c",
    image: "/images/tshirts/crimson_red_front_side.png",
    views: {
      front: "/images/tshirts/crimson_red_front_side.png",
      back: "/images/tshirts/crimson_red_back_side.png",
      both: "/images/tshirts/crimson_red_both_side.png"
    },
    price: 599,
    label: "New",
    description: "Bold, confident, unapologetic. Our Crimson Red commands attention with a rich, saturated hue that holds its intensity wash after wash. A statement piece for those who lead.",
    styleTip: "Keep the rest of the outfit neutral — let the red do the talking."
  },
  {
    id: "ts-olive-06",
    color: "Military Olive",
    hex: "#4b5320",
    image: "/images/tshirts/olive_front_side.png",
    views: {
      front: "/images/tshirts/olive_front_side.png",
      back: "/images/tshirts/olive_back_side.png",
      both: "/images/tshirts/olive_both_side.png"
    },
    price: 549,
    description: "Tactical meets refined. Our Military Olive brings an earthy, grounded tone to your collection — inspired by heritage workwear, elevated with premium cotton craft.",
    styleTip: "Perfect with dark denim and boots for a rugged-refined crossover."
  },
  {
    id: "ts-beige-07",
    color: "Desert Beige",
    hex: "#d2b48c",
    image: "/images/tshirts/beige_front_side.png",
    views: {
      front: "/images/tshirts/beige_front_side.png",
      back: "/images/tshirts/beige_back_side.png",
      both: "/images/tshirts/beige_both_side.png"
    },
    price: 499,
    label: "Trending",
    description: "Warm, earthy, and effortlessly cool. Desert Beige channels a laid-back luxury vibe — think Italian riviera meets California ease. Currently trending for good reason.",
    styleTip: "Pair with linen trousers and loafers for that vacation-ready silhouette."
  }
];
