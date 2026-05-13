import { describe, it, expect } from 'vitest';
import {
  isWithinBounds,
  clampToBounds,
  calculateOptimalScale,
  percentToPixels,
  pixelsToPercent,
  checkAdvancedSnapping,
} from './utils/canvas.utils';

describe('canvas.utils', () => {
  describe('isWithinBounds', () => {
    it('returns true when position is within margin', () => {
      // width=400, height=600, margin=10% → marginX=40, marginY=60
      expect(isWithinBounds(0, 0, 400, 600, 10)).toBe(true);
      expect(isWithinBounds(30, 50, 400, 600, 10)).toBe(true);
      expect(isWithinBounds(-40, -60, 400, 600, 10)).toBe(true);
    });

    it('returns false when position is outside margin', () => {
      expect(isWithinBounds(50, 0, 400, 600, 10)).toBe(false);
      expect(isWithinBounds(0, 70, 400, 600, 10)).toBe(false);
    });

    it('uses default 10% margin', () => {
      expect(isWithinBounds(0, 0, 100, 100)).toBe(true);
      expect(isWithinBounds(10, 10, 100, 100)).toBe(true);
      expect(isWithinBounds(11, 0, 100, 100)).toBe(false);
    });
  });

  describe('clampToBounds', () => {
    it('returns same position when within bounds', () => {
      const result = clampToBounds(5, -10, 400, 600, 10);
      expect(result).toEqual({ x: 5, y: -10 });
    });

    it('clamps position to maximum bounds', () => {
      const result = clampToBounds(100, 200, 400, 600, 10);
      expect(result).toEqual({ x: 40, y: 60 });
    });

    it('clamps position to minimum bounds', () => {
      const result = clampToBounds(-100, -200, 400, 600, 10);
      expect(result).toEqual({ x: -40, y: -60 });
    });
  });

  describe('calculateOptimalScale', () => {
    it('scales wider logo by width', () => {
      // Logo is 1000x500, canvas is 400x600
      // logoAspect (2) > canvasAspect (0.67) → scale by width
      const scale = calculateOptimalScale(1000, 500, 400, 600);
      // Expected: (400 * 0.6) / 1000 = 0.24
      expect(scale).toBeCloseTo(0.24);
    });

    it('scales taller logo by height', () => {
      // Logo is 200x800, canvas is 400x600
      // logoAspect (0.25) < canvasAspect (0.67) → scale by height
      const scale = calculateOptimalScale(200, 800, 400, 600);
      // Expected: (600 * 0.6) / 800 = 0.45
      expect(scale).toBeCloseTo(0.45);
    });

    it('caps at maxScale', () => {
      // Very small logo that would scale up a lot
      const scale = calculateOptimalScale(10, 10, 400, 600, 1.5);
      expect(scale).toBe(1.5);
    });

    it('uses default maxScale of 1.5', () => {
      const scale = calculateOptimalScale(10, 10, 400, 600);
      expect(scale).toBe(1.5);
    });
  });

  describe('percentToPixels', () => {
    it('converts percentage to pixel coordinates', () => {
      // 50% of half-width (200) = 100px; 50% of half-height (300) = 150px
      const result = percentToPixels(50, 50, 400, 600);
      expect(result).toEqual({ x: 100, y: 150 });
    });

    it('handles negative percentages', () => {
      const result = percentToPixels(-100, -100, 400, 600);
      expect(result).toEqual({ x: -200, y: -300 });
    });

    it('handles zero', () => {
      const result = percentToPixels(0, 0, 400, 600);
      expect(result).toEqual({ x: 0, y: 0 });
    });
  });

  describe('pixelsToPercent', () => {
    it('converts pixel to percentage coordinates', () => {
      const result = pixelsToPercent(100, 150, 400, 600);
      expect(result).toEqual({ x: 50, y: 50 });
    });

    it('handles negative pixels', () => {
      const result = pixelsToPercent(-200, -300, 400, 600);
      expect(result).toEqual({ x: -100, y: -100 });
    });

    it('is inverse of percentToPixels', () => {
      const pixels = percentToPixels(35, -60, 800, 1000);
      const percent = pixelsToPercent(pixels.x, pixels.y, 800, 1000);
      expect(percent.x).toBeCloseTo(35);
      expect(percent.y).toBeCloseTo(-60);
    });
  });

  describe('checkAdvancedSnapping', () => {
    const containerRect = { width: 400, height: 600 };

    it('snaps to center when within threshold', () => {
      // Center is at (200, 300)
      const result = checkAdvancedSnapping(198, 302, containerRect, 25);
      expect(result.snappedX).toBe(200);
      expect(result.snappedY).toBe(300);
      expect(result.showGuides.horizontal).toBe(true);
      expect(result.showGuides.vertical).toBe(true);
      expect(result.isSnapping).toBe(true);
    });

    it('does not snap when far from guides', () => {
      // Far from any snap point
      const result = checkAdvancedSnapping(100, 100, containerRect, 25);
      expect(result.snappedX).toBe(100);
      expect(result.snappedY).toBe(100);
      expect(result.showGuides.horizontal).toBe(false);
      expect(result.showGuides.vertical).toBe(false);
      expect(result.isSnapping).toBe(false);
    });

    it('snaps to left edge of print area', () => {
      // Print area left edge: width * 0.15 = 60
      const result = checkAdvancedSnapping(62, 200, containerRect, 25);
      expect(result.snappedX).toBe(60);
      expect(result.showGuides.vertical).toBe(true);
    });

    it('snaps to right edge of print area', () => {
      // Print area right edge: width * 0.85 = 340
      const result = checkAdvancedSnapping(338, 200, containerRect, 25);
      expect(result.snappedX).toBe(340);
      expect(result.showGuides.vertical).toBe(true);
    });
  });
});
