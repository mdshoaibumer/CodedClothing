import React, { useState, useEffect } from 'react';
import useCustomizationStore from '../store/useCustomizationStore';
import useToastStore from '../../notifications/store/useToastStore';

export default function NumericControls() {
  const { activeView, design, setPosition, setScale, setRotation } = useCustomizationStore();
  const addToast = useToastStore((state) => state.addToast);
  const [activeSide, setActiveSide] = useState('front');
  const [localValues, setLocalValues] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  const hasFrontLogo = Boolean(design.front.logo);
  const hasBackLogo = Boolean(design.back.logo);
  const showControls = activeView === 'both' ? hasFrontLogo && hasBackLogo : Boolean(design[activeView]?.logo);

  const editSide = activeView === 'both' ? activeSide : activeView;
  const currentDesign = design[editSide];

  useEffect(() => {
    if (!currentDesign) return;

    setLocalValues({
      x: currentDesign.x,
      y: currentDesign.y,
      scale: currentDesign.scale,
      rotation: currentDesign.rotation,
    });
  }, [currentDesign, editSide]);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handlePositionChange = (axis, rawValue) => {
    const parsed = Number(rawValue);
    const value = Number.isNaN(parsed) ? 0 : parsed;
    const clamped = clamp(value, -80, 80);

    setLocalValues((prev) => ({ ...prev, [axis]: clamped }));
    setPosition(editSide, axis === 'x' ? clamped : currentDesign.x, axis === 'y' ? clamped : currentDesign.y);
  };

  const handleScaleChange = (rawValue) => {
    const parsed = Number(rawValue);
    const value = Number.isNaN(parsed) ? 1 : parsed;
    const clamped = clamp(value, 0.3, 2.0);

    setLocalValues((prev) => ({ ...prev, scale: clamped }));
    setScale(editSide, clamped);
  };

  const handleRotationChange = (rawValue) => {
    const parsed = Number(rawValue);
    const value = Number.isNaN(parsed) ? 0 : parsed;
    const normalized = ((value % 360) + 360) % 360;

    setLocalValues((prev) => ({ ...prev, rotation: normalized }));
    setRotation(editSide, normalized);
  };

  const resetToDefaults = () => {
    if (activeView === 'both') {
      setPosition('front', 0, 0);
      setScale('front', 1);
      setRotation('front', 0);
      setPosition('back', 0, 0);
      setScale('back', 1);
      setRotation('back', 0);
      addToast('Both sides reset to defaults!', 'success');
      return;
    }

    setLocalValues({ x: 0, y: 0, scale: 1, rotation: 0 });
    setPosition(editSide, 0, 0);
    setScale(editSide, 1);
    setRotation(editSide, 0);
    addToast('Reset to defaults!', 'success');
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
            type="button"
            onClick={() => setActiveSide('front')}
            className={`flex-1 px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
              activeSide === 'front'
                ? 'bg-purple-500 text-white'
                : 'bg-white border-2 border-purple-100 text-purple-700 hover:border-purple-500'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`flex-1 px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${
              activeSide === 'back'
                ? 'bg-purple-500 text-white'
                : 'bg-white border-2 border-purple-100 text-purple-700 hover:border-purple-500'
            }`}
          >
            Back
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-2">
          <label className="text-[8px] font-black text-purple-700 uppercase tracking-widest">X Position</label>
          <input
            type="number"
            value={Math.round(localValues.x)}
            onChange={(e) => handlePositionChange('x', e.target.value)}
            min="-80"
            max="80"
            step="1"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Y Position</label>
          <input
            type="number"
            value={Math.round(localValues.y)}
            onChange={(e) => handlePositionChange('y', e.target.value)}
            min="-80"
            max="80"
            step="1"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Scale (%)</label>
          <input
            type="number"
            value={Math.round(localValues.scale * 100)}
            onChange={(e) => handleScaleChange(e.target.value / 100)}
            min="30"
            max="200"
            step="5"
            className="w-full px-3 py-2 text-xs font-bold bg-white border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Rotation (°)</label>
          <input
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

      <button
        type="button"
        onClick={resetToDefaults}
        className="w-full px-4 py-2 bg-white border-2 border-purple-100 text-[9px] font-black uppercase tracking-widest text-purple-700 hover:border-purple-500 hover:bg-purple-50 transition-all rounded-lg"
      >
        🔄 Reset to Center
      </button>
    </div>
  );
}
