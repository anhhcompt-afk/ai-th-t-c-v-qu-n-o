import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Columns2,
  Sliders,
  Trophy,
  Check,
  Download,
  Share2,
  Sparkles,
  ArrowLeftRight,
  Maximize2,
  X,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { GeneratedLook } from '../types';
import {
  generateDualLookComparisonCard,
  downloadImage,
  dataUrlToFile,
} from '../utils/imageUtils';

interface DualLookComparisonProps {
  currentLook: GeneratedLook;
  allLooks: GeneratedLook[];
  onSelectActiveLook: (look: GeneratedLook) => void;
  onRequestNewHairstyle?: () => void;
}

export const DualLookComparison: React.FC<DualLookComparisonProps> = ({
  currentLook,
  allLooks,
  onSelectActiveLook,
  onRequestNewHairstyle,
}) => {
  // Ensure we have at least 2 looks to compare
  const availableLooks = allLooks.length > 0 ? allLooks : [currentLook];

  const [lookAId, setLookAId] = useState<string>(currentLook.id);
  const [lookBId, setLookBId] = useState<string>(
    availableLooks.find((l) => l.id !== currentLook.id)?.id || currentLook.id
  );

  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [winnerLookId, setWinnerLookId] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync lookA when currentLook changes
  useEffect(() => {
    if (currentLook.id) {
      setLookAId(currentLook.id);
      // If B is same as A and there is another look, select another
      const other = availableLooks.find((l) => l.id !== currentLook.id);
      if (other && lookBId === currentLook.id) {
        setLookBId(other.id);
      }
    }
  }, [currentLook.id, availableLooks]);

  const lookA = availableLooks.find((l) => l.id === lookAId) || currentLook;
  const lookB = availableLooks.find((l) => l.id === lookBId) || currentLook;

  // Swap Look A and Look B
  const handleSwap = () => {
    const temp = lookAId;
    setLookAId(lookBId);
    setLookBId(temp);
  };

  // Slider drag events
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

  // Export comparison card
  const handleDownloadComparisonCard = async () => {
    setIsGeneratingCard(true);
    try {
      const card = await generateDualLookComparisonCard({
        lookAImage: lookA.resultImage,
        lookBImage: lookB.resultImage,
        lookAName: lookA.hairStyleName || 'Kiểu A',
        lookBName: lookB.hairStyleName || 'Kiểu B',
        lookAColor: lookA.hairColorName,
        lookBColor: lookB.hairColorName,
      });
      downloadImage(card, `so-sanh-kieu-toc-${Date.now()}.png`);
      setShareStatus('Đã tải thẻ so sánh A vs B về máy!');
      setTimeout(() => setShareStatus(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  // Share comparison to friends for poll
  const handleSharePoll = async () => {
    setIsGeneratingCard(true);
    try {
      const card = await generateDualLookComparisonCard({
        lookAImage: lookA.resultImage,
        lookBImage: lookB.resultImage,
        lookAName: lookA.hairStyleName || 'Kiểu A',
        lookBName: lookB.hairStyleName || 'Kiểu B',
        lookAColor: lookA.hairColorName,
        lookBColor: lookB.hairColorName,
      });

      const file = await dataUrlToFile(card, 'so-sanh-kieu-toc.png');
      const shareTitle = 'Bình chọn giúp mình kiểu tóc đẹp hơn!';
      const shareText = `Mình đang phân vân giữa 2 kiểu tóc:\n- Kiểu A: ${lookA.hairStyleName || 'Kiểu A'}\n- Kiểu B: ${lookB.hairStyleName || 'Kiểu B'}\nMọi người xem ảnh và chấm giúp mình kiểu nào hợp hơn nhé! ✨`;

      const nav = navigator as any;
      if (typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
        await nav.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        });
        setShareStatus('Đã mở bảng chia sẻ khảo sát!');
      } else if (typeof nav.share === 'function') {
        await nav.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href,
        });
        setShareStatus('Đã chia sẻ thành công!');
      } else {
        // Fallback: download card and copy text
        downloadImage(card, 'so-sanh-kieu-toc.png');
        await navigator.clipboard.writeText(shareText);
        setShareStatus('Đã tải ảnh so sánh & chép tin nhắn khảo sát vào bộ nhớ tạm!');
      }
      setTimeout(() => setShareStatus(null), 4000);
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error(e);
      }
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center text-violet-400">
              <Columns2 className="w-4 h-4 text-pink-300" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              So Sánh 2 Kiểu Tóc (Split-Screen Look A vs Look B)
            </h2>
            <p className="text-xs text-slate-400">
              Đặt 2 phong cách khác nhau cạnh nhau để chọn ra kiểu tóc ưng ý nhất
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'side-by-side'
                  ? 'bg-violet-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Chia Đôi Màn Hình</span>
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'slider'
                  ? 'bg-violet-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Thanh Trượt A/B</span>
            </button>
          </div>

          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Đổi chỗ Kiểu A và Kiểu B"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Look Selectors (Dropdown / Selector Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs">
        {/* Selector A */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-violet-400 shrink-0">Kiểu A:</span>
          <select
            value={lookAId}
            onChange={(e) => setLookAId(e.target.value)}
            className="w-full bg-slate-900 border border-violet-500/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-400"
          >
            {availableLooks.map((look, idx) => (
              <option key={look.id} value={look.id}>
                Look #{idx + 1}: {look.hairStyleName || 'Kiểu tóc AI'}{' '}
                {look.hairColorName ? `(${look.hairColorName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-pink-400 shrink-0">Kiểu B:</span>
          <select
            value={lookBId}
            onChange={(e) => setLookBId(e.target.value)}
            className="w-full bg-slate-900 border border-pink-500/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-pink-400"
          >
            {availableLooks.map((look, idx) => (
              <option key={look.id} value={look.id}>
                Look #{idx + 1}: {look.hairStyleName || 'Kiểu tóc AI'}{' '}
                {look.hairColorName ? `(${look.hairColorName})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notice if only 1 look exists */}
      {availableLooks.length < 2 && (
        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs flex items-center justify-between gap-2">
          <span>
            💡 Mẹo: Hãy thử thêm một kiểu tóc hoặc màu nhuộm khác ở Bước 2 để có 2 diện mạo khác biệt so sánh cùng lúc!
          </span>
          {onRequestNewHairstyle && (
            <button
              onClick={onRequestNewHairstyle}
              className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[11px] shrink-0"
            >
              Chọn kiểu mới
            </button>
          )}
        </div>
      )}

      {/* Main Split Screen Comparison Display */}
      {viewMode === 'side-by-side' ? (
        /* SIDE BY SIDE 50/50 MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 aspect-auto">
          {/* LOOK A CARD */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-violet-500/50 bg-black aspect-square shadow-xl group">
            <img
              src={lookA.resultImage}
              alt={lookA.hairStyleName || 'Kiểu A'}
              className="w-full h-full object-cover"
            />

            {/* Floating Badge A */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-violet-950/85 backdrop-blur-md border border-violet-500/40 text-xs font-bold text-violet-200 shadow-md">
              KIỂU A: {lookA.hairStyleName || 'Kiểu tóc A'}
            </div>

            {lookA.hairColorName && (
              <div className="absolute bottom-14 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-medium text-pink-300">
                Màu: {lookA.hairColorName}
              </div>
            )}

            {/* Winner Pick Button A */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setWinnerLookId(lookA.id);
                  onSelectActiveLook(lookA);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg ${
                  winnerLookId === lookA.id
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-900/90 hover:bg-violet-600 text-white border border-violet-400/30'
                }`}
              >
                <Trophy className={`w-3.5 h-3.5 ${winnerLookId === lookA.id ? 'fill-slate-950' : 'text-amber-400'}`} />
                <span>{winnerLookId === lookA.id ? 'Đã Chọn Là Kiểu Thích Nhất! 🏆' : 'Chọn Kiểu A Này'}</span>
              </button>
            </div>
          </div>

          {/* LOOK B CARD */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/50 bg-black aspect-square shadow-xl group">
            <img
              src={lookB.resultImage}
              alt={lookB.hairStyleName || 'Kiểu B'}
              className="w-full h-full object-cover"
            />

            {/* Floating Badge B */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-pink-950/85 backdrop-blur-md border border-pink-500/40 text-xs font-bold text-pink-200 shadow-md">
              KIỂU B: {lookB.hairStyleName || 'Kiểu tóc B'}
            </div>

            {lookB.hairColorName && (
              <div className="absolute bottom-14 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-medium text-pink-300">
                Màu: {lookB.hairColorName}
              </div>
            )}

            {/* Winner Pick Button B */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setWinnerLookId(lookB.id);
                  onSelectActiveLook(lookB);
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg ${
                  winnerLookId === lookB.id
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-slate-900/90 hover:bg-pink-600 text-white border border-pink-400/30'
                }`}
              >
                <Trophy className={`w-3.5 h-3.5 ${winnerLookId === lookB.id ? 'fill-slate-950' : 'text-amber-400'}`} />
                <span>{winnerLookId === lookB.id ? 'Đã Chọn Là Kiểu Thích Nhất! 🏆' : 'Chọn Kiểu B Này'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE SPLIT SLIDER BETWEEN LOOK A AND LOOK B */
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="relative w-full aspect-square max-h-[520px] mx-auto rounded-2xl overflow-hidden select-none cursor-ew-resize border-2 border-violet-500/40 shadow-2xl bg-black"
        >
          {/* Look B (Bottom Layer) */}
          <img
            src={lookB.resultImage}
            alt="Kiểu B"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Look A (Top Layer Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={lookA.resultImage}
              alt="Kiểu A"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
              }}
            />
          </div>

          {/* Floating Labels */}
          <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-lg bg-violet-950/85 backdrop-blur-md border border-violet-500/40 text-[11px] font-bold text-violet-200">
            KIỂU A: {lookA.hairStyleName || 'Kiểu A'}
          </div>
          <div className="absolute top-3 right-3 pointer-events-none px-2.5 py-1 rounded-lg bg-pink-950/85 backdrop-blur-md border border-pink-500/40 text-[11px] font-bold text-pink-200">
            KIỂU B: {lookB.hairStyleName || 'Kiểu B'}
          </div>

          {/* Divider and Knob */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-black/40">
              <Sliders className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      )}

      {/* Decision Summary & Export Action Bar */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          {winnerLookId ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
              <Trophy className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>
                Kiểu thắng cuộc: {winnerLookId === lookA.id ? lookA.hairStyleName : lookB.hairStyleName}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic">
              Bấm nút "Chọn Kiểu" bên dưới mỗi ảnh để lưu lại lựa chọn của bạn
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Download Comparison Card */}
          <button
            onClick={handleDownloadComparisonCard}
            disabled={isGeneratingCard}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>{isGeneratingCard ? 'Đang tạo ảnh...' : 'Tải Thẻ So Sánh A vs B'}</span>
          </button>

          {/* Share Poll to Friends */}
          <button
            onClick={handleSharePoll}
            disabled={isGeneratingCard}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-600/25 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Hỏi Ý Kiến Bạn Bè (Web Share)</span>
          </button>
        </div>
      </div>

      {shareStatus && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center">
          {shareStatus}
        </p>
      )}
    </div>
  );
};
