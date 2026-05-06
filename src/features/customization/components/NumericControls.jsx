// NumericControls updated for better both-view editor UX
import { useState } from 'react';
import useCustomizationStore from '../store/useCustomizationStore';
import useToastStore from '../../notifications/store/useToastStore';

/**
 * NumericControls Component
 * Provides precise numeric input controls for position, scale, and rotation
 * Now enhanced to work with "both" view for better UX
 */
export default function NumericControls() {
  const { activeView, design, setPosition, setScale, setRotation } = useCustomizationStore();
  const addToast = useToastStore((state) => state.addToast);

  // Track which side user is editing when in "both" view
  const [bothViewEditSide, setBothViewEditSide] = useState('front');

  // For "both" view, show controls only if both sides have logos
  const hasFrontLogo = design.front.logo;
  const hasBackLogo = design.back.logo;
  const showControls = activeView === 'both' ? (hasFrontLogo && hasBackLogo) : (design[activeView]?.logo);

  // Determine which design values to show/edit
  const editSide = activeView === 'both' ? bothViewEditSide : activeView;
  const currentDesign = design[editSide];

  // Derive local values from store using render-time sync pattern
  const [prevDesignKey, setPrevDesignKey] = useState('');
  const designKey = `${editSide}-${currentDesign?.x}-${currentDesign?.y}-${currentDesign?.scale}-${currentDesign?.rotation}`;

  const [localValues, setLocalValues] = useState({
    x: currentDesign?.x || 0,
    y: currentDesign?.y || 0,
    scale: currentDesign?.scale || 1,
    rotation: currentDesign?.rotation || 0,
  });

  // Sync from store when values change externally
  if (prevDesignKey !== designKey) {
    setPrevDesignKey(designKey);
    const newValues = {
      x: currentDesign?.x || 0,
      y: currentDesign?.y || 0,
      scale: currentDesign?.scale || 1,
      rotation: currentDesign?.rotation || 0,
    };
    if (
      newValues.x !== localValues.x ||
      newValues.y !== localValues.y ||
      newValues.scale !== localValues.scale ||
      newValues.rotation !== localValues.rotation
    ) {
      setLocalValues(newValues);
    }
  }

  const handlePositionChange = (axis, value) => {
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.max(-80, Math.min(80, numValue));

    setLocalValues(prev => ({ ...prev, [axis]: clampedValue }));
    setPosition(editSide, axis === 'x' ? clampedValue : currentDesign.x, axis === 'y' ? clampedValue : currentDesign.y);
  };

  const handleScaleChange = (value) => {
    const numValue = parseFloat(value) || 1;
    const clampedValue = Math.max(0.1, Math.min(2.0, numValue));

    setLocalValues(prev => ({ ...prev, scale: clampedValue }));
    setScale(editSide, clampedValue);
  };

  const handleRotationChange = (value) => {
    const numValue = parseFloat(value) || 0;
    const normalizedValue = ((numValue % 360) + 360) % 360;

    setLocalValues(prev => ({ ...prev, rotation: normalizedValue }));
    setRotation(editSide, normalizedValue);
  };

  const resetToDefaults = () => {
    if (activeView === 'both') {
      // Reset both sides
      setPosition('front', 0, 0);
      setScale('front', 1);
      setRotation('front', 0);
      setPosition('back', 0, 0);
      setScale('back', 1);
      setRotation('back', 0);
      addToast('Both sides reset to defaults!', 'success');
    } else {
      setLocalValues({ x: 0, y: 0, scale: 1, rotation: 0 });
      setPosition(editSide, 0, 0);
      setScale(editSide, 1);
      setRotation(editSide, 0);
      addToast('Reset to defaults!', 'success');
    }
  };

  if (!showControls) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 md:p-8 rounded-[2rem] border border-purple-100/50 space-y-4">
      <h4 className="text-[9px] md:text-[10px] font-black text-purple-900 mb-3 md:mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        Precision Controls {activeView === 'both' ? `(${editSide})` : `(${activeView})`}
      </h4>

      {activeView === 'both' && (
        <div className="flex gap-2 p-2 bg-white/50 rounded-lg">
          <button
            onClick={() => setBothViewEditSide('front')}
            className={`flex-1 px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
              bothViewEditSide === 'front'
                ? 'bg-purple-500 text-white'
                : 'bg-white border-2 border-purple-100 text-purple-700 hover:border-purple-500'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setBothViewEditSide('back')}
            className={`flex-1 px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
              bothViewEditSide === 'back'
                ? 'bg-purple-500 text-white'
                : 'bg-white border-2 border-purple-100 text-purple-700 hover:border-purple-500'
            }`}
          >
            Back
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* Position X */}
        <div className="space-y-2">
          <label htmlFor="ctrl-pos-x" className="text-[8px] font-black text-purple-700 uppercase tracking-widest">X Position</label>
          <input
            id="ctrl-pos-x"
            type="number"
            value={Math.round(localValues.x)}
            onChange={(e) => handlePositionChange('x', e.target.value)}
            min="-80"
            max="80"
            step="1"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Position Y */}
        <div className="space-y-2">
          <label htmlFor="ctrl-pos-y" className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Y Position</label>
          <input
            id="ctrl-pos-y"
            type="number"
            value={Math.round(localValues.y)}
            onChange={(e) => handlePositionChange('y', e.target.value)}
            min="-80"
            max="80"
            step="1"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Scale */}
        <div className="space-y-2">
          <label htmlFor="ctrl-scale" className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Scale (%)</label>
          <input
            id="ctrl-scale"
            type="number"
            value={Math.round(localValues.scale * 100)}
            onChange={(e) => handleScaleChange(e.target.value / 100)}
            min="10"
            max="200"
            step="1"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <label htmlFor="ctrl-rotation" className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Rotation (°)</label>
          <input
            id="ctrl-rotation"
            type="number"
            value={Math.round(localValues.rotation)}
            onChange={(e) => handleRotationChange(e.target.value)}
            min="0"
            max="359"
            step="15"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetToDefaults}
        className="w-full px-4 py-2 bg-white border-2 border-purple-100 text-[9px] font-black uppercase tracking-widest text-purple-700 hover:border-purple-500 hover:bg-purple-50 transition-all rounded-lg"
      >
        🔄 Reset to Center
      </button>
    </div>
  );
}