import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  Sparkles,
  QrCode,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Building2,
  User,
  Hash,
  ChevronRight,
  Flame,
  Download,
  PhoneCall,
  BadgeCheck,
} from 'lucide-react';

export type UserPlan = 'free' | 'trial' | 'pro' | 'vip';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: UserPlan;
  onUpgradePlan: (plan: UserPlan) => void;
}

export interface PlanDetail {
  id: UserPlan;
  name: string;
  badge?: string;
  price: number;
  priceFormatted: string;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  buttonText: string;
}

export const PRICING_PLANS: PlanDetail[] = [
  {
    id: 'free',
    name: 'Gói Miễn Phí (Starter)',
    price: 0,
    priceFormatted: '0đ',
    period: 'Vĩnh viễn',
    description: 'Trải nghiệm thử các kiểu tóc cơ bản và phân tích dáng mặt mẫu.',
    features: [
      '3 lượt đổi kiểu tóc AI mỗi ngày',
      'Thử các mẫu trang phục có sẵn',
      'Độ phân giải tiêu chuẩn HD',
      'Thanh trượt so sánh Trước & Sau',
      'Xem gợi ý thời tiết từ Google Search',
    ],
    buttonText: 'Gói Hiện Tại',
  },
  {
    id: 'trial',
    name: 'Gói Trải Nghiệm (Combo 30 Lượt)',
    badge: 'Tiết Kiệm',
    price: 29000,
    priceFormatted: '29.000đ',
    period: '/ 30 Lượt thử',
    description: 'Phù hợp trải nghiệm nhanh chọn mẫu tóc đi tiệc, đi cưới, thay đổi diện mạo.',
    features: [
      '30 lượt đổi kiểu tóc & màu nhuộm salon',
      '30 lượt thử quần áo & tải ảnh trang phục riêng',
      'Tải ảnh Full HD sắc nét không logo watermark',
      'So sánh 2 kiểu tóc khác nhau trên cùng 1 ảnh',
      'Không giới hạn thời gian sử dụng 30 lượt',
    ],
    buttonText: 'Chọn Gói 29K',
  },
  {
    id: 'pro',
    name: 'Gói Cá Nhân (Pro Stylist)',
    badge: 'Được Chọn Nhiều Nhất',
    popular: true,
    price: 69000,
    priceFormatted: '69.000đ',
    period: '/ Tháng',
    description: 'Dành cho cá nhân muốn tìm kiểu tóc & trang phục hoàn hảo nhất.',
    features: [
      'Không giới hạn lượt đổi kiểu tóc & màu nhuộm salon',
      'Không giới hạn thử đồ ảo & tải ảnh trang phục riêng',
      'Tải ảnh gốc 4K Ultra HD không watermark (PNG & JPG)',
      'Tư vấn dáng mặt & tone da chuyên sâu (Gemini 3.8)',
      'Chia sẻ Web Share API & Thẻ Story 9:16 độc quyền',
      'Tốc độ xử lý AI ưu tiên không phải chờ đợi',
    ],
    buttonText: 'Nâng Cấp Pro 69K',
  },
  {
    id: 'vip',
    name: 'Gói Salon VIP / Doanh Nghiệp',
    badge: 'VIP Studio 2026',
    price: 199000,
    priceFormatted: '199.000đ',
    period: '/ 3 Tháng',
    description: 'Giải pháp chuyên nghiệp cho Salon tóc, Stylist, Shop thời trang & Studio.',
    features: [
      'Bao gồm toàn bộ quyền lợi Gói Pro Cá Nhân',
      'Giấy phép sử dụng thương mại tư vấn trực tiếp khách hàng',
      'Tốc độ render GPU cao cấp nhanh nhất',
      'Tải trọn bộ Lookbook chất lượng studio in ấn quảng cáo',
      'Hỗ trợ kỹ thuật 24/7 trực tiếp qua Zalo từ quản trị viên',
      'Cập nhật trước các bộ sưu tập tóc hot trend 2026 độc quyền',
    ],
    buttonText: 'Đăng Ký Salon VIP 199K',
  },
];

