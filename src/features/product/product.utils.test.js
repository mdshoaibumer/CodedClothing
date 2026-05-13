import { describe, it, expect } from 'vitest';
import {
  getProductById,
  getProductsByCategory,
  getSpecsFor,
  getCategoryLabel,
  getAvailableSizes,
  formatPrice,
} from './product.utils';

describe('product.utils', () => {
  describe('getProductById', () => {
    it('returns product when ID exists', () => {
      const product = getProductById('ts-black-01');
      expect(product).not.toBeNull();
      expect(product.id).toBe('ts-black-01');
      expect(product.color).toBe('Classic Black');
    });

    it('returns null for non-existent ID', () => {
      expect(getProductById('nonexistent')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getProductById('')).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    it('returns products for valid category', () => {
      const tshirts = getProductsByCategory('tshirts');
      expect(tshirts.length).toBeGreaterThan(0);
      expect(tshirts.every(p => p.category === 'tshirts')).toBe(true);
    });

    it('returns all products for "all"', () => {
      const all = getProductsByCategory('all');
      expect(all.length).toBeGreaterThan(0);
    });

    it('returns all products for null/undefined', () => {
      const all = getProductsByCategory(null);
      expect(all.length).toBeGreaterThan(0);
    });

    it('returns empty array for nonexistent category', () => {
      const result = getProductsByCategory('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('getSpecsFor', () => {
    it('returns specs for category slug', () => {
      const specs = getSpecsFor('tshirts');
      expect(specs).toBeDefined();
      expect(specs.material).toBeDefined();
    });

    it('returns specs by product ID', () => {
      const specs = getSpecsFor('ts-black-01');
      expect(specs).toBeDefined();
      expect(specs.material).toBeDefined();
    });

    it('falls back to tshirts specs for unknown input', () => {
      const specs = getSpecsFor('completely-unknown');
      expect(specs).toBeDefined();
    });
  });

  describe('getCategoryLabel', () => {
    it('returns label for valid slug', () => {
      const label = getCategoryLabel('tshirts');
      expect(label).toBeTruthy();
      expect(typeof label).toBe('string');
    });

    it('returns "All Products" for unknown slug', () => {
      expect(getCategoryLabel('nonexistent')).toBe('All Products');
    });
  });

  describe('getAvailableSizes', () => {
    it('returns standard size array', () => {
      const sizes = getAvailableSizes();
      expect(sizes).toEqual(['S', 'M', 'L', 'XL', 'XXL']);
    });
  });

  describe('formatPrice', () => {
    it('formats with rupee symbol', () => {
      expect(formatPrice(499)).toBe('₹499');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('₹0');
    });

    it('handles large numbers', () => {
      expect(formatPrice(9999)).toBe('₹9999');
    });
  });
});
