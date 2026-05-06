import { create } from 'zustand';

/**
 * Toast Store
 * Global notification management for errors, success, warnings
 */
const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${crypto.randomUUID()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

export default useToastStore;
