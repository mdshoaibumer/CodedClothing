/**
 * DraggableLogo — Zone-Locked Display Component (Vistaprint-style)
 *
 * In the Vistaprint model, the logo is LOCKED to the selected placement zone.
 * Users control position via nudge buttons and size via a slider in the sidebar.
 * This component only renders the logo at the correct transform — no drag,
 * no resize handles, no rotation.
 *
 * When a zone is active, the logo is positioned directly within the zone's
 * bounding box for pixel-accurate placement. In free-form mode, it uses
 * percentage-based positioning relative to the print area center.
 */
export default function DraggableLogo({ logo, scale, x, y, activeZone }) {
  if (!logo) return null;

  // Zone-locked mode: position logo directly within the zone bounding box
  if (activeZone) {
    const bb = activeZone.boundingBox;

    // Calculate nudge offset (how far the user has moved from zone center)
    const nudgeX = x - activeZone.x;
    const nudgeY = y - activeZone.y;

    // Convert nudge to percentage offset within the zone (nudgeRange → half zone size)
    const zoneWidth = parseFloat(bb.width);
    const zoneHeight = parseFloat(bb.height);
    const nudgeOffsetX = activeZone.nudgeRange > 0
      ? (nudgeX / activeZone.nudgeRange) * (zoneWidth * 0.4)
      : 0;
    const nudgeOffsetY = activeZone.nudgeRange > 0
      ? (nudgeY / activeZone.nudgeRange) * (zoneHeight * 0.4)
      : 0;

    // Scale relative to the zone default (allows user adjustment within zone limits)
    const relativeScale = scale / activeZone.scale;

    return (
      <div
        className="absolute pointer-events-none"
        role="img"
        aria-label={`Logo placed in ${activeZone.label} zone`}
        style={{
          top: bb.top,
          left: bb.left,
          width: bb.width,
          height: bb.height,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${nudgeOffsetX}%, ${nudgeOffsetY}%) scale(${relativeScale})`,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src={logo}
            alt="Custom Design"
            crossOrigin="anonymous"
            draggable={false}
            className="max-w-[90%] max-h-[90%] object-contain pointer-events-none"
            style={{
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
            }}
          />
        </div>
      </div>
    );
  }

  // Free-form mode: position relative to print area center
  // x,y range from -80 to 80, representing offset from center
  // scale ranges from 0.1 to 2.0
  const logoSize = Math.max(20, Math.min(90, scale * 55)); // % of print area
  const centerX = 50 + (x / 80) * 35; // Maps -80..80 to 15%..85%
  const centerY = 50 + (y / 80) * 35;

  return (
    <div
      className="absolute inset-0 select-none pointer-events-none"
      role="img"
      aria-label={`Logo placed at position ${Math.round(x)}%, ${Math.round(y)}%, scale ${Math.round(scale * 100)}%`}
    >
      <div
        className="absolute"
        style={{
          width: `${logoSize}%`,
          height: `${logoSize}%`,
          left: `${centerX}%`,
          top: `${centerY}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <img
          src={logo}
          alt="Custom Design"
          crossOrigin="anonymous"
          draggable={false}
          className="w-full h-full object-contain pointer-events-none"
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
          }}
        />
      </div>
    </div>
  );
}
