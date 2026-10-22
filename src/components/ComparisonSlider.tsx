import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Bookmark, Sparkles, Columns2, Sliders, Maximize2, X, RefreshCw, Share2, Crown } from 'lucide-react';
import { downloadImage } from '../utils/imageUtils';

interface ComparisonSliderProps {
  originalImage: string;
  resultImage: string;
  hairStyleName?: string;
  hairColorName?: string;
  outfitName?: string;
  onSaveToLookbook: () => void;
  isSaved?: boolean;
  onOpenShare?: () => void;
  onOpenPricing?: () => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalImage,
  resultImage,
  hairStyleName,
  hairColorName,
  outfitName,
  onSaveToLookbook,
  isSaved = false,
  onOpenShare,
  onOpenPricing,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              Kết Quả Thử Kiểu AI (Trước & Sau)
            </h2>
            <p className="text-xs text-slate-400">
              Kéo thanh trượt để so sánh trực quan
            </p>
          </div>
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('slider')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'slider'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kéo trượt so sánh"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thanh trượt</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'side-by-side'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Xem song song"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Song song</span>
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullScreen(true)}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Phóng to toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Save to Lookbook */}
          <button
            onClick={onSaveToLookbook}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-400' : ''}`} />
            <span>{isSaved ? 'Đã lưu' : 'Lưu Look'}</span>
          </button>

          {/* Download */}
          <button
            onClick={() => downloadImage(resultImage, `ai-makeover-${Date.now()}.png`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-violet-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải ảnh</span>
          </button>

          {/* VIP 4K Upgrade button */}
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shadow-sm"
              title="Xem bảng giá dịch vụ & Nâng cấp 4K không logo"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mở khóa 4K</span>
            </button>
          )}

          {/* Social Share Trigger */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-600/30 transition-all"
              title="Chia sẻ lên Facebook, Instagram hoặc mở Web Share"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Chia sẻ</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Area */}
      {viewMode === 'slider' ? (
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="relative w-full aspect-square max-h-[540px] mx-auto rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-800 shadow-2xl bg-black"
        >
          {/* Result Image (Bottom layer) */}
          <img
            src={resultImage}
            alt="Sau khi biến đổi AI"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Original Image (Top clipped layer) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={originalImage}
              alt="Ảnh gốc trước khi đổi"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
              }}
            />
          </div>

          {/* Floating Labels */}
          <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-slate-200">
            TRƯỚC (GỐC)
          </div>
          <div className="absolute top-3 right-3 pointer-events-none px-2.5 py-1 rounded-lg bg-violet-950/80 backdrop-blur-md border border-violet-500/30 text-[11px] font-semibold text-violet-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            SAU (AI STYLE)
          </div>

          {/* Draggable Divider Line & Knob */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-950 shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-black/40">
              <Sliders className="w-4 h-4 text-violet-700 rotate-90" />
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 aspect-auto max-h-[540px]">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-square bg-black shadow-lg">
            <img
              src={originalImage}
              alt="Ảnh gốc"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200">
              TRƯỚC (GỐC)
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-violet-500/40 aspect-square bg-black shadow-lg">
            <img
              src={resultImage}
              alt="Sau khi biến đổi"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-violet-950/85 backdrop-blur-md border border-violet-500/30 text-xs font-semibold text-violet-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SAU (AI STYLE)
            </div>
          </div>
        </div>
      )}

      {/* Applied specs summary card */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {hairStyleName && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Kiểu tóc:</span>
              <span className="font-semibold text-violet-300">{hairStyleName}</span>
            </div>
          )}
          {hairColorName && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Màu nhuộm:</span>
              <span className="font-semibold text-pink-300">{hairColorName}</span>
            </div>
          )}
          {outfitName && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Trang phục:</span>
              <span className="font-semibold text-fuchsia-300">{outfitName}</span>
            </div>
          )}
        </div>

        <span className="text-[11px] text-slate-500">
          Chất lượng cao HD • Tôn nét chân thực 100%
        </span>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center gap-4">
            <img
              src={resultImage}
              alt="AI Makeover Toàn Màn Hình"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => downloadImage(resultImage)}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30"
              >
                <Download className="w-4 h-4" />
                Tải ảnh chất lượng cao
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
