/**
 * Image processing utilities for AI Stylist & Virtual Try-On
 */

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const resizeImage = (dataUrl: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
  });
};

export const downloadImage = (dataUrl: string, filename = 'ai-tryon-look.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download image specifically converted to high-quality JPG or PNG
 */
export const downloadImageAsFormat = async (
  dataUrl: string,
  format: 'png' | 'jpg',
  customFilename?: string
): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        downloadImage(dataUrl, customFilename || `ai-makeover.${format}`);
        return resolve();
      }

      if (format === 'jpg') {
        // High quality JPEG with crisp background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.96);
        const filename = customFilename || `ai-makeover-${Date.now()}.jpg`;
        downloadImage(jpgDataUrl, filename);
      } else {
        // Crisp lossless PNG
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL('image/png');
        const filename = customFilename || `ai-makeover-${Date.now()}.png`;
        downloadImage(pngDataUrl, filename);
      }
      resolve();
    };
    img.onerror = () => {
      downloadImage(dataUrl, customFilename || `ai-makeover-${Date.now()}.${format}`);
      resolve();
    };
    img.src = dataUrl;
  });
};

/**
 * Intelligent Canvas Simulation Fallback
 * Creates an artistic simulation if the backend is offline or quota is exceeded
 */
export const generateSimulatedMakeover = async (
  originalImageUrl: string,
  options: {
    mode: 'hair' | 'outfit' | 'both';
    hairStyleName?: string;
    hairColorHex?: string;
    hairColorName?: string;
    outfitName?: string;
    outfitColors?: string;
  }
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalImageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.width || 600;
      const h = img.height || 600;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(originalImageUrl);

      // Draw original image
      ctx.drawImage(img, 0, 0, w, h);

      // 1. Hair styling simulation layer
      if (options.mode === 'hair' || options.mode === 'both') {
        const hairColor = options.hairColorHex || '#8D929A';
        // Add hair zone glow/tint (top region of portrait)
        const hairGrad = ctx.createRadialGradient(w * 0.5, h * 0.28, w * 0.1, w * 0.5, h * 0.28, w * 0.45);
        hairGrad.addColorStop(0, 'transparent');
        hairGrad.addColorStop(0.5, `${hairColor}44`);
        hairGrad.addColorStop(1, `${hairColor}88`);

        ctx.save();
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = hairGrad;
        ctx.fillRect(0, 0, w, h * 0.65);

        // Add soft highlights
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = hairColor;
        ctx.fillRect(0, 0, w, h * 0.55);
        ctx.restore();
      }

      // 2. Outfit styling simulation layer
      if (options.mode === 'outfit' || options.mode === 'both') {
        ctx.save();
        // Lower body area (outfit)
        const outfitGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
        outfitGrad.addColorStop(0, 'rgba(0,0,0,0)');
        outfitGrad.addColorStop(0.3, 'rgba(20, 25, 35, 0.35)');
        outfitGrad.addColorStop(1, 'rgba(20, 25, 35, 0.7)');

        ctx.fillStyle = outfitGrad;
        ctx.fillRect(0, h * 0.62, w, h * 0.38);
        ctx.restore();
      }

      // Elegant watermark label
      ctx.save();
      const bannerHeight = 44;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(16, h - bannerHeight - 16, w - 32, bannerHeight);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(16, h - bannerHeight - 16, w - 32, bannerHeight);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px system-ui, sans-serif';
      let title = '✨ AI STUDIO SIMULATION';
      if (options.hairStyleName) title += ` • Tóc: ${options.hairStyleName}`;
      if (options.outfitName) title += ` • Trang phục: ${options.outfitName}`;
      ctx.fillText(title, 32, h - bannerHeight + 11);
      ctx.restore();

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(originalImageUrl);
  });
};

/**
 * Convert dataURL to File object for Web Share API
 */
export const dataUrlToFile = async (dataUrl: string, filename = 'ai-makeover-look.png'): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/png' });
};

/**
 * Copy image to clipboard for quick pasting to chat / social media
 */
export const copyImageToClipboard = async (dataUrl: string): Promise<boolean> => {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    // Clipboard item requires image/png
    if (navigator.clipboard && (window as any).ClipboardItem) {
      const item = new ClipboardItem({ [blob.type || 'image/png']: blob });
      await navigator.clipboard.write([item]);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Clipboard write error:', err);
    return false;
  }
};

/**
 * Generate a vertical 9:16 Instagram / Facebook Story card
 */
