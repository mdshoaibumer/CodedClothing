import { tshirts } from '../../data/tshirts';

/**
 * Get a product by its ID
 * @param {string} id - Product ID
 * @returns {object|null} Product object or null if not found
 */
export const getProductById = (id) => {
  return tshirts.find(product => product.id === id) || null;
};

/**
 * Get all available products
 * @returns {array} Array of all products
 */
export const getAllProducts = () => {
  return tshirts;
};

/**
 * Get products by label
 * @param {string} label - Product label (e.g., 'Bestseller', 'New')
 * @returns {array} Array of products with the specified label
 */
export const getProductsByLabel = (label) => {
  return tshirts.filter(product => product.label === label);
};

/**
 * Get available sizes for products
 * @returns {array} Array of available sizes
 */
export const getAvailableSizes = () => {
  return ['S', 'M', 'L', 'XL', 'XXL'];
};

/**
 * Format price for display
 * @param {number} price - Price in cents/paise
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return `₹${price}`;
};

/**
 * Get product image URL with fallback
 * @param {object} product - Product object
 * @returns {string} Image URL
 */
export const getProductImage = (product) => {
  return product.image || 'https://placehold.co/600x800/cccccc/666666?text=No+Image';
};