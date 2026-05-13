import { useState, useRef, useCallback } from 'react';
import useCustomizationStore from '../store/useCustomizationStore';
import useToastStore from '../../notifications/store/useToastStore';
import { uploadImage, isCloudinaryConfigured } from '../services/cloudinary';
import { cn } from '../../../lib/utils';
import { UPLOAD_LIMITS, DPI_REQUIREMENTS, getZoneById } from '../customization.types';

/**
 * UploadLogo Component
 * Handles uploading logos via button click or drag-and-drop.
 * Includes DPI validation that warns users if their image is too low-resolution
 * for the selected placement zone's print area.
 */

const { MAX_SIZE, ALLOWED_TYPES } = UPLOAD_LIMITS;

export default function UploadLogo() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadTarget, setUploadTarget] = useState('front'); // Used when activeView === 'both'
  const [dpiWarning, setDpiWarning] = useState(null); // DPI warning message or null
  const fileInputRef = useRef(null);

  // Store integration
  const activeView = useCustomizationStore((state) => state.activeView);
  const setLogo = useCustomizationStore((state) => state.setLogo);
  const design = useCustomizationStore((state) => state.design);
  const placementZones = useCustomizationStore((state) => state.placementZones);
  const setScale = useCustomizationStore((state) => state.setScale);
  const saveToHistory = useCustomizationStore((state) => state.saveToHistory);

  // Toast
  const addToast = useToastStore((state) => state.addToast);

  // Determine which side we're uploading to
  const effectiveView = activeView === 'both' ? uploadTarget : activeView;
  const currentDesign = design[effectiveView];

  /**
   * Check if the image has sufficient resolution for the active zone's print size.
   * Returns a warning message if DPI is too low, null if acceptable.
   */
  const checkDPI = useCallback((imageWidth, imageHeight) => {
    const zoneId = placementZones[effectiveView];
    if (!zoneId) return null; // No zone selected, skip check

    const zonePrintSize = DPI_REQUIREMENTS.ZONE_PRINT_SIZES[zoneId];
    if (!zonePrintSize) return null;

    // Calculate effective DPI for this zone's print size
    const dpiX = imageWidth / zonePrintSize.width;
    const dpiY = imageHeight / zonePrintSize.height;
    const effectiveDPI = Math.min(dpiX, dpiY);

    if (effectiveDPI < DPI_REQUIREMENTS.MIN_ACCEPTABLE) {
      const requiredWidth = zonePrintSize.width * DPI_REQUIREMENTS.MIN_ACCEPTABLE;
      const requiredHeight = zonePrintSize.height * DPI_REQUIREMENTS.MIN_ACCEPTABLE;
      return {
        level: 'error',
        dpi: Math.round(effectiveDPI),
        message: `Low resolution! Your image is ${imageWidth}×${imageHeight}px (${Math.round(effectiveDPI)} DPI). For "${getZoneById(zoneId)?.label}" you need at least ${requiredWidth}×${requiredHeight}px (150 DPI) for acceptable print quality.`,
      };
    }

    if (effectiveDPI < DPI_REQUIREMENTS.RECOMMENDED) {
      return {
        level: 'warning',
        dpi: Math.round(effectiveDPI),
        message: `Your image (${Math.round(effectiveDPI)} DPI) is acceptable but below the recommended 300 DPI for crisp printing. Consider using a higher resolution image.`,
      };
    }

    return null; // Good to go
  }, [effectiveView, placementZones]);

  const validateFile = (file) => {
    if (file.size > MAX_SIZE) {
      throw new Error(`File too large. Max size is 5MB (yours: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed: PNG, JPG, WebP, GIF (yours: ${file.type || 'unknown'})`);
    }
    return true;
  };

  const fileToDataUrl = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const applyLogo = useCallback((url) => {
    saveToHistory(); // Capture state before logo change for undo
    setLogo(effectiveView, url);
    setDpiWarning(null); // Clear any previous warning

    // Check DPI by loading the image to get its natural dimensions
    const img = new Image();
    img.onload = () => {
      const warning = checkDPI(img.naturalWidth, img.naturalHeight);
      if (warning) {
        setDpiWarning(warning);
        if (warning.level === 'error') {
          addToast(`⚠️ Low resolution image (${warning.dpi} DPI) — may look pixelated when printed`, 'warning');
        }
      }
    };
    img.src = url;

    addToast(`Logo uploaded to ${effectiveView}!`, 'success');
  }, [effectiveView, setLogo, addToast, saveToHistory, checkDPI]);

  const processFile = useCallback(async (file) => {
    if (!file) return;

    setIsUploading(true);

    try {
      validateFile(file);

      if (isCloudinaryConfigured) {
        try {
          const secureUrl = await uploadImage(file);
          applyLogo(secureUrl);
        } catch (cloudErr) {
          console.warn('Cloudinary upload failed, using local fallback:', cloudErr.message);
          const localUrl = await fileToDataUrl(file);
          applyLogo(localUrl);
          addToast('Using local preview (cloud upload unavailable)', 'warning');
        }
      } else {
        // No Cloudinary configured — use local data URL directly
        const localUrl = await fileToDataUrl(file);
        applyLogo(localUrl);
      }
    } catch (err) {
      addToast(err.message, 'error');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [applyLogo, addToast, fileToDataUrl]);

  const handleFileUpload = (e) => {
    processFile(e.target.files[0]);
  };

  // Drag-and-drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div className="w-full space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".png,.jpg,.jpeg,.webp,.gif"
        className="hidden"
        disabled={isUploading}
      />

      <div className="space-y-4">
        {/* Side selector when in "both" view */}
        {activeView === 'both' && (
          <div className="flex gap-2 p-1.5 bg-obsidian-50 rounded-xl">
            {['front', 'back'].map((side) => (
              <button
                key={side}
                onClick={() => setUploadTarget(side)}
                className={cn(
                  "flex-1 px-3 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                  uploadTarget === side
                    ? "bg-obsidian-900 text-gold-400 shadow-md"
                    : "bg-transparent text-obsidian-500 hover:text-obsidian-900 hover:bg-white"
                )}
              >
                {side}
              </button>
            ))}
          </div>
        )}

        {/* Drag-and-drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden",
            isDragOver
              ? "border-gold-500 bg-gold-50 scale-[1.02]"
              : "border-obsidian-200 hover:border-obsidian-400 bg-obsidian-50/50",
            isUploading && "pointer-events-none opacity-70"
          )}
        >
          <div className="flex flex-col items-center justify-center py-8 px-4 gap-3">
            {isUploading ? (
              <>
                <div className="w-8 h-8 border-3 border-obsidian-200 border-t-obsidian-900 rounded-full animate-spin" />
                <span className="text-xs font-black text-obsidian-600 uppercase tracking-widest">Uploading...</span>
              </>
            ) : isDragOver ? (
              <>
                <span className="text-2xl">📥</span>
                <span className="text-xs font-black text-gold-700 uppercase tracking-widest">Drop to Upload</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-obsidian-500">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                <span className="text-xs font-black text-obsidian-700 uppercase tracking-widest">
                  Upload to {effectiveView}
                </span>
                <span className="text-[10px] text-obsidian-500 font-medium">
                  Drag & drop or click to browse
                </span>
              </>
            )}
          </div>
        </div>

        {/* File requirements hint */}
        <p className="text-[10px] text-obsidian-500 text-center tracking-wide">
          PNG, JPG, WebP or GIF — Max 5MB — Use high-res for best print quality
        </p>

        {/* DPI Warning Banner */}
        {dpiWarning && (
          <div className={cn(
            "p-4 rounded-2xl border animate-in fade-in slide-in-from-bottom-2",
            dpiWarning.level === 'error'
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          )}>
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">
                {dpiWarning.level === 'error' ? '🚫' : '⚠️'}
              </span>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-widest mb-1",
                  dpiWarning.level === 'error' ? "text-red-700" : "text-amber-700"
                )}>
                  {dpiWarning.level === 'error' ? 'Resolution Too Low' : 'Resolution Advisory'}
                </p>
                <p className={cn(
                  "text-[10px] leading-relaxed font-medium",
                  dpiWarning.level === 'error' ? "text-red-600" : "text-amber-600"
                )}>
                  {dpiWarning.message}
                </p>
              </div>
              <button
                onClick={() => setDpiWarning(null)}
                className="text-obsidian-400 hover:text-obsidian-600 flex-shrink-0"
                aria-label="Dismiss warning"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
