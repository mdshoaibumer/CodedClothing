import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SCALE_LIMITS, POSITION_LIMITS, getZoneById } from '../customization.types';

/**
 * Customization Store — Vistaprint-style Zone-Locked Editor
 * 
 * When a placement zone is active, logo position is LOCKED to the zone's
 * predefined coordinates with only ±nudgeRange% adjustment allowed.
 * Scale is capped by the zone's maxScale value.
 * Rotation is removed entirely (screen printing doesn't need it).
 */

// Bounds checking constants (from shared types)
const POSITION_MIN = POSITION_LIMITS.MIN;
const POSITION_MAX = POSITION_LIMITS.MAX;
const SCALE_MIN = SCALE_LIMITS.MIN;
const SCALE_MAX = SCALE_LIMITS.MAX;

/**
 * Clamp a value within a zone's nudge range around the zone's center coordinate.
 * If no zone is active, falls back to global position limits.
 */
function clampToZone(value, zoneCenter, nudgeRange) {
  const min = zoneCenter - nudgeRange;
  const max = zoneCenter + nudgeRange;
  return Math.max(min, Math.min(max, value));
}

/**
 * Get the effective scale limits for the current zone (or global defaults).
 */
function getScaleLimits(zone) {
  if (!zone) return { min: SCALE_MIN, max: SCALE_MAX };
  return { min: SCALE_MIN, max: zone.maxScale || SCALE_MAX };
}

// Maximum history entries to prevent unbounded localStorage growth
const MAX_HISTORY = 50;

const INITIAL_DESIGN = {
  front: { logo: null, scale: 1, x: 0, y: 0 },
  back: { logo: null, scale: 1, x: 0, y: 0 },
};

const INITIAL_PLACEMENT = {
  front: null, // placement zone ID or null for free-form
  back: null,
};

const useCustomizationStore = create(
  persist(
    (set) => ({
      // --- State ---
      activeView: 'front',
      productId: null, // Track which product the design belongs to
      placementZones: { front: null, back: null }, // Active placement zone IDs
      design: {
        front: {
          logo: null,
          scale: 1,
          x: 0,
          y: 0,
        },
        back: {
          logo: null,
          scale: 1,
          x: 0,
          y: 0,
        },
      },

      // --- History for Undo/Redo ---
      history: {
        past: [],
        future: [],
      },

      // --- Actions ---

      /**
       * Sets the active product. Resets design if switching to a different product.
       * @param {string} id - Product ID
       */
      setProduct: (id) =>
        set((state) => {
          if (state.productId === id) return state;
          return {
            productId: id,
            activeView: 'front',
            placementZones: { ...INITIAL_PLACEMENT },
            design: { ...INITIAL_DESIGN },
            history: { past: [], future: [] },
          };
        }),

      /**
       * Updates the currently active view of the T-shirt.
       * @param {'front' | 'back' | 'both'} view
       */
      setActiveView: (view) => 
        set(() => ({ 
          activeView: (view === 'front' || view === 'back' || view === 'both') ? view : 'front' 
        })),

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
       * Updates the position coordinates for a specific view's logo.
       * When a zone is active, movement is constrained to ±nudgeRange around zone center.
       * @param {'front' | 'back'} view
       * @param {number} x - Horizontal offset.
       * @param {number} y - Vertical offset.
       */
      setPosition: (view, x, y) =>
        set((state) => {
          const zoneId = state.placementZones[view];
          const zone = zoneId ? getZoneById(zoneId) : null;

          let clampedX, clampedY;
          if (zone) {
            // Zone-locked: only allow nudge within zone boundary
            clampedX = clampToZone(x, zone.x, zone.nudgeRange);
            clampedY = clampToZone(y, zone.y, zone.nudgeRange);
          } else {
            // Free-form: use global limits
            clampedX = Math.max(POSITION_MIN, Math.min(POSITION_MAX, x));
            clampedY = Math.max(POSITION_MIN, Math.min(POSITION_MAX, y));
          }

          return {
            design: {
              ...state.design,
              [view]: {
                ...state.design[view],
                x: clampedX,
                y: clampedY,
              },
            },
          };
        }),

      /**
       * Updates the scale value for a specific view's logo.
       * When a zone is active, scale is capped by the zone's maxScale.
       * @param {'front' | 'back'} view
       * @param {number} value - Scale multiplier.
       */
      setScale: (view, value) =>
        set((state) => {
          const zoneId = state.placementZones[view];
          const zone = zoneId ? getZoneById(zoneId) : null;
          const { min, max } = getScaleLimits(zone);

          return {
            design: {
              ...state.design,
              [view]: {
                ...state.design[view],
                scale: Math.max(min, Math.min(max, value)),
              },
            },
          };
        }),

      /**
       * Resets the entire design to initial state.
       */
      resetDesign: () =>
        set({
          activeView: 'front',
          placementZones: { ...INITIAL_PLACEMENT },
          design: { ...INITIAL_DESIGN },
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
       * Applies a predefined placement zone — snaps logo to the zone's position and scale.
       * Logo becomes LOCKED to this zone until cleared.
       * @param {string} zoneId - Placement zone ID (e.g., 'left-chest', 'full-front')
       */
      applyPlacementZone: (zoneId) =>
        set((state) => {
          const zone = getZoneById(zoneId);
          if (!zone) return state;
          const { side, x, y, scale } = zone;
          return {
            activeView: side,
            placementZones: { ...state.placementZones, [side]: zoneId },
            design: {
              ...state.design,
              [side]: {
                ...state.design[side],
                x,
                y,
                scale,
              },
            },
          };
        }),

      /**
       * Clears the placement zone for a side (switches to free-form mode).
       * @param {'front' | 'back'} side
       */
      clearPlacementZone: (side) =>
        set((state) => ({
          placementZones: { ...state.placementZones, [side]: null },
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
       * Stores only lightweight references (logo presence flag + transforms)
       * to avoid bloating localStorage with repeated base64 data URLs.
       */
      saveToHistory: () =>
        set((state) => {
          // Create a lightweight snapshot — preserve logo URLs as-is since
          // structuredClone of large data URLs x50 would exceed localStorage quota
          const snapshot = {
            front: { ...state.design.front },
            back: { ...state.design.back },
          };
          return {
            history: {
              past: [...state.history.past, snapshot].slice(-MAX_HISTORY),
              future: [],
            },
          };
        }),

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
      // Only persist view preference and product ID — never persist uploaded logos
      // or undo/redo history to avoid leaking user uploads across sessions
      partialize: (state) => ({
        activeView: state.activeView,
        productId: state.productId,
      }),
    }
  )
);

export default useCustomizationStore;
