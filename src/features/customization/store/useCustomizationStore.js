import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SCALE_LIMITS, POSITION_LIMITS, ROTATION_LIMITS } from '../customization.types';

/**
 * Customization Store
 * Manages the state of T-shirt customization including active view,
 * logo uploads, and scaling, with local storage persistence.
 */

// Constants for bounds checking (legacy - prefer types file)
const POSITION_MIN = POSITION_LIMITS.MIN;
const POSITION_MAX = POSITION_LIMITS.MAX;
const SCALE_MIN = SCALE_LIMITS.MIN;
const SCALE_MAX = SCALE_LIMITS.MAX;

// Helper function for efficient deep cloning
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

const useCustomizationStore = create(
  persist(
    (set) => ({
      // --- State ---
      activeView: 'front',
      design: {
        front: {
          logo: null,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
        },
        back: {
          logo: null,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
        },
      },

      // --- History for Undo/Redo ---
      history: {
        past: [],
        future: [],
      },

      // --- Actions ---

      /**
       * Updates the currently active view of the T-shirt.
       * @param {'front' | 'back'} view
       */
      setActiveView: (view) => set({ activeView: view }),

      /**
       * Sets the logo URL for a specific view.
       * @param {'front' | 'back'} view
       * @param {string | null} url - Data URL or remote URL of the logo.
       */
      setLogo: (view, url) =>
        set((state) => ({
          design: {
            ...state.design,
            [view]: {
              ...state.design[view],
              logo: url,
            },
          },
        })),

      /**
       * Updates the position coordinates for a specific view's logo with bounds checking.
       * @param {'front' | 'back'} view
       * @param {number} x - Horizontal offset.
       * @param {number} y - Vertical offset.
       */
      setPosition: (view, x, y) =>
        set((state) => ({
          design: {
            ...state.design,
            [view]: {
              ...state.design[view],
              x: Math.max(POSITION_MIN, Math.min(POSITION_MAX, x)),
              y: Math.max(POSITION_MIN, Math.min(POSITION_MAX, y)),
            },
          },
        })),

      /**
       * Updates the scale value for a specific view's logo with bounds checking.
       * @param {'front' | 'back'} view
       * @param {number} value - Scale multiplier (e.g., 0.5 to 2.0).
       */
      setScale: (view, value) =>
        set((state) => ({
          design: {
            ...state.design,
            [view]: {
              ...state.design[view],
              scale: Math.max(SCALE_MIN, Math.min(SCALE_MAX, value)),
            },
          },
        })),

      /**
       * Updates the rotation value for a specific view's logo.
       * @param {'front' | 'back'} view
       * @param {number} value - Rotation angle in degrees (0-360).
       */
      setRotation: (view, value) =>
        set((state) => ({
          design: {
            ...state.design,
            [view]: {
              ...state.design[view],
              rotation: ((value % 360) + 360) % 360, // Normalize to 0-360
            },
          },
        })),

      /**
       * Resets the entire design to initial state.
       */
      resetDesign: () =>
        set({
          activeView: 'front',
          design: {
            front: { logo: null, scale: 1, x: 0, y: 0, rotation: 0 },
            back: { logo: null, scale: 1, x: 0, y: 0, rotation: 0 },
          },
          history: { past: [], future: [] },
        }),

      /**
       * Centers a logo horizontally on a specific view.
       * @param {'front' | 'back'} view
       */
      centerLogo: (view) =>
        set((state) => ({
          design: {
            ...state.design,
            [view]: {
              ...state.design[view],
              x: 0,
              y: 0,
            },
          },
        })),

      /**
       * Copies design from one view to another.
       * @param {'front' | 'back'} fromView
       * @param {'front' | 'back'} toView
       */
      copyDesign: (fromView, toView) =>
        set((state) => ({
          design: {
            ...state.design,
            [toView]: {
              ...state.design[fromView],
            },
          },
        })),

      /**
       * Pushes current state to history for undo functionality.
       */
      saveToHistory: () =>
        set((state) => ({
          history: {
            past: [...state.history.past, deepClone(state.design)],
            future: [],
          },
        })),

      /**
       * Undoes the last design change.
       */
      undo: () =>
        set((state) => {
          if (state.history.past.length === 0) return state;
          const newPast = [...state.history.past];
          const prevDesign = newPast.pop();
          return {
            design: prevDesign,
            history: {
              past: newPast,
              future: [state.design, ...state.history.future],
            },
          };
        }),

      /**
       * Redoes the last undone change.
       */
      redo: () =>
        set((state) => {
          if (state.history.future.length === 0) return state;
          const newFuture = [...state.history.future];
          const nextDesign = newFuture.shift();
          return {
            design: nextDesign,
            history: {
              past: [...state.history.past, state.design],
              future: newFuture,
            },
          };
        }),
    }),
    {
      name: 'coded-clothing-customization-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCustomizationStore;