export const generateStoryShareCard = async (options: {
  originalImage: string;
  resultImage: string;
  hairStyleName?: string;
  hairColorName?: string;
  outfitName?: string;
}): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(options.resultImage);

    // Deep luxury dark gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#131124');
    bgGrad.addColorStop(1, '#0b0c10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Header branding
    ctx.fillStyle = '#A78BFA';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HAIR & STYLE AI STUDIO', 540, 130);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 52px system-ui, sans-serif';
    ctx.fillText('✨ MY AI MAKEOVER LOOK ✨', 540, 205);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '30px system-ui, sans-serif';
    ctx.fillText('Thử kiểu tóc & trang phục ảo bằng AI', 540, 260);

    // Load both images
    const imgBefore = new Image();
    const imgAfter = new Image();
    imgBefore.crossOrigin = 'anonymous';
    imgAfter.crossOrigin = 'anonymous';

    let loaded = 0;
    const onBothLoaded = () => {
      loaded++;
      if (loaded < 2) return;

      // Draw Before Box (Top half)
      const boxW = 880;
      const boxH = 580;
      const x = 100;
      const yBefore = 330;
      const yAfter = 970;

      // Card 1: Before
      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.roundRect(x, yBefore, boxW, boxH, 32);
      ctx.fill();
      ctx.clip();
      ctx.drawImage(imgBefore, x, yBefore, boxW, boxH);
      ctx.restore();

      // Before Label Tag
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.roundRect(x + 24, yBefore + 24, 200, 56, 16);
      ctx.fill();
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BEFORE (GỐC)', x + 124, yBefore + 61);

      // Card 2: After
      ctx.save();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.roundRect(x, yAfter, boxW, boxH, 32);
      ctx.fill();
      ctx.clip();
      ctx.drawImage(imgAfter, x, yAfter, boxW, boxH);
      ctx.restore();

      // Glowing border around After
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(x, yAfter, boxW, boxH, 32);
      ctx.stroke();

      // After Label Tag
      ctx.fillStyle = 'rgba(124, 58, 237, 0.85)';
      ctx.beginPath();
      ctx.roundRect(x + 24, yAfter + 24, 230, 56, 16);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ AFTER (AI STYLE)', x + 139, yAfter + 61);

      // Metadata Info Footer Box
      const yInfo = 1600;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(x, yInfo, boxW, 190, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'left';
      let textY = yInfo + 55;

      if (options.hairStyleName) {
        ctx.fillStyle = '#C084FC';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillText('💇 Kiểu tóc: ', x + 36, textY);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(options.hairStyleName, x + 200, textY);
        textY += 46;
      }

      if (options.hairColorName) {
        ctx.fillStyle = '#F472B6';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillText('🎨 Màu nhuộm: ', x + 36, textY);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(options.hairColorName, x + 245, textY);
        textY += 46;
      }

      if (options.outfitName) {
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.fillText('👗 Trang phục: ', x + 36, textY);
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(options.outfitName, x + 240, textY);
      }

      // Hashtag footer
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748B';
      ctx.font = '26px system-ui, sans-serif';
      ctx.fillText('#AIHairstyle #VirtualTryOn #AISalon #FashionMakeover', 540, 1850);

      resolve(canvas.toDataURL('image/png'));
    };

    imgBefore.onload = onBothLoaded;
    imgAfter.onload = onBothLoaded;
    imgBefore.onerror = () => resolve(options.resultImage);
    imgAfter.onerror = () => resolve(options.resultImage);

    imgBefore.src = options.originalImage;
    imgAfter.src = options.resultImage;
  });
};

/**
 * Generate a side-by-side comparison card between two generated looks (Look A vs Look B)
 */
export const generateDualLookComparisonCard = async (options: {
  lookAImage: string;
  lookBImage: string;
  lookAName: string;
  lookBName: string;
  lookAColor?: string;
  lookBColor?: string;
}): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve(options.lookAImage);

    // Dark sleek background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 760);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#131124');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 760);

    // Top Title
    ctx.fillStyle = '#A78BFA';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HAIR & STYLE AI STUDIO • BÌNH CHỌN KIỂU TÓC ĐẸP NHẤT', 600, 48);

    const imgA = new Image();
    const imgB = new Image();
    imgA.crossOrigin = 'anonymous';
    imgB.crossOrigin = 'anonymous';

    let loaded = 0;
    const onBothLoaded = () => {
      loaded++;
      if (loaded < 2) return;

      const cardW = 500;
      const cardH = 500;
      const y = 80;
      const xA = 60;
      const xB = 640;

      // Draw Look A
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(xA, y, cardW, cardH, 24);
      ctx.fill();
      ctx.clip();
      ctx.drawImage(imgA, xA, y, cardW, cardH);
      ctx.restore();

      // Border A
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(xA, y, cardW, cardH, 24);
      ctx.stroke();

      // Draw Look B
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(xB, y, cardW, cardH, 24);
      ctx.fill();
      ctx.clip();
      ctx.drawImage(imgB, xB, y, cardW, cardH);
      ctx.restore();

      // Border B
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(xB, y, cardW, cardH, 24);
      ctx.stroke();

      // Center VS Circle
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(600, y + cardH / 2, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VS', 600, y + cardH / 2 + 8);

      // Label A Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(xA, 600, cardW, 110, 18);
      ctx.fill();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#C084FC';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('KIỂU A: ' + options.lookAName, xA + 20, 640);
      if (options.lookAColor) {
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillText('Màu nhuộm: ' + options.lookAColor, xA + 20, 678);
      }

      // Label B Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(xB, 600, cardW, 110, 18);
      ctx.fill();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#F472B6';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText('KIỂU B: ' + options.lookBName, xB + 20, 640);
      if (options.lookBColor) {
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillText('Màu nhuộm: ' + options.lookBColor, xB + 20, 678);
      }

      // Bottom footer
      ctx.textAlign = 'center';
      ctx.fillStyle = '#64748B';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Tạo bởi Hair & Style AI Studio • Bạn chọn Kiểu A hay Kiểu B?', 600, 742);

      resolve(canvas.toDataURL('image/png'));
    };

    imgA.onload = onBothLoaded;
    imgB.onload = onBothLoaded;
    imgA.onerror = () => resolve(options.lookAImage);
    imgB.onerror = () => resolve(options.lookAImage);

    imgA.src = options.lookAImage;
    imgB.src = options.lookBImage;
  });
};

