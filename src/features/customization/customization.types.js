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
  MIN: 0.3,
  MAX: 2.0,
  DEFAULT: 1.0
};

// Position limits
export const POSITION_LIMITS = {
  MIN: -80,
  MAX: 80,
  DEFAULT: 0
};

// Rotation limits
export const ROTATION_LIMITS = {
  MIN: 0,
  MAX: 360,
  DEFAULT: 0
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

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};