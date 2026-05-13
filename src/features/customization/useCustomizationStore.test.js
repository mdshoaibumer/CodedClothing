import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import useCustomizationStore from './store/useCustomizationStore';

describe('useCustomizationStore', () => {
  beforeEach(() => {
    act(() => {
      useCustomizationStore.getState().resetDesign();
    });
  });

  describe('setProduct', () => {
    it('sets the product ID', () => {
      act(() => {
        useCustomizationStore.getState().setProduct('ts-black-01');
      });

      expect(useCustomizationStore.getState().productId).toBe('ts-black-01');
    });

    it('resets design when switching to a different product', () => {
      act(() => {
        useCustomizationStore.getState().setProduct('ts-black-01');
        useCustomizationStore.getState().setLogo('front', 'data:image/png;base64,abc');
        useCustomizationStore.getState().setProduct('ts-white-02');
      });

      expect(useCustomizationStore.getState().design.front.logo).toBeNull();
    });

    it('does not reset when setting the same product', () => {
      act(() => {
        useCustomizationStore.getState().setProduct('ts-black-01');
        useCustomizationStore.getState().setLogo('front', 'data:image/png;base64,abc');
        useCustomizationStore.getState().setProduct('ts-black-01');
      });

      expect(useCustomizationStore.getState().design.front.logo).toBe('data:image/png;base64,abc');
    });
  });

  describe('setActiveView', () => {
    it('sets view to front', () => {
      act(() => {
        useCustomizationStore.getState().setActiveView('front');
      });
      expect(useCustomizationStore.getState().activeView).toBe('front');
    });

    it('sets view to back', () => {
      act(() => {
        useCustomizationStore.getState().setActiveView('back');
      });
      expect(useCustomizationStore.getState().activeView).toBe('back');
    });

    it('sets view to both', () => {
      act(() => {
        useCustomizationStore.getState().setActiveView('both');
      });
      expect(useCustomizationStore.getState().activeView).toBe('both');
    });

    it('defaults to front for invalid view', () => {
      act(() => {
        useCustomizationStore.getState().setActiveView('invalid');
      });
      expect(useCustomizationStore.getState().activeView).toBe('front');
    });
  });

  describe('setLogo', () => {
    it('sets logo for front view', () => {
      act(() => {
        useCustomizationStore.getState().setLogo('front', 'data:image/png;base64,front-logo');
      });

      expect(useCustomizationStore.getState().design.front.logo).toBe('data:image/png;base64,front-logo');
    });

    it('sets logo for back view', () => {
      act(() => {
        useCustomizationStore.getState().setLogo('back', 'data:image/png;base64,back-logo');
      });

      expect(useCustomizationStore.getState().design.back.logo).toBe('data:image/png;base64,back-logo');
    });

    it('can clear logo by setting null', () => {
      act(() => {
        useCustomizationStore.getState().setLogo('front', 'data:image/png;base64,abc');
        useCustomizationStore.getState().setLogo('front', null);
      });

      expect(useCustomizationStore.getState().design.front.logo).toBeNull();
    });
  });

  describe('setPosition', () => {
    it('sets position within bounds (free-form)', () => {
      act(() => {
        useCustomizationStore.getState().setPosition('front', 30, -20);
      });

      const { x, y } = useCustomizationStore.getState().design.front;
      expect(x).toBe(30);
      expect(y).toBe(-20);
    });

    it('clamps position to global limits', () => {
      act(() => {
        useCustomizationStore.getState().setPosition('front', 100, -100);
      });

      const { x, y } = useCustomizationStore.getState().design.front;
      expect(x).toBe(80); // POSITION_MAX
      expect(y).toBe(-80); // POSITION_MIN
    });

    it('constrains position to zone nudge range when zone is active', () => {
      act(() => {
        // Apply left-chest zone (x: -28, y: -22, nudgeRange: 10)
        useCustomizationStore.getState().applyPlacementZone('left-chest');
        // Try to move far from zone center
        useCustomizationStore.getState().setPosition('front', 50, 50);
      });

      const { x, y } = useCustomizationStore.getState().design.front;
      // Should be clamped to zone center ± nudgeRange
      expect(x).toBe(-28 + 10); // -18 (max of zone)
      expect(y).toBe(-22 + 10); // -12 (max of zone)
    });
  });

  describe('setScale', () => {
    it('sets scale within global limits', () => {
      act(() => {
        useCustomizationStore.getState().setScale('front', 1.5);
      });

      expect(useCustomizationStore.getState().design.front.scale).toBe(1.5);
    });

    it('clamps scale to minimum', () => {
      act(() => {
        useCustomizationStore.getState().setScale('front', 0.01);
      });

      expect(useCustomizationStore.getState().design.front.scale).toBe(0.1); // SCALE_MIN
    });

    it('clamps scale to maximum', () => {
      act(() => {
        useCustomizationStore.getState().setScale('front', 5);
      });

      expect(useCustomizationStore.getState().design.front.scale).toBe(2.0); // SCALE_MAX
    });

    it('respects zone maxScale when zone is active', () => {
      act(() => {
        // left-chest zone has maxScale: 0.5
        useCustomizationStore.getState().applyPlacementZone('left-chest');
        useCustomizationStore.getState().setScale('front', 1.0);
      });

      expect(useCustomizationStore.getState().design.front.scale).toBe(0.5);
    });
  });

  describe('applyPlacementZone', () => {
    it('snaps position and scale to zone defaults', () => {
      act(() => {
        useCustomizationStore.getState().applyPlacementZone('center-chest');
      });

      const state = useCustomizationStore.getState();
      expect(state.design.front.x).toBe(0);
      expect(state.design.front.y).toBe(-15);
      expect(state.design.front.scale).toBe(0.65);
      expect(state.placementZones.front).toBe('center-chest');
    });

    it('sets activeView to the zone side', () => {
      act(() => {
        useCustomizationStore.getState().applyPlacementZone('upper-back');
      });

      expect(useCustomizationStore.getState().activeView).toBe('back');
    });

    it('does nothing for invalid zone', () => {
      const before = useCustomizationStore.getState().design;
      act(() => {
        useCustomizationStore.getState().applyPlacementZone('nonexistent-zone');
      });

      expect(useCustomizationStore.getState().design).toEqual(before);
    });
  });

  describe('clearPlacementZone', () => {
    it('removes the active zone for a side', () => {
      act(() => {
        useCustomizationStore.getState().applyPlacementZone('left-chest');
        useCustomizationStore.getState().clearPlacementZone('front');
      });

      expect(useCustomizationStore.getState().placementZones.front).toBeNull();
    });
  });

  describe('copyDesign', () => {
    it('copies front design to back', () => {
      act(() => {
        useCustomizationStore.getState().setLogo('front', 'data:image/png;base64,abc');
        useCustomizationStore.getState().setPosition('front', 10, 20);
        useCustomizationStore.getState().setScale('front', 1.2);
        useCustomizationStore.getState().copyDesign('front', 'back');
      });

      const { back } = useCustomizationStore.getState().design;
      expect(back.logo).toBe('data:image/png;base64,abc');
      expect(back.x).toBe(10);
      expect(back.y).toBe(20);
      expect(back.scale).toBe(1.2);
    });
  });

  describe('undo / redo', () => {
    it('undoes the last saved change', () => {
      act(() => {
        useCustomizationStore.getState().setPosition('front', 10, 10);
        useCustomizationStore.getState().saveToHistory();
        useCustomizationStore.getState().setPosition('front', 50, 50);
        useCustomizationStore.getState().undo();
      });

      const { x, y } = useCustomizationStore.getState().design.front;
      expect(x).toBe(10);
      expect(y).toBe(10);
    });

    it('redoes an undone change', () => {
      act(() => {
        useCustomizationStore.getState().setPosition('front', 10, 10);
        useCustomizationStore.getState().saveToHistory();
        useCustomizationStore.getState().setPosition('front', 50, 50);
        useCustomizationStore.getState().saveToHistory();
        useCustomizationStore.getState().setPosition('front', 70, 70);
        useCustomizationStore.getState().undo();
        useCustomizationStore.getState().redo();
      });

      // After redo, we get the design state that was current before undo
      const state = useCustomizationStore.getState();
      expect(state.design.front.x).toBe(70);
      expect(state.design.front.y).toBe(70);
    });

    it('does nothing when no history to undo', () => {
      const before = useCustomizationStore.getState().design;
      act(() => {
        useCustomizationStore.getState().undo();
      });

      expect(useCustomizationStore.getState().design).toEqual(before);
    });

    it('does nothing when no future to redo', () => {
      const before = useCustomizationStore.getState().design;
      act(() => {
        useCustomizationStore.getState().redo();
      });

      expect(useCustomizationStore.getState().design).toEqual(before);
    });
  });

  describe('resetDesign', () => {
    it('resets all design state to initial', () => {
      act(() => {
        useCustomizationStore.getState().setProduct('ts-black-01');
        useCustomizationStore.getState().setLogo('front', 'data:image/png;base64,abc');
        useCustomizationStore.getState().setPosition('front', 30, 40);
        useCustomizationStore.getState().applyPlacementZone('left-chest');
        useCustomizationStore.getState().resetDesign();
      });

      const state = useCustomizationStore.getState();
      expect(state.activeView).toBe('front');
      expect(state.design.front.logo).toBeNull();
      expect(state.design.front.x).toBe(0);
      expect(state.design.front.y).toBe(0);
      expect(state.design.front.scale).toBe(1);
      expect(state.placementZones.front).toBeNull();
      expect(state.placementZones.back).toBeNull();
      expect(state.history.past).toHaveLength(0);
      expect(state.history.future).toHaveLength(0);
    });
  });

  describe('centerLogo', () => {
    it('resets x and y to 0', () => {
      act(() => {
        useCustomizationStore.getState().setPosition('front', 40, 30);
        useCustomizationStore.getState().centerLogo('front');
      });

      const { x, y } = useCustomizationStore.getState().design.front;
      expect(x).toBe(0);
      expect(y).toBe(0);
    });
  });
});
