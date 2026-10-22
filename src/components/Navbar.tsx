import React from 'react';
import { Scissors, Shirt, Sparkles, Wand2, History, HelpCircle, RefreshCw, Crown } from 'lucide-react';
import { TransformMode } from '../types';
import { UserPlan } from './PricingModal';

interface NavbarProps {
  activeMode: TransformMode;
  onSelectMode: (mode: TransformMode) => void;
  onOpenAnalysis: () => void;
  lookbookCount: number;
  onOpenLookbook: () => void;
  onOpenHelp: (tab?: 'guide' | 'tips' | 'update') => void;
  onOpenPricing: () => void;
  currentPlan?: UserPlan;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMode,
  onSelectMode,
  onOpenAnalysis,
  lookbookCount,
  onOpenLookbook,
  onOpenHelp,
  onOpenPricing,
  currentPlan = 'free',
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 p-[2px] shadow-lg shadow-fuchsia-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Hair & Style AI Studio
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                PRO 3.1
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Đổi kiểu tóc, nhuộm màu & thử đồ ảo chuẩn salon
            </p>
          </div>
        </div>

        {/* Central Mode Switcher */}
        <nav className="flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onSelectMode('hair')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeMode === 'hair'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>Đổi Kiểu Tóc</span>
          </button>

          <button
            onClick={() => onSelectMode('outfit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeMode === 'outfit'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Thử Quần Áo</span>
          </button>

          <button
            onClick={() => onSelectMode('both')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeMode === 'both'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Makeover</span> Trọn Gói
          </button>
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2">
          {/* Pricing & VIP Packages Button */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
              currentPlan === 'vip'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30'
                : currentPlan === 'pro'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-violet-600/30'
                : currentPlan === 'trial'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-600/30'
                : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 shadow-amber-500/10'
            }`}
            title="Xem bảng giá dịch vụ & Nâng cấp tài khoản"
          >
            <Crown className={`w-3.5 h-3.5 ${currentPlan === 'vip' ? 'text-slate-950 fill-current' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Bảng Giá</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
              currentPlan === 'vip'
                ? 'bg-slate-950 text-amber-300'
                : currentPlan === 'pro'
                ? 'bg-white text-violet-700'
                : currentPlan === 'trial'
                ? 'bg-white text-cyan-700'
                : 'bg-amber-400 text-slate-950'
            }`}>
              {currentPlan === 'vip' ? 'VIP' : currentPlan === 'pro' ? 'PRO' : currentPlan === 'trial' ? '30 Lượt' : 'Gói Dịch Vụ'}
            </span>
          </button>

          {/* AI Stylist Analysis Button */}
          <button
            onClick={onOpenAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm"
            title="AI quét dáng mặt & tư vấn kiểu tóc, tone da"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Tư Vấn</span> Dáng Mặt
          </button>

          {/* Lookbook Button */}
          <button
            onClick={onOpenLookbook}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
            title="Bộ sưu tập ảnh đã tạo"
          >
            <History className="w-4 h-4" />
            {lookbookCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-950">
                {lookbookCount}
              </span>
            )}
          </button>

          {/* Update Button */}
          <button
            onClick={() => onOpenHelp('update')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-violet-600/15 hover:bg-violet-600/25 text-violet-300 hover:text-white border border-violet-500/30 transition-all shadow-sm group"
            title="Kiểm tra cập nhật phần mềm & xu hướng 2026 (v2.4)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">Update</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Help Button */}
          <button
            onClick={() => onOpenHelp('guide')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all shadow-sm"
            title="Hướng dẫn sử dụng phần mềm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
