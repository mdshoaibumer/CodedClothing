/**
 * useCartStore.js — Shopping Cart State Management
 * 
 * Zustand store with localStorage persistence for cart items.
 * Supports adding, removing, updating quantities, and clearing.
 * Generates a consolidated WhatsApp order message.
 */

import { create } from 'zustand';

const STORAGE_KEY = 'cc-cart';

/** Load cart from localStorage */
function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Persist cart to localStorage */
function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

const useCartStore = create((set, get) => ({
  items: loadCart(),

  /** Add item to cart. If same product+size exists, increment quantity. */
  addItem: (product, size, quantity = 1, hasCustomDesign = false) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === product.id && item.size === size && item.hasCustomDesign === hasCustomDesign
      );

      let newItems;
      if (existingIndex >= 0) {
        newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
      } else {
        newItems = [
          ...state.items,
          {
            id: `cart-${Date.now()}-${crypto.randomUUID()}`,
            productId: product.id,
            color: product.color,
            hex: product.hex,
            image: product.image,
            price: product.price,
            size,
            quantity,
            hasCustomDesign,
          },
        ];
      }

      saveCart(newItems);
      return { items: newItems };
    });
  },

  /** Remove item by cart item ID */
  removeItem: (cartItemId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== cartItemId);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  /** Update quantity for a cart item */
  updateQuantity: (cartItemId, quantity) => {
    if (quantity < 1) return;
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  /** Clear entire cart */
  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  /** Get total item count */
  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /** Get total price */
  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  /** Generate WhatsApp order message */
  getWhatsAppMessage: () => {
    const { items } = get();
    if (items.length === 0) return '';

    const totalPrice = get().getTotalPrice();
    const totalItems = get().getTotalItems();

    let message = `*New Order — Coded Clothing*\n`;
    message += `*Items:* ${totalItems} | *Total:* ₹${totalPrice}\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;

    items.forEach((item, i) => {
      message += `*${i + 1}. ${item.color} Premium Tee*\n`;
      message += `   Size: ${item.size} | Qty: ${item.quantity}\n`;
      message += `   ${item.hasCustomDesign ? '🎨 Custom Design' : 'Plain'}\n`;
      message += `   ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `*Grand Total: ₹${totalPrice}*\n`;
    if (totalPrice >= 999) {
      message += `🚚 _Free Shipping Applied_\n`;
    } else {
      message += `🚚 _Shipping: ₹49_\n`;
      message += `*Order Total: ₹${totalPrice + 49}*\n`;
    }

    return message;
  },
}));

export default useCartStore;
