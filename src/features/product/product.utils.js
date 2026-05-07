/**
 * product.utils.js — Product Data Access Layer
 * 
 * Utility functions for querying and formatting product data.
 * Acts as a service layer between components and the raw data store.
 */

import { tshirts } from '../../data/tshirts';

/**
 * Finds a product by its unique ID.
 * @param {string} id - Product ID (e.g., "ts-black-01")
 * @returns {object|null} Product object or null if not found
 */
export const getProductById = (id) => {
  return tshirts.find(product => product.id === id) || null;
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