import React from 'react';
import { X, Trash2, Download, Eye, Sparkles, BookOpen } from 'lucide-react';
import { GeneratedLook } from '../types';
import { downloadImage } from '../utils/imageUtils';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  lookbook: GeneratedLook[];
  onSelectLook: (look: GeneratedLook) => void;
  onDeleteLook: (id: string) => void;
  onClearAll: () => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  lookbook,
  onSelectLook,
  onDeleteLook,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Lookbook Của Bạn ({lookbook.length})
              </h2>
              <p className="text-xs text-slate-400">
                Các kiểu tóc & bộ trang phục AI bạn đã lưu lại
              </p>
            </div>
          </div>

          {lookbook.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {lookbook.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40">
            <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              Chưa có phong cách nào được lưu
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Hãy thử một kiểu tóc hoặc trang phục và nhấn "Lưu Look" để thêm vào đây
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Bắt đầu tạo kiểu ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lookbook.map((look) => (
              <div
                key={look.id}
                className="group rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 hover:border-violet-500/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    src={look.resultImage}
                    alt="Saved Look"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-white">
                    {look.mode === 'hair' && '💇 Kiểu tóc'}
                    {look.mode === 'outfit' && '👗 Trang phục'}
                    {look.mode === 'both' && '✨ Trọn gói'}
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="text-xs font-bold text-slate-200 truncate">
                    {look.hairStyleName || look.outfitName || 'Phong cách AI'}
                  </div>

                  {look.hairColorName && (
                    <div className="text-[11px] text-pink-400">
                      Màu: {look.hairColorName}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500">
                    {new Date(look.timestamp).toLocaleDateString('vi-VN')} {new Date(look.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                    <button
                      onClick={() => {
                        onSelectLook(look);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>

                    <button
                      onClick={() => downloadImage(look.resultImage, `look-${look.id}.png`)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      title="Tải ảnh"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteLook(look.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
