/**
 * Canvas Utilities
 * Professional-grade utilities for canvas operations, bounds checking,
 * coordinate transformations, and print simulation.
 */

/**
 * Check if a position is within printable bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} margin - Safe margin from edges (percentage)
 * @returns {boolean} Whether position is within bounds
 */
export const isWithinBounds = (x, y, width, height, margin = 10) => {
  const marginX = (width * margin) / 100;
  const marginY = (height * margin) / 100;

  return (
    x >= -marginX &&
    x <= marginX &&
    y >= -marginY &&
    y <= marginY
  );
};

/**
 * Clamp position to printable bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} margin - Safe margin from edges (percentage)
 * @returns {object} Clamped coordinates {x, y}
 */
export const clampToBounds = (x, y, width, height, margin = 10) => {
  const marginX = (width * margin) / 100;
  const marginY = (height * margin) / 100;

  return {
    x: Math.max(-marginX, Math.min(marginX, x)),
    y: Math.max(-marginY, Math.min(marginY, y))
  };
};

/**
 * Calculate optimal scale for logo to fit within bounds
 * @param {number} logoWidth - Logo natural width
 * @param {number} logoHeight - Logo natural height
 * @param {number} canvasWidth - Canvas width
 * @param {number} canvasHeight - Canvas height
 * @param {number} maxScale - Maximum allowed scale
 * @returns {number} Optimal scale factor
 */
export const calculateOptimalScale = (logoWidth, logoHeight, canvasWidth, canvasHeight, maxScale = 1.5) => {
  const canvasAspect = canvasWidth / canvasHeight;
  const logoAspect = logoWidth / logoHeight;

  let scale;
  if (logoAspect > canvasAspect) {
    // Logo is wider relative to canvas
    scale = (canvasWidth * 0.6) / logoWidth;
  } else {
    // Logo is taller relative to canvas
    scale = (canvasHeight * 0.6) / logoHeight;
  }

  return Math.min(scale, maxScale);
};

/**
 * Convert percentage coordinates to pixel coordinates
 * @param {number} percentX - X percentage (-100 to 100)
 * @param {number} percentY - Y percentage (-100 to 100)
 * @param {number} containerWidth - Container width in pixels
 * @param {number} containerHeight - Container height in pixels
 * @returns {object} Pixel coordinates {x, y}
 */
export const percentToPixels = (percentX, percentY, containerWidth, containerHeight) => {
  return {
    x: (percentX / 100) * (containerWidth / 2),
    y: (percentY / 100) * (containerHeight / 2)
  };
};

/**
 * Convert pixel coordinates to percentage coordinates
 * @param {number} pixelX - X pixels
 * @param {number} pixelY - Y pixels
 * @param {number} containerWidth - Container width in pixels
 * @param {number} containerHeight - Container height in pixels
 * @returns {object} Percentage coordinates {x, y}
 */
export const pixelsToPercent = (pixelX, pixelY, containerWidth, containerHeight) => {
  return {
    x: (pixelX / (containerWidth / 2)) * 100,
    y: (pixelY / (containerHeight / 2)) * 100
  };
};

/**
 * Advanced snapping system with multi-guide support
 * @param {number} x - X position in pixels
 * @param {number} y - Y position in pixels
 * @param {object} containerRect - Container bounding rect
 * @param {number} threshold - Snap threshold in pixels
 * @returns {object} Snapping result with guides and magnetic feedback
 */
export const checkAdvancedSnapping = (x, y, containerRect, threshold = 25) => {
  // Print area dimensions (70% width, 50% height, centered)
  const printArea = {
    left: containerRect.width * 0.15,
    right: containerRect.width * 0.85,
    top: containerRect.height * 0.25,
    bottom: containerRect.height * 0.75,
    centerX: containerRect.width / 2,
    centerY: containerRect.height / 2
  };

  // Calculate distances to all snap points
  const distances = {
    centerX: Math.abs(x - printArea.centerX),
    centerY: Math.abs(y - printArea.centerY),
    leftEdge: Math.abs(x - printArea.left),
    rightEdge: Math.abs(x - printArea.right),
    topEdge: Math.abs(y - printArea.top),
    bottomEdge: Math.abs(y - printArea.bottom)
  };

  // Determine snapping targets
  const snapTargets = {
    x: x,
    y: y,
    guides: { horizontal: false, vertical: false, edges: [] }
  };

  // Horizontal snapping (center, top, bottom)
  if (distances.centerY < threshold) {
    snapTargets.y = printArea.centerY;
    snapTargets.guides.horizontal = true;
    snapTargets.guides.edges.push('center');
  } else if (distances.topEdge < threshold) {
    snapTargets.y = printArea.top;
    snapTargets.guides.horizontal = true;
    snapTargets.guides.edges.push('top');
  } else if (distances.bottomEdge < threshold) {
    snapTargets.y = printArea.bottom;
    snapTargets.guides.horizontal = true;
    snapTargets.guides.edges.push('bottom');
  }

  // Vertical snapping (center, left, right)
  if (distances.centerX < threshold) {
    snapTargets.x = printArea.centerX;
    snapTargets.guides.vertical = true;
    snapTargets.guides.edges.push('center');
  } else if (distances.leftEdge < threshold) {
    snapTargets.x = printArea.left;
    snapTargets.guides.vertical = true;
    snapTargets.guides.edges.push('left');
  } else if (distances.rightEdge < threshold) {
    snapTargets.x = printArea.right;
    snapTargets.guides.vertical = true;
    snapTargets.guides.edges.push('right');
  }

  const isSnapping = snapTargets.guides.horizontal || snapTargets.guides.vertical;

  return {
    snappedX: snapTargets.x,
    snappedY: snapTargets.y,
    showGuides: snapTargets.guides,
    isSnapping,
    snapStrength: isSnapping ? Math.max(0, 1 - Math.max(
      distances.centerX / threshold,
      distances.centerY / threshold,
      distances.leftEdge / threshold,
      distances.rightEdge / threshold,
      distances.topEdge / threshold,
      distances.bottomEdge / threshold
    )) : 0
  };
};

