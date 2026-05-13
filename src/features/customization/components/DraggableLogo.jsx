/**
 * DraggableLogo — Zone-Locked Display Component (Vistaprint-style)
 *
 * In the Vistaprint model, the logo is LOCKED to the selected placement zone.
 * Users control position via nudge buttons and size via a slider in the sidebar.
 * This component only renders the logo at the correct transform — no drag,
 * no resize handles, no rotation.
 *
 * The logo is purely a visual representation of the current state.
 */
export default function DraggableLogo({ logo, scale, x, y }) {
  if (!logo) return null;

  return (
    <div
      className="absolute inset-0 select-none pointer-events-none"
      role="img"
      aria-label={`Logo placed at position ${Math.round(x)}%, ${Math.round(y)}%, scale ${Math.round(scale * 100)}%`}
    >
      {/* Logo element with transform — no interaction, purely display */}
      <div
        className="absolute w-full h-full"
        style={{
          transform: `translate(${x}%, ${y}%) scale(${scale})`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo Image */}
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