// Thông tin tài khoản thanh toán của bạn
export const BANKING_INFO = {
  accountName: 'HOÀNG HẢI AN',
  accountNumber: '0030132291981',
  bankName: 'MB Bank (Ngân hàng Quân đội)',
  bankShortName: 'MB', // VietQR Napas code
};

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpgradePlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanDetail>(
    PRICING_PLANS.find((p) => p.id === 'pro') || PRICING_PLANS[2]
  );
  const [step, setStep] = useState<'plans' | 'payment'>('plans');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPaidConfirmed, setIsPaidConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  // Format nội dung chuyển khoản: AISALON [SĐT hoặc Mã Gói]
  const cleanPhone = customerPhone.trim().replace(/\D/g, '');
  const transferCode = cleanPhone
    ? `AISALON ${cleanPhone}`
    : `AISALON ${selectedPlan.id.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  // Tạo URL VietQR QuickLink tiêu chuẩn
  const vietQrUrl = `https://img.vietqr.io/image/${BANKING_INFO.bankShortName}-${BANKING_INFO.accountNumber}-compact2.png?amount=${selectedPlan.price}&addInfo=${encodeURIComponent(transferCode)}&accountName=${encodeURIComponent(BANKING_INFO.accountName)}`;

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (e) {
      console.warn('Copy error', e);
    }
  };

  const handleDownloadQr = () => {
    const a = document.createElement('a');
    a.href = vietQrUrl;
    a.download = `VietQR-MBBank-${BANKING_INFO.accountNumber}-${selectedPlan.price}d.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleProceedToPayment = (plan: PlanDetail) => {
    setSelectedPlan(plan);
    setStep('payment');
  };

  const handleConfirmPaid = () => {
    setIsPaidConfirmed(true);
    setTimeout(() => {
      onUpgradePlan(selectedPlan.id);
      setIsPaidConfirmed(false);
      setStep('plans');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-4 sm:p-7 shadow-2xl relative my-6 max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-10"
          title="Đóng bảng giá"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-6 pt-2 sm:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            Bảng Giá Dịch Vụ AI Stylist & Virtual Try-On
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {step === 'plans' ? 'Chọn Gói Dịch Vụ Phù Hợp' : 'Thanh Toán Chuyển Khoản Qua VietQR'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {step === 'plans'
              ? 'Mở khóa toàn bộ kiểu tóc thời thượng 2026, thử trang phục thiết kế và xuất ảnh 4K không watermark'
              : 'Quét mã VietQR bằng ứng dụng ngân hàng hoặc ví điện tử để kích hoạt tài khoản ngay tức thì'}
          </p>
        </div>

        {/* STEP 1: PLANS COMPARISON TABLE */}
        {step === 'plans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRICING_PLANS.map((plan) => {
                const isCurrent = currentPlan === plan.id;
                const isPopular = plan.popular;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between relative ${
                      isPopular
                        ? 'border-violet-500 bg-gradient-to-b from-violet-950/40 via-slate-900 to-slate-900 shadow-xl shadow-violet-600/15 ring-2 ring-violet-500/50'
                        : isCurrent
                        ? 'border-emerald-500/50 bg-slate-950/90'
                        : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold text-[10px] tracking-wide uppercase shadow-md whitespace-nowrap">
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div className="mb-3">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
                          <span>{plan.name}</span>
                          {plan.id !== 'free' && <Crown className="w-4 h-4 text-amber-400 shrink-0 ml-1" />}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 min-h-[32px] leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="my-3 pb-3 border-b border-slate-800">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-black text-white">
                            {plan.priceFormatted}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {plan.period}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 text-[11px] sm:text-xs text-slate-300 mb-5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {plan.id === 'free' ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 text-slate-400 text-xs font-semibold cursor-default"
                        >
                          {isCurrent ? '✓ Đang Dùng Gói Này' : 'Gói Mặc Định'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProceedToPayment(plan)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
                            isPopular
                              ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white shadow-violet-600/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          }`}
                        >
                          <span>{isCurrent ? 'Gia Hạn Gói Này' : plan.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guarantee note */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-slate-300">
                  Kích hoạt gói tức thì qua quét mã VietQR tự động 24/7 (MB Bank)
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px] sm:text-xs">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Không tự động trừ tiền gia hạn
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Hỗ trợ salon & cá nhân toàn quốc
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: VIETQR BANKING PAYMENT SCREEN */}
        {step === 'payment' && (
          <div className="space-y-6">
            {/* Quick Plan Switcher */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Gói đang chọn thanh toán:</span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {PRICING_PLANS.filter((p) => p.id !== 'free').map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedPlan.id === p.id
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.name.split('(')[0]} • {p.priceFormatted}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: VietQR Code Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-2xl">
                <div className="text-center mb-2.5">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                    {BANKING_INFO.bankName}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Quét mã QR để chuyển khoản nhanh 24/7
                  </span>
                </div>

                {/* QR Image */}
                <div className="w-56 h-56 rounded-xl overflow-hidden p-1 bg-white border border-slate-300 relative shadow-inner">
                  <img
                    src={vietQrUrl}
                    alt={`VietQR ${BANKING_INFO.bankName} ${selectedPlan.priceFormatted}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xl font-black text-rose-600">
                    {selectedPlan.priceFormatted}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hỗ trợ quét qua MBBank, Vietcombank, Techcombank, MoMo, v.v.
                  </p>
                </div>

                <button
                  onClick={handleDownloadQr}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Tải ảnh mã VietQR về máy</span>
                </button>
              </div>

              {/* Right Column: Account Details & Action Buttons */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-400" />
                    Thông Tin Tài Khoản MB Bank Nhận Chuyển Khoản:
                  </h4>

                  {/* Ngân hàng */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Ngân hàng:</span>
                      <span className="font-bold text-slate-200">{BANKING_INFO.bankName}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(BANKING_INFO.bankName, 'bank')}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Sao chép tên ngân hàng"
                    >
                      {copiedField === 'bank' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Số tài khoản */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-violet-500/40">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Số tài khoản (STK):</span>
                      <span className="font-extrabold text-base sm:text-lg text-amber-300 tracking-wider">
                        {BANKING_INFO.accountNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(BANKING_INFO.accountNumber, 'stk')}
                      className="px-3 py-1.5 rounded-lg bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedField === 'stk' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã chép STK</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép STK</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Chủ tài khoản:</span>
                      <span className="font-extrabold text-white text-sm tracking-wide">
                        {BANKING_INFO.accountName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(BANKING_INFO.accountName, 'name')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      title="Sao chép tên chủ tài khoản"
                    >
                      {copiedField === 'name' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép tên</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Số tiền */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Số tiền cần thanh toán:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {selectedPlan.priceFormatted} ({selectedPlan.name})
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(selectedPlan.price.toString(), 'amount')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      title="Sao chép số tiền"
                    >
                      {copiedField === 'amount' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Chép số tiền</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Nội dung chuyển khoản */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-amber-500/40">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Nội dung chuyển khoản (Memo):</span>
                      <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                        {transferCode}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(transferCode, 'memo')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      {copiedField === 'memo' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Đã chép memo</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Chép nội dung</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Optional Phone / Note input */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Nhập Số điện thoại / Zalo để nhận xác nhận và hỗ trợ nhanh (không bắt buộc):
                  </label>
                  <input
                    type="tel"
                    placeholder="VD: 0987654321..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setStep('plans')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    ← Chọn Gói Khác
                  </button>

                  <button
                    onClick={handleConfirmPaid}
                    disabled={isPaidConfirmed}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {isPaidConfirmed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950 animate-bounce" />
                        <span>Xác nhận thành công! Đang kích hoạt gói {selectedPlan.name}...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Tôi Đã Chuyển Khoản Thành Công</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Admin contact info */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Chủ quản: <strong className="text-slate-300">{BANKING_INFO.accountName}</strong></span>
                  <span>Ngân hàng: <strong className="text-slate-300">{BANKING_INFO.bankName}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
