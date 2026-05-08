/**
 * product.utils.js — Product Data Access Layer
 * 
 * Utility functions for querying and formatting product data.
 * Acts as a service layer between components and the raw data store.
 */

import { products, CATEGORIES, CATEGORY_SPECS } from '../../data/products';

/**
 * Finds a product by its unique ID.
 * @param {string} id - Product ID (e.g., "ts-black-01")
 * @returns {object|null} Product object or null if not found
 */
export const getProductById = (id) => {
  return products.find(product => product.id === id) || null;
};

/**
 * Returns products filtered by category slug.
 * @param {string} slug - Category slug (e.g., "hoodies")
 * @returns {object[]} Filtered product array
 */
export const getProductsByCategory = (slug) => {
  if (!slug || slug === 'all') return products;
  return products.filter(p => p.category === slug);
};

/**
 * Returns specs for a given category (or product).
 * @param {string} categoryOrProductId - Category slug or product ID
 * @returns {object} Category specs object
 */
export const getSpecsFor = (categoryOrProductId) => {
  // Try as category slug first
  if (CATEGORY_SPECS[categoryOrProductId]) return CATEGORY_SPECS[categoryOrProductId];
  // Try as product ID
  const product = getProductById(categoryOrProductId);
  return product ? (CATEGORY_SPECS[product.category] || CATEGORY_SPECS.tshirts) : CATEGORY_SPECS.tshirts;
};

/**
 * Returns the category label for a given slug.
 * @param {string} slug - Category slug
 * @returns {string} Human-readable label
 */
export const getCategoryLabel = (slug) => {
  return CATEGORIES.find(c => c.slug === slug)?.label || 'All Products';
};

/**
 * Returns the list of available sizes.
 * @returns {string[]} Array of size codes
 */
export const getAvailableSizes = () => {
  return ['S', 'M', 'L', 'XL', 'XXL'];
};

/**
 * Formats a numeric price for display with currency symbol.
 * @param {number} price - Price value in INR
 * @returns {string} Formatted price (e.g., "₹299")
 */
export const formatPrice = (price) => {
  return `₹${price}`;
};