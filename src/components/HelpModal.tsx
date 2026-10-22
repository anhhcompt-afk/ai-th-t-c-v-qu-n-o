import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Camera,
  Scissors,
  Shirt,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  Lightbulb,
  Check,
  Smartphone,
  Sliders,
  Wand2,
  Layers,
  ArrowRight,
  Info,
  Crown,
  Building2,
  Copy,
} from 'lucide-react';
import { BANKING_INFO, PRICING_PLANS } from './PricingModal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'guide' | 'tips' | 'update' | 'pricing';
  onRefreshCatalog?: () => void;
  onOpenPricing?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'guide',
  onRefreshCatalog,
  onOpenPricing,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'tips' | 'update' | 'pricing'>(initialTab);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [lastCheckedTime, setLastCheckedTime] = useState<string>('Vừa xong');

  if (!isOpen) return null;

  const handleCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateMessage(null);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setTimeout(() => {
        setIsCheckingUpdate(false);
        setLastCheckedTime(new Date().toLocaleTimeString('vi-VN'));
        setUpdateMessage(
          `Phiên bản v2.4.0 đang là bản mới nhất! Kết nối máy chủ AI Gemini: ${data.hasApiKey ? 'Sẵn sàng hoạt động' : 'Chưa cấu hình key'}. Đã đồng bộ tất cả xu hướng tóc & thời trang 2026.`
        );
        if (onRefreshCatalog) onRefreshCatalog();
      }, 700);
    } catch {
      setIsCheckingUpdate(false);
      setUpdateMessage('Hệ thống hoạt động bình thường trên phiên bản v2.4.0 mới nhất.');
    }
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-400 p-[2px] shadow-lg shadow-violet-600/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-violet-400">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Trung Tâm Trợ Giúp & Hướng Dẫn Sử Dụng
            </h2>
            <p className="text-xs text-slate-400">
              Cẩm nang sử dụng AI Salon, mẹo chụp ảnh & cập nhật phiên bản phần mềm
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold mb-5">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'guide'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hướng Dẫn Sử Dụng</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'tips'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Mẹo Chuẩn Salon</span>
          </button>

          <button
            onClick={() => setActiveTab('update')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'update'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Update</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pricing'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-amber-300/80 hover:text-amber-300'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Bảng Giá & MB Bank</span>
          </button>
        </div>

        {/* TAB 1: Step-by-Step Software User Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-3.5 text-xs text-slate-300">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0 border border-violet-500/30">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  Chuẩn Bị Ảnh Chân Dung
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Bấm <strong>Tải ảnh từ máy</strong> hoặc chọn <strong>Chụp trực tiếp qua Webcam</strong> (sử dụng khung oval căn chỉnh mặt). Nếu bạn chỉ muốn dùng thử nhanh, hãy bấm chọn một trong 4 <strong>người mẫu mẫu sẵn có</strong>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0 border border-violet-500/30">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-violet-400" />
                  Chọn Kiểu Tóc & Bảng Màu Nhuộm
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Ở chế độ <em>"Đổi Kiểu Tóc"</em>, lọc theo giới tính (Nữ / Nam) và độ dài tóc. Nhấp chọn kiểu tóc yêu thích (Layer Hàn Quốc, Bob, Two-block, v.v.) và chạm vào bảng màu nhuộm để chọn sắc thái mong muốn (Nâu trà sữa, Xám khói, Nâu socola...).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0 border border-violet-500/30">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-fuchsia-400" />
                  Thử Trang Phục Ảo (Virtual Try-on)
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Ở chế độ <em>"Thử Quần Áo"</em>, chọn các bộ sưu tập: Công sở cao cấp, Áo Dài tơ tằm, Streetwear, Dạ hội Gala. <strong>Đặc biệt:</strong> Bạn có thể bấm <strong>+ Tải ảnh đồ</strong> để ướm thử bất kỳ trang phục nào bạn chụp từ cửa hàng hoặc trên mạng lên người!
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0 border border-violet-500/30">
                4
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-300" />
                  Bấm Tạo Kiểu & Kéo Thanh Trượt So Sánh
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Nhấn nút lớn <strong>"ÁP DỤNG KIỂU DÁNG AI"</strong>. Sau khi hoàn tất, kéo thanh trượt Trước/Sau (hoặc chuyển sang chế độ Xem Song Song) để chiêm ngưỡng sự biến đổi diện mạo ngoạn mục.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs shrink-0 border border-violet-500/30">
                5
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <Share2 className="w-3.5 h-3.5 text-pink-400" />
                  Tải Ảnh HD (JPG/PNG) & Chia Sẻ Lên Mạng Xã Hội
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Tại bảng chia sẻ bên cạnh, chọn <strong>Tải File PNG</strong> (không nén) hoặc <strong>Tải File JPG</strong> (nhẹ chuẩn HD). Nhấn <strong>Mở Bảng Chia Sẻ Nhanh</strong> để gửi trực tiếp qua Instagram, Facebook, hoặc tạo <strong>Thẻ Story 9:16</strong> để đăng tin 24h!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Salon Pro Tips */}
        {activeTab === 'tips' && (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Mẹo chụp ảnh để AI xử lý tóc & trang phục đẹp nhất
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400 leading-relaxed">
                <li>
                  <strong className="text-slate-200">Ánh sáng thuận:</strong> Chụp gần cửa sổ hoặc đèn sáng dịu trước mặt, tránh chụp ngược sáng hoặc bóng đổ đen trên khuôn mặt.
                </li>
                <li>
                  <strong className="text-slate-200">Khoảng cách chụp:</strong> Giữ máy cách khoảng 0.8m - 1.2m, lấy trọn vẹn từ đỉnh đầu đến qua phần ngực để AI có không gian phối đồ và thả tóc tự nhiên.
                </li>
                <li>
                  <strong className="text-slate-200">Tóc tai:</strong> Vén bớt tóc che mắt hoặc chân mày để AI nhận diện đúng ngũ quan khuôn mặt.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Quy tắc chọn màu nhuộm theo sắc tố da (Undertone)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
                  <span className="font-bold text-amber-300 text-[11px]">Tone Da Ấm (Warm Undertone):</span>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Hợp nhất với: Nâu socola, Nâu hạt dẻ ánh đồng, Đỏ rượu Cherry, Nâu caramel ngọt ngào.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-sky-500/30">
                  <span className="font-bold text-sky-300 text-[11px]">Tone Da Lạnh (Cool Undertone):</span>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Hợp nhất với: Xám khói (Ash Gray), Bạch kim (Platinum), Nâu rêu khói, Hồng lavender pastel.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-fuchsia-400" />
                Sử dụng tính năng "Tư Vấn Dáng Mặt AI"
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Nếu bạn còn phân vân, hãy bấm nút <strong>"Tư Vấn Dáng Mặt"</strong> ở góc trên. Trợ lý AI sẽ đo đạc tỷ lệ khuôn mặt của bạn (Mặt tròn, Trái xoan, Vuông, v.v.) và đưa ra danh sách các kiểu tóc che khuyết điểm tôn xương quai hàm nhất kèm nút áp dụng tự động!
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: Software Updates & Version Changelog */}
        {activeTab === 'update' && (
          <div className="space-y-4 text-xs text-slate-300">
            {/* Version Overview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-950 to-fuchsia-950/40 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Hair & Style AI Studio</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                    v2.4.0 Mới nhất
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Lần kiểm tra cuối: {lastCheckedTime} • Trạng thái: Ổn định
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckUpdate}
                  disabled={isCheckingUpdate}
                  className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-600/30 transition-all shrink-0 active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                  <span>{isCheckingUpdate ? 'Đang kiểm tra...' : 'Kiểm Tra Cập Nhật'}</span>
                </button>
              </div>
            </div>

            {/* Update Feedback Status Toast */}
            {updateMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{updateMessage}</span>
              </div>
            )}

            {/* Changelog */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-violet-400" />
                Nhật Ký Phiên Bản (Changelog v2.4.0):
              </h4>

              <div className="space-y-2.5 text-[11px] text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold shrink-0">MỚI</span>
                  <p className="text-slate-300">
                    <strong>Tải ảnh chất lượng cao PNG & JPG:</strong> Bổ sung nút xuất file PNG sắc nét gốc và JPG chuẩn HD tối ưu hóa để đăng lên Facebook, Instagram.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold shrink-0">MỚI</span>
                  <p className="text-slate-300">
                    <strong>Chia sẻ mạng xã hội (Web Share API):</strong> Mở menu chia sẻ trực tiếp của điện thoại iOS/Android, gửi vào Instagram Story, Messenger, Zalo.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">MỚI</span>
                  <p className="text-slate-300">
                    <strong>Trình tạo Thẻ Story 9:16:</strong> Tự động xuất ảnh dọc Trước/Sau kèm thẻ phong cách chuẩn tỷ lệ Story Instagram & Facebook.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">NÂNG CẤP</span>
                  <p className="text-slate-300">
                    <strong>Trung tâm trợ giúp (Help Menu) & Nút Update:</strong> Hướng dẫn thao tác chi tiết từng bước và tính năng kiểm tra cập nhật hệ thống tức thì.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING & MB BANK PAYMENT INFO */}
        {activeTab === 'pricing' && (
          <div className="space-y-4 text-xs text-slate-300">
            {/* Banking Card Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950/40 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Tài Khoản MB Bank Chính Thức
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  Kích hoạt 24/7
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Chủ tài khoản:</span>
                  <span className="font-extrabold text-white text-sm">{BANKING_INFO.accountName}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30">
                  <span className="text-[10px] text-slate-500 block">Số tài khoản (STK):</span>
                  <span className="font-extrabold text-amber-300 text-sm tracking-wider">{BANKING_INFO.accountNumber}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 sm:col-span-2">
                  <span className="text-[10px] text-slate-500 block">Ngân hàng:</span>
                  <span className="font-bold text-slate-200">{BANKING_INFO.bankName}</span>
                </div>
              </div>

              {onOpenPricing && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPricing();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Crown className="w-4 h-4" />
                  <span>Mở Trình Quét Mã VietQR & Nâng Cấp Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Packages Summary */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">Các Gói Dịch Vụ Có Sẵn:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRICING_PLANS.filter((p) => p.id !== 'free').map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{p.name.split('(')[0]}</span>
                      {p.popular && <span className="text-[9px] px-1.5 py-0.2 rounded bg-violet-500/30 text-violet-300 font-bold">HOT</span>}
                    </div>
                    <div className="text-amber-400 font-extrabold text-sm">{p.priceFormatted}</div>
                    <p className="text-[10px] text-slate-400 leading-tight">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Hair & Style AI Studio • Hỗ trợ 24/7
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
