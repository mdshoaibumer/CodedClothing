import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import useCartStore from './useCartStore';

const mockProduct = {
  id: 'ts-black-01',
  category: 'tshirts',
  color: 'Classic Black',
  hex: '#1a1a1a',
  image: '/images/tshirts/black_front_side.png',
  price: 499,
};

describe('useCartStore', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  describe('addItem', () => {
    it('adds a new item to cart', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]).toMatchObject({
        productId: 'ts-black-01',
        category: 'tshirts',
        color: 'Classic Black',
        size: 'M',
        quantity: 1,
        hasCustomDesign: false,
        price: 499,
      });
    });

    it('increments quantity for duplicate product+size+customDesign', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'L', 1, false);
        useCartStore.getState().addItem(mockProduct, 'L', 2, false);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it('treats same product with different sizes as separate items', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
        useCartStore.getState().addItem(mockProduct, 'L', 1, false);
      });

      expect(useCartStore.getState().items).toHaveLength(2);
    });

    it('treats same product with/without custom design as separate items', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
        useCartStore.getState().addItem(mockProduct, 'M', 1, true);
      });

      expect(useCartStore.getState().items).toHaveLength(2);
    });

    it('defaults quantity to 1', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'XL');
      });

      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('removes item by cart ID', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
      });

      const cartItemId = useCartStore.getState().items[0].id;

      act(() => {
        useCartStore.getState().removeItem(cartItemId);
      });

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('does not affect other items', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
        useCartStore.getState().addItem({ ...mockProduct, id: 'ts-white-02' }, 'L', 1, false);
      });

      const firstItemId = useCartStore.getState().items[0].id;

      act(() => {
        useCartStore.getState().removeItem(firstItemId);
      });

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('ts-white-02');
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity for a cart item', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
      });

      const cartItemId = useCartStore.getState().items[0].id;

      act(() => {
        useCartStore.getState().updateQuantity(cartItemId, 5);
      });

      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('ignores quantity less than 1', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 2, false);
      });

      const cartItemId = useCartStore.getState().items[0].id;

      act(() => {
        useCartStore.getState().updateQuantity(cartItemId, 0);
      });

      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });
  });

  describe('clearCart', () => {
    it('removes all items', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
        useCartStore.getState().addItem(mockProduct, 'L', 2, false);
        useCartStore.getState().clearCart();
      });

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('getTotalItems', () => {
    it('returns sum of all quantities', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 2, false);
        useCartStore.getState().addItem(mockProduct, 'L', 3, false);
      });

      expect(useCartStore.getState().getTotalItems()).toBe(5);
    });

    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getTotalItems()).toBe(0);
    });
  });

  describe('getTotalPrice', () => {
    it('returns sum of price * quantity for all items', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 2, false); // 499 * 2
        useCartStore.getState().addItem({ ...mockProduct, id: 'ts-white-02', price: 449 }, 'L', 1, false); // 449 * 1
      });

      expect(useCartStore.getState().getTotalPrice()).toBe(1447);
    });

    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getTotalPrice()).toBe(0);
    });
  });

  describe('getWhatsAppMessage', () => {
    it('returns empty string for empty cart', () => {
      expect(useCartStore.getState().getWhatsAppMessage()).toBe('');
    });

    it('generates message with item details', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
      });

      const message = useCartStore.getState().getWhatsAppMessage();
      expect(message).toContain('New Order — Coded Clothing');
      expect(message).toContain('Classic Black');
      expect(message).toContain('Size: M');
      expect(message).toContain('₹499');
    });

    it('shows free shipping for orders >= ₹999', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 2, false); // 998
        useCartStore.getState().addItem(mockProduct, 'L', 1, false); // +499 = 1497
      });

      const message = useCartStore.getState().getWhatsAppMessage();
      expect(message).toContain('Free Shipping Applied');
    });

    it('shows shipping charge for orders < ₹999', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false); // 499
      });

      const message = useCartStore.getState().getWhatsAppMessage();
      expect(message).toContain('Shipping: ₹49');
    });

    it('marks custom design items', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, true);
      });

      const message = useCartStore.getState().getWhatsAppMessage();
      expect(message).toContain('Custom Design');
    });
  });

  describe('localStorage persistence', () => {
    it('persists cart to localStorage', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
      });

      const stored = JSON.parse(localStorage.getItem('cc-cart'));
      expect(stored).toHaveLength(1);
      expect(stored[0].productId).toBe('ts-black-01');
    });

    it('clears localStorage when cart is cleared', () => {
      act(() => {
        useCartStore.getState().addItem(mockProduct, 'M', 1, false);
        useCartStore.getState().clearCart();
      });

      const stored = JSON.parse(localStorage.getItem('cc-cart'));
      expect(stored).toEqual([]);
    });
  });
});