/**
 * Apply magnetic easing to snapping
 * @param {number} current - Current position
 * @param {number} target - Target position
 * @param {number} strength - Snap strength (0-1)
 * @param {number} resistance - Magnetic resistance factor
 * @returns {number} Eased position
 */
export const applyMagneticEasing = (current, target, strength, resistance = 0.3) => {
  if (strength === 0) return current;

  const distance = target - current;
  const magneticForce = distance * strength * (1 - resistance);
  const eased = current + magneticForce;

  // Add slight overshoot for magnetic feel
  const overshoot = distance * strength * 0.1;
  return eased + overshoot;
};

/**
 * Smooth interpolation with easing curves
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {number} factor - Interpolation factor (0-1)
 * @param {string} easing - Easing type ('linear', 'ease-out', 'magnetic')
 * @returns {number} Interpolated value
 */
export const smoothInterpolate = (current, target, factor = 0.15, easing = 'ease-out') => {
  const distance = target - current;

  switch (easing) {
    case 'magnetic':
      // Magnetic easing with resistance
      return current + distance * factor * 0.8;
    case 'ease-out': {
      // Cubic ease-out for smooth deceleration
      const t = 1 - Math.pow(1 - factor, 3);
      return current + distance * t;
    }
    case 'linear':
    default:
      return current + distance * factor;
  }
};

/**
 * Apply resistance near boundaries
 * @param {number} value - Current value
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @param {number} resistanceZone - Zone size for resistance (percentage)
 * @returns {number} Value with boundary resistance
 */
export const applyBoundaryResistance = (value, min, max, resistanceZone = 0.1) => {
  const range = max - min;
  const zoneSize = range * resistanceZone;

  // Near minimum
  if (value < min + zoneSize) {
    const factor = (value - min) / zoneSize;
    return min + (value - min) * factor;
  }

  // Near maximum
  if (value > max - zoneSize) {
    const factor = (max - value) / zoneSize;
    return max - (max - value) * factor;
  }

  return value;
};

/**
 * Enhanced scale calculation with non-linear mapping
 * @param {number} delta - Mouse delta
 * @param {number} currentScale - Current scale
 * @param {number} sensitivity - Scale sensitivity
 * @returns {number} New scale with easing
 */
export const calculateSmoothScale = (delta, currentScale, sensitivity = 0.005) => {
  // Non-linear scaling: smaller changes at larger scales
  const scaleFactor = 1 + (delta * sensitivity * (1 / Math.sqrt(currentScale)));
  return currentScale * scaleFactor;
};

/**
 * Generate realistic fabric texture CSS
 * @param {string} fabricColor - Base fabric color
 * @param {number} intensity - Texture intensity (0-1)
 * @returns {string} CSS filter string
 */
// eslint-disable-next-line no-unused-vars
export const generateFabricTexture = (_fabricColor = '#ffffff', intensity = 0.3) => {
  const brightness = intensity > 0.5 ? '102%' : '98%';
  const contrast = intensity > 0.5 ? '105%' : '95%';
  const saturation = '101%';

  return `
    brightness(${brightness})
    contrast(${contrast})
    saturate(${saturation})
    drop-shadow(0 1px 2px rgba(0,0,0,0.1))
    drop-shadow(0 0 0 1px rgba(0,0,0,0.05))
  `.trim();
};

/**
 * Create lighting gradient for 3D fabric effect
 * @param {number} angle - Light angle in degrees
 * @param {number} intensity - Light intensity (0-1)
 * @returns {string} CSS gradient string
 */
export const createFabricLighting = (angle = 135, intensity = 0.2) => {
  const startColor = `rgba(255,255,255,${intensity * 0.8})`;
  const endColor = `rgba(0,0,0,${intensity * 0.3})`;

  return `linear-gradient(${angle}deg, ${startColor} 0%, transparent 30%, transparent 70%, ${endColor} 100%)`;
};

/**
 * Calculate distance between two points
 * @param {number} x1 - Point 1 X
 * @param {number} y1 - Point 1 Y
 * @param {number} x2 - Point 2 X
 * @param {number} y2 - Point 2 Y
 * @returns {number} Distance
 */
export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Check if point is inside rectangle
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {number} rx - Rectangle X
 * @param {number} ry - Rectangle Y
 * @param {number} rw - Rectangle width
 * @param {number} rh - Rectangle height
 * @returns {boolean} Whether point is inside rectangle
 */
export const pointInRect = (px, py, rx, ry, rw, rh) => {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
};

/**
 * Generate print-safe area coordinates
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} bleed - Bleed margin in pixels
 * @returns {object} Safe area bounds {x, y, width, height}
 */
export const getPrintSafeArea = (width, height, bleed = 20) => {
  return {
    x: bleed,
    y: bleed,
    width: width - (bleed * 2),
    height: height - (bleed * 2)
  };
};

/**
 * Simulate fabric texture blend mode
 * @param {string} baseColor - Base fabric color (hex)
 * @param {number} opacity - Logo opacity
 * @returns {string} CSS filter string for realistic blending
 */
export const getFabricBlend = (baseColor, opacity = 0.9) => {
  // Convert hex to RGB for calculations
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);

  // Create a more realistic fabric blend
  const brightness = (r + g + b) / 3;
  const contrast = brightness > 128 ? '110%' : '90%';
  const saturation = '105%';

  return `opacity(${opacity}) brightness(${contrast}) saturate(${saturation})`;
};