import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, User, RefreshCw, Sparkles, Check, X } from 'lucide-react';
import { SAMPLE_MODELS } from '../data/presets';
import { SampleModel, Gender } from '../types';
import { fileToBase64, resizeImage } from '../utils/imageUtils';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelected: (imageDataUrl: string, detectedGender?: Gender) => void;
  onClearImage: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageSelected,
  onClearImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const rawBase64 = await fileToBase64(file);
      const resized = await resizeImage(rawBase64, 1024, 1024);
      onImageSelected(resized);
    } catch (err) {
      console.error('Lỗi khi đọc file ảnh:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  // Camera start
  const startCamera = async () => {
    setCameraError(null);
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Không thể truy cập camera:', err);
      setCameraError('Không thể mở camera. Vui lòng cấp quyền truy cập hoặc tải ảnh từ máy.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Flip horizontal for natural selfie feel
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const raw = canvas.toDataURL('image/jpeg', 0.95);
      const resized = await resizeImage(raw, 1024, 1024);
      stopCamera();
      onImageSelected(resized);
    }
  };

  const handleSelectSample = (sample: SampleModel) => {
    onImageSelected(sample.imageUrl, sample.gender);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-base font-bold text-slate-100">Ảnh Người Dùng (Gương Mặt / Vóc Dáng)</h2>
        </div>

        {currentImage && (
          <button
            onClick={onClearImage}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-500/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Đổi ảnh</span>
          </button>
        )}
      </div>

      {/* Main Upload / Camera / Preview Area */}
      {!currentImage && !isCameraActive && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? 'border-violet-500 bg-violet-500/10 scale-[0.99]'
              : 'border-slate-700/80 bg-slate-950/40 hover:border-slate-600'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-inner">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">
                Kéo thả ảnh chân dung vào đây hoặc
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Chụp ảnh rõ nét chính diện khuôn mặt để AI ghép tóc & trang phục đẹp nhất
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Tải ảnh từ máy</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Chụp trực tiếp</span>
              </button>
            </div>

            {cameraError && (
              <p className="text-xs text-rose-400 mt-2 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                {cameraError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Live Camera View */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 aspect-square max-h-[380px] mx-auto flex items-center justify-center shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Face Alignment Oval Guide */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[58%] h-[68%] rounded-[50%] border-2 border-dashed border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)] flex items-center justify-center">
              <span className="text-[11px] text-emerald-300 font-medium px-2 py-0.5 bg-slate-950/70 rounded-full backdrop-blur-sm">
                Căn khuôn mặt vào đây
              </span>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
            <button
              onClick={stopCamera}
              className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 backdrop-blur-md border border-slate-700"
              title="Đóng camera"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={capturePhoto}
              className="p-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/40 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs pr-1">Chụp ngay</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview Of Selected Photo */}
      {currentImage && !isCameraActive && (
        <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 group">
          <div className="aspect-square max-h-[280px] mx-auto overflow-hidden flex items-center justify-center">
            <img
              src={currentImage}
              alt="Ảnh gốc người dùng"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[11px] font-medium text-slate-200 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ảnh chân dung đã sẵn sàng</span>
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs backdrop-blur-md border border-slate-700 flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Thay ảnh</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Sample Models Section (Quick 1-Click Try-On) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Hoặc thử nhanh với người mẫu mẫu có sẵn:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => handleSelectSample(model)}
              className="group text-left p-1.5 rounded-xl border border-slate-800 hover:border-violet-500/60 bg-slate-950/60 hover:bg-slate-800/50 transition-all flex items-center gap-2.5"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0 pr-1">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-violet-300">
                  {model.name.split(' (')[0]}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {model.gender === 'female' ? 'Nữ' : 'Nam'} • {model.faceShape}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
