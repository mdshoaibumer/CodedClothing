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
    label: "Bestseller"
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
    label: "Popular"
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
    label: "New"
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
    label: "Trending"
  }
];
