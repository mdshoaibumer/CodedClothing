/**
 * Customization Types and Constants
 * Type definitions and constants for the customization system
 */

/**
 * @typedef {Object} LogoPosition
 * @property {number} x - X coordinate as percentage (-100 to 100)
 * @property {number} y - Y coordinate as percentage (-100 to 100)
 */

/**
 * @typedef {Object} LogoTransform
 * @property {number} scale - Scale factor (0.3 to 2.0)
 * @property {number} rotation - Rotation angle in degrees (0-360)
 */

/**
 * @typedef {Object} LogoDesign
 * @property {string|null} logo - Logo URL or data URL
 * @property {number} scale - Scale factor
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} rotation - Rotation angle
 */

/**
 * @typedef {Object} DesignState
 * @property {LogoDesign} front - Front design
 * @property {LogoDesign} back - Back design
 */

/**
 * @typedef {Object} CustomizationState
 * @property {'front'|'back'|'both'} activeView - Currently active view
 * @property {DesignState} design - Current design state
 * @property {Object} history - Undo/redo history
 * @property {LogoDesign[]} history.past - Past states
 * @property {LogoDesign[]} history.future - Future states
 */

// View constants
export const VIEWS = {
  FRONT: 'front',
  BACK: 'back',
  BOTH: 'both'
};

// Scale limits
export const SCALE_LIMITS = {
  MIN: 0.1,
  MAX: 2.0,
  DEFAULT: 1.0
};

// Position limits
export const POSITION_LIMITS = {
  MIN: -80,
  MAX: 80,
  DEFAULT: 0
};

// Rotation removed — screen printing doesn't need it
// Kept as zero-value constant for backward compat if needed
export const ROTATION_LIMITS = {
  MIN: 0,
  MAX: 0,
  DEFAULT: 0
};

// DPI constants for print quality validation
export const DPI_REQUIREMENTS = {
  MIN_ACCEPTABLE: 150, // Minimum for acceptable print
  RECOMMENDED: 300,    // Recommended for crisp output
  // Zone print sizes in inches (used to calculate required pixels)
  ZONE_PRINT_SIZES: {
    'left-chest': { width: 4, height: 4 },
    'right-chest': { width: 4, height: 4 },
    'center-chest': { width: 8, height: 8 },
    'full-front': { width: 12, height: 14 },
    'lower-front': { width: 8, height: 6 },
    'upper-back': { width: 10, height: 5 },
    'center-back': { width: 10, height: 8 },
    'full-back': { width: 12, height: 14 },
    'lower-back': { width: 8, height: 6 },
  },
};

