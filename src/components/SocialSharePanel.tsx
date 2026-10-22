import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Instagram,
  Facebook,
  Sparkles,
  Smartphone,
  Download,
  Flame,
  MessageCircle,
  ExternalLink,
  Layers,
  FileImage,
  Image as ImageIcon,
} from 'lucide-react';
import { dataUrlToFile, copyImageToClipboard, generateStoryShareCard, downloadImage, downloadImageAsFormat } from '../utils/imageUtils';

interface SocialSharePanelProps {
  originalImage: string;
  resultImage: string;
  hairStyleName?: string;
  hairColorName?: string;
  outfitName?: string;
}

export const SocialSharePanel: React.FC<SocialSharePanelProps> = ({
  originalImage,
  resultImage,
  hairStyleName,
  hairColorName,
  outfitName,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyCardUrl, setStoryCardUrl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [downloadingFormat, setDownloadingFormat] = useState<'png' | 'jpg' | null>(null);

  // Download look as PNG or JPG
  const handleDownloadFormat = async (format: 'png' | 'jpg') => {
    setDownloadingFormat(format);
    try {
      const cleanHair = (hairStyleName || 'style').toLowerCase().replace(/\s+/g, '-');
      const filename = `ai-makeover-${cleanHair}-${Date.now()}.${format}`;
      await downloadImageAsFormat(resultImage, format, filename);
      setShareStatus(`Đã tải ảnh ${format.toUpperCase()} chất lượng cao thành công!`);
      setTimeout(() => setShareStatus(null), 3500);
    } catch (err) {
      console.error(err);
      setShareStatus('Không thể tải ảnh, vui lòng thử lại.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  // Suggested caption for social media posts
  const shareTitle = 'Diện Mạo Mới Được Tạo Bởi AI Salon ✨';
  const shareCaption = `Vừa thử kiểu tóc "${hairStyleName || 'mới'}" & trang phục "${outfitName || 'thời thượng'}" bằng AI Studio! Bạn thấy hợp không? 💇✨ #AIHairstyle #VirtualTryOn #AISalon #Makeover`;
  const shareUrl = window.location.href;

  // 1. Native Web Share API
  const handleNativeShare = async (useStoryCard = false) => {
    setShareStatus(null);
    try {
      const targetImage = useStoryCard && storyCardUrl ? storyCardUrl : resultImage;
      const file = await dataUrlToFile(targetImage, `ai-makeover-${Date.now()}.png`);

      const nav = navigator as any;
      if (typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
        await nav.share({
          title: shareTitle,
          text: shareCaption,
          files: [file],
        });
        setShareStatus('Đã mở menu chia sẻ thành công!');
      } else if (typeof nav.share === 'function') {
        // Fallback for browsers supporting navigator.share without files
        await nav.share({
          title: shareTitle,
          text: `${shareCaption}\n${shareUrl}`,
          url: shareUrl,
        });
        setShareStatus('Đã chia sẻ thành công!');
      } else {
        // Web share not supported, fallback to copying link
        await handleCopyLink();
        setShareStatus('Trình duyệt chưa hỗ trợ Web Share trực tiếp. Đã sao chép liên kết vào bộ nhớ tạm!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Web Share error:', err);
        setShareStatus('Không thể mở menu chia sẻ. Bạn có thể sao chép liên kết hoặc tải ảnh về!');
      }
    }
  };

  // 2. Share to Facebook
  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareCaption)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  // 3. Instagram Share Helper (Web Share API directly targets Instagram on iOS/Android)
  const handleShareInstagram = async () => {
    const nav = navigator as any;
    if (typeof nav.share === 'function') {
      await handleNativeShare(true);
    } else {
      // Desktop helper: download image and copy caption
      downloadImage(storyCardUrl || resultImage, 'instagram-story-ai-look.png');
      await handleCopyCaption();
      setShareStatus('Đã tải ảnh về và sao chép caption. Hãy mở Instagram và đăng lên Story/Feed nhé!');
    }
  };

  // 4. Generate 9:16 Story Card
  const handleCreateStoryCard = async () => {
    setIsGeneratingStory(true);
    try {
      const card = await generateStoryShareCard({
        originalImage,
        resultImage,
        hairStyleName,
        hairColorName,
        outfitName,
      });
      setStoryCardUrl(card);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // 5. Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.warn('Copy link error', e);
    }
  };

  // 6. Copy Caption
  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(shareCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch (e) {
      console.warn('Copy caption error', e);
    }
  };

  // 7. Copy Image to Clipboard
  const handleCopyImage = async () => {
    const success = await copyImageToClipboard(resultImage);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    } else {
      setShareStatus('Không thể sao chép ảnh trực tiếp (hãy dùng nút Tải ảnh).');
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center text-pink-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              Chia Sẻ Phong Cách (Social Share)
            </h2>
            <p className="text-xs text-slate-400">
              Khoe diện mạo mới lên Facebook, Instagram Stories hoặc gửi bạn bè
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-semibold">
          Web Share API
        </span>
      </div>

      {/* Main One-Click Share Button (Native Web Share) */}
      <button
        onClick={() => handleNativeShare(false)}
        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 hover:from-pink-500 hover:via-fuchsia-500 hover:to-violet-500 text-white shadow-lg shadow-pink-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
      >
        <Share2 className="w-4 h-4" />
        <span>Mở Bảng Chia Sẻ Nhanh (Native Web Share)</span>
      </button>

      {/* High Quality Download (PNG & JPG) */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Download className="w-4 h-4 text-violet-400" />
            <span>Tải Ảnh Chất Lượng Cao (Download HD Look)</span>
          </div>
          <span className="text-[10px] text-slate-400">Chọn định dạng file</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* PNG Button */}
          <button
            type="button"
            onClick={() => handleDownloadFormat('png')}
            disabled={downloadingFormat !== null}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-violet-500/30 hover:border-violet-500 text-left transition-all group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
                <FileImage className="w-3.5 h-3.5 text-violet-400" />
                <span>Tải File PNG</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Lossless • Sắc nét nhất</p>
            </div>
            {downloadingFormat === 'png' ? (
              <span className="text-[10px] text-violet-400 font-semibold animate-pulse">Đang tải...</span>
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors" />
            )}
          </button>

          {/* JPG Button */}
          <button
            type="button"
            onClick={() => handleDownloadFormat('jpg')}
            disabled={downloadingFormat !== null}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-500 text-left transition-all group flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Tải File JPG</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Chuẩn HD 96% • Nhẹ & nhanh</p>
            </div>
            {downloadingFormat === 'jpg' ? (
              <span className="text-[10px] text-amber-400 font-semibold animate-pulse">Đang tải...</span>
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Direct Social Platform Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Facebook */}
        <button
          onClick={handleShareFacebook}
          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Facebook className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Facebook</span>
          <span className="text-[10px] text-slate-500">Đăng bài / Nhóm</span>
        </button>

        {/* Instagram */}
        <button
          onClick={handleShareInstagram}
          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-pink-500/50 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Instagram className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Instagram</span>
          <span className="text-[10px] text-slate-500">Story / Tin 24h</span>
        </button>

        {/* Copy Image */}
        <button
          onClick={handleCopyImage}
          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-violet-500/50 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {copiedImage ? 'Đã sao chép' : 'Chép ảnh'}
          </span>
          <span className="text-[10px] text-slate-500">Dán vào Chat / Zalo</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {copiedLink ? 'Đã chép link' : 'Sao chép link'}
          </span>
          <span className="text-[10px] text-slate-500">Gửi bạn bè</span>
        </button>
      </div>

      {/* Instagram & Facebook Story Card Generator (9:16 layout) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/30 via-slate-950 to-pink-950/30 border border-purple-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-200">
              Thẻ Story 9:16 So Sánh Trước & Sau
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Chuẩn khung hình Story / Reel / TikTok</span>
        </div>

        {storyCardUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-20 h-36 rounded-lg overflow-hidden border border-purple-500/50 shrink-0 bg-black shadow-md">
              <img
                src={storyCardUrl}
                alt="Story Card Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 flex-1 text-xs">
              <p className="text-slate-300">
                Thẻ ảnh 9:16 đã sẵn sàng với layout Trước & Sau và thẻ kiểu dáng!
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => downloadImage(storyCardUrl, `story-makeover-${Date.now()}.png`)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh Story</span>
                </button>

                <button
                  onClick={() => handleNativeShare(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Chia sẻ Thẻ Story</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-400">
              Ghép ảnh gốc + ảnh mới kèm tên kiểu tóc thành 1 ảnh dọc 9:16 bắt mắt để đăng Story Instagram / Facebook
            </p>
            <button
              onClick={handleCreateStoryCard}
              disabled={isGeneratingStory}
              className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingStory ? 'Đang tạo...' : 'Tạo Thẻ Story'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Caption Preview & 1-Click Copy */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Gợi ý Caption đăng bài:</span>
          <button
            onClick={handleCopyCaption}
            className="text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
          >
            {copiedCaption ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Chép Caption</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-300 italic line-clamp-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
          "{shareCaption}"
        </p>
      </div>

      {/* Share feedback status message */}
      {shareStatus && (
        <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center">
          {shareStatus}
        </p>
      )}
    </div>
  );
};
