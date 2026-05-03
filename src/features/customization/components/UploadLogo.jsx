import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import useCustomizationStore from '../store/useCustomizationStore';
import useToastStore from '../../notifications/store/useToastStore';
import { uploadImage } from '../services/cloudinary';
import { cn } from '../../../lib/utils';

/**
 * UploadLogo Component
 * Handles uploading logos to Cloudinary and updating the customization store.
 */

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function UploadLogo() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Store integration
  const activeView = useCustomizationStore((state) => state.activeView);
  const setLogo = useCustomizationStore((state) => state.setLogo);
  const design = useCustomizationStore((state) => state.design);
  const setScale = useCustomizationStore((state) => state.setScale);

  // Toast
  const addToast = useToastStore((state) => state.addToast);

  const currentDesign = activeView !== 'both' ? design[activeView] : null;

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Max size is 5MB (yours: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed: PNG, JPG, WebP, GIF (yours: ${file.type || 'unknown'})`);
    }

    return true;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Validate file
      validateFile(file);

      // Upload to Cloudinary
      const secureUrl = await uploadImage(file);
      
      // Update store - if "both" view, apply to both front AND back
      if (activeView === 'both') {
        setLogo('front', secureUrl);
        setLogo('back', secureUrl);
        addToast('Logo uploaded to both sides!', 'success');
        console.log(`Logo uploaded and set for both sides:`, secureUrl);
      } else {
        setLogo(activeView, secureUrl);
        addToast(`Logo uploaded to ${activeView}!`, 'success');
        console.log(`Logo uploaded and set for ${activeView}:`, secureUrl);
      }
    } catch (err) {
      addToast(err.message, 'error');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      <div className="space-y-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "w-full h-16 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] gap-4 transition-all active:scale-95 shadow-xl relative overflow-hidden",
            isUploading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"
          )}
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              <span>{activeView === 'both' ? 'Upload for Both Sides' : 'Upload Logo'}</span>
            </>
          )}
        </Button>

        {currentDesign?.logo && (
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo Scale</span>
              <span className="text-[10px] font-black text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm">
                {Math.round(currentDesign.scale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.01"
              value={currentDesign.scale}
              onChange={(e) => setScale(activeView, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[8px] font-bold text-gray-300 uppercase">Min</span>
              <span className="text-[8px] font-bold text-gray-300 uppercase">Max</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