// Canvas dimensions (relative)
export const CANVAS_DIMENSIONS = {
  ASPECT_RATIO: 3/4,
  PRINTABLE_MARGIN: 10 // percentage
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PLACEMENT ZONES — Vistaprint-style predefined print area zones
   Each zone defines: position (x,y), scale, and the bounding box on the canvas.
   Coordinates are percentages relative to the printable area (-80 to 80).
   boundingBox is CSS percentages for visual overlay on the TShirtCanvas.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * @typedef {Object} PlacementZone
 * @property {string} id - Unique zone identifier
 * @property {string} label - Display label
 * @property {string} description - Short description for tooltips
 * @property {string} icon - Emoji icon
 * @property {'front'|'back'} side - Which side of the shirt
 * @property {number} x - Default X position (percentage)
 * @property {number} y - Default Y position (percentage)
 * @property {number} scale - Default scale for this zone
 * @property {Object} boundingBox - CSS positioning for visual overlay
 * @property {string} boundingBox.top - CSS top
 * @property {string} boundingBox.left - CSS left
 * @property {string} boundingBox.width - CSS width
 * @property {string} boundingBox.height - CSS height
 */

export const PLACEMENT_ZONES = {
  // ─── FRONT ZONES ───
  // NOTE: boundingBox percentages are relative to the overlay div (inset-6/inset-10
  // inside the 3:4 canvas container). Portrait images (1152×1536) fill the container
  // exactly via object-cover. The t-shirt torso spans roughly 18-82% width and
  // 18-82% height within the overlay.
  'left-chest': {
    id: 'left-chest',
    label: 'Left Chest',
    description: 'Small logo on the left chest area — perfect for corporate branding',
    icon: '◈',
    side: 'front',
    x: -28,
    y: -22,
    scale: 0.35,
    maxScale: 0.5,
    nudgeRange: 30,
    boundingBox: { top: '26%', left: '22%', width: '20%', height: '16%' },
  },
  'right-chest': {
    id: 'right-chest',
    label: 'Right Chest',
    description: 'Small logo on the right chest area — great for badges & monograms',
    icon: '◇',
    side: 'front',
    x: 28,
    y: -22,
    scale: 0.35,
    maxScale: 0.5,
    nudgeRange: 30,
    boundingBox: { top: '26%', left: '58%', width: '20%', height: '16%' },
  },
  'center-chest': {
    id: 'center-chest',
    label: 'Center Chest',
    description: 'Medium design centered on the chest — the classic placement',
    icon: '⬡',
    side: 'front',
    x: 0,
    y: -15,
    scale: 0.65,
    maxScale: 0.85,
    nudgeRange: 30,
    boundingBox: { top: '24%', left: '28%', width: '44%', height: '20%' },
  },
  'full-front': {
    id: 'full-front',
    label: 'Full Front',
    description: 'Large design covering the entire front — maximum impact',
    icon: '▣',
    side: 'front',
    x: 0,
    y: 0,
    scale: 1.0,
    maxScale: 1.2,
    nudgeRange: 25,
    boundingBox: { top: '18%', left: '20%', width: '60%', height: '52%' },
  },
  'lower-front': {
    id: 'lower-front',
    label: 'Lower Front',
    description: 'Design placed on the lower front area — streetwear style',
    icon: '▽',
    side: 'front',
    x: 0,
    y: 20,
    scale: 0.55,
    maxScale: 0.75,
    nudgeRange: 30,
    boundingBox: { top: '52%', left: '27%', width: '46%', height: '20%' },
  },

  // ─── BACK ZONES ───
  'upper-back': {
    id: 'upper-back',
    label: 'Upper Back',
    description: 'Design across the upper back — great for names & numbers',
    icon: '△',
    side: 'back',
    x: 0,
    y: -25,
    scale: 0.6,
    maxScale: 0.8,
    nudgeRange: 30,
    boundingBox: { top: '20%', left: '22%', width: '56%', height: '20%' },
  },
  'center-back': {
    id: 'center-back',
    label: 'Center Back',
    description: 'Centered on the back — balanced and professional',
    icon: '⬡',
    side: 'back',
    x: 0,
    y: -5,
    scale: 0.7,
    maxScale: 0.9,
    nudgeRange: 30,
    boundingBox: { top: '30%', left: '24%', width: '52%', height: '26%' },
  },
  'full-back': {
    id: 'full-back',
    label: 'Full Back',
    description: 'Large design covering the entire back — go bold',
    icon: '▣',
    side: 'back',
    x: 0,
    y: 0,
    scale: 1.0,
    maxScale: 1.2,
    nudgeRange: 25,
    boundingBox: { top: '18%', left: '20%', width: '60%', height: '52%' },
  },
  'lower-back': {
    id: 'lower-back',
    label: 'Lower Back',
    description: 'Design on the lower back area',
    icon: '▽',
    side: 'back',
    x: 0,
    y: 22,
    scale: 0.5,
    maxScale: 0.7,
    nudgeRange: 30,
    boundingBox: { top: '55%', left: '27%', width: '46%', height: '18%' },
  },
};

/** Get placement zones for a specific side */
export const getZonesForSide = (side) =>
  Object.values(PLACEMENT_ZONES).filter((z) => z.side === side);

/** Get a placement zone by ID */
export const getZoneById = (id) => PLACEMENT_ZONES[id] || null;

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};