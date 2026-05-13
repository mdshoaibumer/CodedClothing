import { describe, it, expect } from 'vitest';
import {
  SCALE_LIMITS,
  POSITION_LIMITS,
  PLACEMENT_ZONES,
  getZonesForSide,
  getZoneById,
  VIEWS,
  UPLOAD_LIMITS,
  DPI_REQUIREMENTS,
} from './customization.types';

describe('customization.types', () => {
  describe('constants', () => {
    it('has correct scale limits', () => {
      expect(SCALE_LIMITS.MIN).toBe(0.1);
      expect(SCALE_LIMITS.MAX).toBe(2.0);
      expect(SCALE_LIMITS.DEFAULT).toBe(1.0);
    });

    it('has correct position limits', () => {
      expect(POSITION_LIMITS.MIN).toBe(-80);
      expect(POSITION_LIMITS.MAX).toBe(80);
      expect(POSITION_LIMITS.DEFAULT).toBe(0);
    });

    it('has correct view constants', () => {
      expect(VIEWS.FRONT).toBe('front');
      expect(VIEWS.BACK).toBe('back');
      expect(VIEWS.BOTH).toBe('both');
    });

    it('has correct upload limits', () => {
      expect(UPLOAD_LIMITS.MAX_SIZE).toBe(5 * 1024 * 1024);
      expect(UPLOAD_LIMITS.ALLOWED_TYPES).toContain('image/png');
      expect(UPLOAD_LIMITS.ALLOWED_TYPES).toContain('image/jpeg');
    });

    it('has DPI requirements', () => {
      expect(DPI_REQUIREMENTS.MIN_ACCEPTABLE).toBe(150);
      expect(DPI_REQUIREMENTS.RECOMMENDED).toBe(300);
    });
  });

  describe('PLACEMENT_ZONES', () => {
    it('has front zones', () => {
      const frontZones = Object.values(PLACEMENT_ZONES).filter(z => z.side === 'front');
      expect(frontZones.length).toBeGreaterThan(0);
    });

    it('has back zones', () => {
      const backZones = Object.values(PLACEMENT_ZONES).filter(z => z.side === 'back');
      expect(backZones.length).toBeGreaterThan(0);
    });

    it('all zones have required properties', () => {
      Object.values(PLACEMENT_ZONES).forEach(zone => {
        expect(zone).toHaveProperty('id');
        expect(zone).toHaveProperty('label');
        expect(zone).toHaveProperty('side');
        expect(zone).toHaveProperty('x');
        expect(zone).toHaveProperty('y');
        expect(zone).toHaveProperty('scale');
        expect(zone).toHaveProperty('maxScale');
        expect(zone).toHaveProperty('nudgeRange');
        expect(zone).toHaveProperty('boundingBox');
      });
    });

    it('zone positions are within valid range', () => {
      Object.values(PLACEMENT_ZONES).forEach(zone => {
        expect(zone.x).toBeGreaterThanOrEqual(POSITION_LIMITS.MIN);
        expect(zone.x).toBeLessThanOrEqual(POSITION_LIMITS.MAX);
        expect(zone.y).toBeGreaterThanOrEqual(POSITION_LIMITS.MIN);
        expect(zone.y).toBeLessThanOrEqual(POSITION_LIMITS.MAX);
      });
    });

    it('zone scales are within valid range', () => {
      Object.values(PLACEMENT_ZONES).forEach(zone => {
        expect(zone.scale).toBeGreaterThanOrEqual(SCALE_LIMITS.MIN);
        expect(zone.scale).toBeLessThanOrEqual(SCALE_LIMITS.MAX);
        expect(zone.maxScale).toBeGreaterThanOrEqual(zone.scale);
      });
    });
  });

  describe('getZonesForSide', () => {
    it('returns only front zones for "front"', () => {
      const zones = getZonesForSide('front');
      expect(zones.length).toBeGreaterThan(0);
      expect(zones.every(z => z.side === 'front')).toBe(true);
    });

    it('returns only back zones for "back"', () => {
      const zones = getZonesForSide('back');
      expect(zones.length).toBeGreaterThan(0);
      expect(zones.every(z => z.side === 'back')).toBe(true);
    });

    it('returns empty for invalid side', () => {
      const zones = getZonesForSide('top');
      expect(zones).toEqual([]);
    });
  });

  describe('getZoneById', () => {
    it('returns zone for valid ID', () => {
      const zone = getZoneById('left-chest');
      expect(zone).not.toBeNull();
      expect(zone.label).toBe('Left Chest');
      expect(zone.side).toBe('front');
    });

    it('returns null for invalid ID', () => {
      expect(getZoneById('nonexistent')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getZoneById('')).toBeNull();
    });
  });
});
