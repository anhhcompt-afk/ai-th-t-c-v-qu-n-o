import React, { useState } from 'react';
import { X, Sparkles, User, Palette, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { FaceAnalysisResult, HairStylePreset, HairColorPreset } from '../types';
import { HAIR_STYLES, HAIR_COLORS } from '../data/presets';

interface FaceAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userImage: string | null;
  analysisResult: FaceAnalysisResult | null;
  onRunAnalysis: () => void;
  isLoading: boolean;
  error: string | null;
  onApplyRecommendation: (style: HairStylePreset, color: HairColorPreset) => void;
}

export const FaceAnalysisModal: React.FC<FaceAnalysisModalProps> = ({
  isOpen,
  onClose,
  userImage,
  analysisResult,
  onRunAnalysis,
  isLoading,
  error,
  onApplyRecommendation,
}) => {
  if (!isOpen) return null;

  const handleApplyHair = (recName: string, colorHex: string) => {
    // Find matching preset or closest
    const foundStyle = HAIR_STYLES.find(
      (s) => s.name.toLowerCase().includes(recName.toLowerCase().split(' ')[0]) ||
             recName.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
    ) || HAIR_STYLES[0];

    const foundColor = HAIR_COLORS.find(
      (c) => c.hex.toLowerCase() === colorHex.toLowerCase() ||
             recName.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
    ) || HAIR_COLORS[2];

    onApplyRecommendation(foundStyle, foundColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              AI Stylist Tư Vấn Khuôn Mặt & Dáng Người
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Phân tích tỷ lệ gương mặt, tone da và gợi ý phong cách tôn vinh bạn nhất
            </p>
          </div>
        </div>

        {/* No User Image Warning */}
        {!userImage && (
          <div className="p-6 text-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60">
            <User className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              Vui lòng chọn hoặc tải ảnh chân dung trước
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              AI cần thấy rõ gương mặt để nhận diện dáng mặt và sắc tố da
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Quay lại chọn ảnh
            </button>
          </div>
        )}

        {/* Image Ready - Trigger Scan */}
        {userImage && !analysisResult && !isLoading && (
          <div className="text-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-emerald-500/40 relative shadow-xl">
              <img
                src={userImage}
                alt="Chân dung"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              Sẵn sàng phân tích chân dung với Gemini 3.8
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
              Hệ thống sẽ quét đường nét xương hàm, khoảng cách mắt trán, sắc tố da để đưa ra bộ quy tắc phối kiểu tóc và trang phục cá nhân hóa.
            </p>

            <button
              onClick={onRunAnalysis}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2 mx-auto transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Bắt đầu quét dáng mặt ngay</span>
            </button>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Loading State with Scanner animation */}
        {isLoading && (
          <div className="text-center py-12 px-4 space-y-4">
            <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl">
              {userImage && (
                <img
                  src={userImage}
                  alt="Scanning"
                  className="w-full h-full object-cover opacity-60"
                />
              )}
              {/* Laser scan line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce" />
            </div>

            <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI đang nhận diện dáng mặt và sắc tố da...</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Đang tính toán tỷ lệ vàng khuôn mặt và tra cứu các kiểu tóc thời thượng phù hợp nhất
            </p>
          </div>
        )}

        {/* Analysis Result Display */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Face Shape */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                  Dáng khuôn mặt
                </span>
                <h4 className="text-base font-bold text-white mt-1 mb-1">
                  {analysisResult.faceShape}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.faceShapeDesc}
                </p>
              </div>

              {/* Skin Tone */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/40 to-slate-950 border border-teal-500/30">
                <span className="text-[11px] font-bold tracking-wider uppercase text-teal-400">
                  Sắc tố da (Undertone)
                </span>
                <h4 className="text-base font-bold text-white mt-1 mb-1">
                  {analysisResult.skinUndertone}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.skinToneDesc}
                </p>
              </div>
            </div>

            {/* Stylist Overall Verdict */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Lời khuyên tổng thể từ Stylist:
              </span>
              <p className="italic">{analysisResult.overallVerdict}</p>
            </div>

            {/* Recommended Hairstyles */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Kiểu Tóc Tôn Dáng Mặt Nhất Dành Cho Bạn:
              </h4>

              <div className="space-y-2.5">
                {analysisResult.hairRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">
                          {rec.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {rec.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">
                        {rec.reason}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <span className="text-slate-400">Màu gợi ý:</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: rec.hex || '#6D3D22' }}
                        />
                        <span className="font-medium text-pink-300">{rec.colorSuggestion}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyHair(rec.name, rec.hex)}
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <span>Thử kiểu này</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Outfits */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-400" />
                Phong Cách Trang Phục Gợi Ý:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.outfitRecommendations.map((outfit, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="font-bold text-white text-xs">
                      {outfit.style}
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      {outfit.pieces}
                    </p>
                    <div className="text-[11px] text-teal-300 font-medium">
                      💡 Mẹo tôn dáng: {outfit.fitTip}
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <span className="text-[10px] text-slate-500">Bảng màu:</span>
                      {outfit.colorPalette?.map((c, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={onRunAnalysis}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Quét lại
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-600/25"
              >
                Hoàn tất & Tiếp tục thử đồ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
