import React, { useState } from 'react';
import { Scissors, Palette, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { HAIR_STYLES, HAIR_COLORS } from '../data/presets';
import { HairStylePreset, HairColorPreset, Gender } from '../types';

interface HairstyleSelectorProps {
  selectedStyle: HairStylePreset;
  onSelectStyle: (style: HairStylePreset) => void;
  selectedColor: HairColorPreset;
  onSelectColor: (color: HairColorPreset) => void;
  hairVolume: number;
  onChangeVolume: (volume: number) => void;
  customNotes: string;
  onChangeNotes: (notes: string) => void;
}

export const HairstyleSelector: React.FC<HairstyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  selectedColor,
  onSelectColor,
  hairVolume,
  onChangeVolume,
  customNotes,
  onChangeNotes,
}) => {
  const [genderFilter, setGenderFilter] = useState<'all' | Gender>('all');
  const [lengthFilter, setLengthFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filtered hairstyles
  const filteredStyles = HAIR_STYLES.filter((item) => {
    if (genderFilter !== 'all' && item.gender !== genderFilter && item.gender !== 'unisex') {
      return false;
    }
    if (lengthFilter !== 'all' && item.category !== lengthFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-violet-400" />
              Chọn Kiểu Tóc & Màu Nhuộm
            </h2>
            <p className="text-xs text-slate-400">
              Kiểu tóc thịnh hành chuẩn salon châu Á & châu Âu
            </p>
          </div>
        </div>

        {/* Selected preview chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="font-semibold text-slate-200 truncate max-w-[130px]">
            {selectedStyle.name}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        {/* Gender Filter */}
        <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setGenderFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              genderFilter === 'all'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setGenderFilter('female')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              genderFilter === 'female'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tóc Nữ
          </button>
          <button
            onClick={() => setGenderFilter('male')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              genderFilter === 'male'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tóc Nam
          </button>
        </div>

        {/* Length Filter */}
        <div className="flex items-center gap-1 text-xs">
          {(['all', 'short', 'medium', 'long'] as const).map((len) => (
            <button
              key={len}
              onClick={() => setLengthFilter(len)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                lengthFilter === len
                  ? 'bg-slate-800 text-violet-300 border-violet-500/50'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {len === 'all' && 'Mọi độ dài'}
              {len === 'short' && 'Tóc ngắn'}
              {len === 'medium' && 'Ngang vai'}
              {len === 'long' && 'Tóc dài'}
            </button>
          ))}
        </div>
      </div>

      {/* Hairstyle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[340px] overflow-y-auto pr-1">
        {filteredStyles.map((style) => {
          const isSelected = selectedStyle.id === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style)}
              className={`group text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-violet-500 bg-violet-600/10 shadow-md shadow-violet-600/10 ring-1 ring-violet-500'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className={`text-xs sm:text-sm font-bold transition-colors ${
                    isSelected ? 'text-violet-300' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {style.name}
                  </h3>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {style.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1 mt-auto">
                {style.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-[9px] text-violet-400/90 ml-auto">
                  {style.gender === 'female' ? 'Nữ' : 'Nam'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hair Dye Palette Section */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>Bảng Màu Nhuộm Tóc (Salon Hair Dye):</span>
          </div>
          <span className="text-xs text-pink-300 font-medium">
            {selectedColor.name}
          </span>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {HAIR_COLORS.map((color) => {
            const isSelected = selectedColor.id === color.id;
            return (
              <button
                key={color.id}
                onClick={() => onSelectColor(color)}
                className={`group flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
                  isSelected ? 'bg-slate-800 ring-2 ring-pink-500' : 'hover:bg-slate-800/60'
                }`}
                title={`${color.name} (${color.nameEn})`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-inner border border-white/20 relative flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: `0 2px 8px ${color.hex}66`,
                  }}
                >
                  {/* Subtle glossy reflex */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />}
                </div>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-200 truncate w-full text-center">
                  {color.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Fine-Tuning Toggle */}
      <div className="pt-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>Tùy chỉnh độ bồng bềnh & ghi chú chi tiết</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
            {/* Hair Volume Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Độ bồng bềnh tóc (Volume):</span>
                <span className="font-bold text-violet-400">{hairVolume}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={hairVolume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Tự nhiên ép sát</span>
                <span>Tiêu chuẩn</span>
                <span>Bồng bềnh dày dặn</span>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-slate-300 mb-1">
                Ghi chú thêm cho AI Stylist (Tùy chọn):
              </label>
              <input
                type="text"
                placeholder="VD: Cắt ngắn hơn một chút, thêm highlight khói, rẽ ngôi 6/4..."
                value={customNotes}
                onChange={(e) => onChangeNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
