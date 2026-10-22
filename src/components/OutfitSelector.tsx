import React, { useState, useRef, useEffect } from 'react';
import {
  Shirt,
  Sparkles,
  Check,
  Upload,
  X,
  Tag,
  CloudSun,
  Thermometer,
  Wind,
  MapPin,
  ExternalLink,
  Search,
  Snowflake,
  Sun,
  CloudRain,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { OUTFIT_PRESETS } from '../data/presets';
import { OutfitPreset, WeatherInfo } from '../types';
import { fileToBase64, resizeImage } from '../utils/imageUtils';

interface OutfitSelectorProps {
  selectedOutfit: OutfitPreset;
  onSelectOutfit: (outfit: OutfitPreset) => void;
  customClothingImage: string | null;
  onSelectCustomClothing: (imageDataUrl: string | null) => void;
  customOutfitNotes: string;
  onChangeCustomOutfitNotes: (notes: string) => void;
}

export const OutfitSelector: React.FC<OutfitSelectorProps> = ({
  selectedOutfit,
  onSelectOutfit,
  customClothingImage,
  onSelectCustomClothing,
  customOutfitNotes,
  onChangeCustomOutfitNotes,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'office' | 'street' | 'party' | 'traditional' | 'resort' | 'vintage' | 'winter'
  >('all');
  const clothingInputRef = useRef<HTMLInputElement>(null);

  // Weather State (Google Search Grounded)
  const [weatherCity, setWeatherCity] = useState<string>('Hà Nội');
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [showCityInput, setShowCityInput] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Fetch real-time weather using Gemini 3.8 + Google Search Grounding
  const fetchWeather = async (cityName: string) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const response = await fetch('/api/ai/weather-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: cityName }),
      });
      const data = await response.json();
      if (response.ok && data.weather) {
        setWeather(data.weather);
        setWeatherCity(cityName);
      } else {
        setWeatherError(data.error || 'Không thể tra cứu thời tiết.');
      }
    } catch (err: any) {
      console.warn('Weather fetch error:', err);
      setWeatherError('Lỗi kết nối khi tra cứu thời tiết Google Search.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Auto fetch weather on initial mount
  useEffect(() => {
    fetchWeather('Hà Nội');
  }, []);

  // Detect GPS Location
  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      setIsLoadingWeather(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode via free open API
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.state ||
              data.address?.county ||
              'Vị trí của bạn';
            fetchWeather(city);
          } catch {
            fetchWeather('Hà Nội');
          }
        },
        () => {
          setIsLoadingWeather(false);
          setWeatherError('Không thể lấy vị trí GPS. Đang dùng mặc định Hà Nội.');
        }
      );
    }
  };

  // 1-Click apply weather recommendation
  const handleApplyWeatherRecommendation = () => {
    if (!weather) return;

    let targetPreset: OutfitPreset | undefined;

    if (weather.weatherType === 'cold') {
      targetPreset =
        OUTFIT_PRESETS.find((o) => o.id === 'winter-wool-trench') ||
        OUTFIT_PRESETS.find((o) => o.id === 'cozy-puffer-jacket');
      setCategoryFilter('winter');
    } else if (weather.weatherType === 'hot') {
      targetPreset = OUTFIT_PRESETS.find((o) => o.id === 'summer-resort-linen');
      setCategoryFilter('resort');
    } else if (weather.weatherType === 'rain') {
      targetPreset =
        OUTFIT_PRESETS.find((o) => o.id === 'cozy-puffer-jacket') ||
        OUTFIT_PRESETS.find((o) => o.id === 'korean-street-minimalist');
    } else {
      targetPreset =
        OUTFIT_PRESETS.find((o) => o.id === 'office-blazer-chic') ||
        OUTFIT_PRESETS.find((o) => o.id === 'parisian-tweed-jacket');
      setCategoryFilter('office');
    }

    if (targetPreset) {
      onSelectOutfit(targetPreset);
      onSelectCustomClothing(null);
    }
  };

  const filteredOutfits = OUTFIT_PRESETS.filter((item) => {
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const handleUploadClothing = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      const resized = await resizeImage(b64, 800, 800);
      onSelectCustomClothing(resized);
    } catch (err) {
      console.error('Lỗi khi tải ảnh trang phục:', err);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              <Shirt className="w-4 h-4 text-fuchsia-400" />
              Chọn Phong Cách Trang Phục (Virtual Try-On)
            </h2>
            <p className="text-xs text-slate-400">
              Gợi ý trang phục theo thời tiết thực tế từ Google Search
            </p>
          </div>
        </div>

        {/* Selected preview chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200">
          <Tag className="w-3.5 h-3.5 text-fuchsia-400" />
          <span className="truncate max-w-[130px]">{selectedOutfit.name}</span>
        </div>
      </div>

      {/* WEATHER ASSISTANT CARD (Google Search Grounded) */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-sky-950/40 border border-sky-500/30 p-4 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              {weather?.weatherType === 'cold' ? (
                <Snowflake className="w-4 h-4 text-sky-400 animate-pulse" />
              ) : weather?.weatherType === 'hot' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin" />
              ) : weather?.weatherType === 'rain' ? (
                <CloudRain className="w-4 h-4 text-blue-400" />
              ) : (
                <CloudSun className="w-4 h-4 text-amber-300" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {weather?.location || weatherCity}
                </span>

                {weather && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-extrabold flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-sky-400" />
                    {weather.temperature}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {weather?.condition || 'Đang cập nhật thời tiết...'}
              </p>
            </div>
          </div>

          {/* Google Search Grounding Badge & Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold text-slate-300 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Google Search
            </span>

            <button
              onClick={() => fetchWeather(weatherCity)}
              disabled={isLoadingWeather}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title="Làm mới thời tiết"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* City Quick Switcher Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={handleDetectGPS}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-700/80 shrink-0 flex items-center gap-1 text-[11px]"
          >
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>GPS của bạn</span>
          </button>

          {['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Lạt', 'Đà Nẵng', 'Sa Pa', 'Tokyo', 'Paris'].map((city) => (
            <button
              key={city}
              onClick={() => fetchWeather(city)}
              className={`px-2.5 py-1 rounded-lg shrink-0 text-[11px] transition-colors border ${
                weatherCity === city
                  ? 'bg-sky-600 text-white border-sky-500 font-semibold shadow-sm'
                  : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {city}
            </button>
          ))}

          {/* Custom City Input Toggle */}
          {showCityInput ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customCityInput.trim()) {
                  fetchWeather(customCityInput.trim());
                  setShowCityInput(false);
                }
              }}
              className="flex items-center gap-1 shrink-0"
            >
              <input
                type="text"
                placeholder="Nhập tên TP..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="px-2 py-0.5 rounded-lg bg-slate-900 border border-sky-500 text-[11px] text-white w-24 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-2 py-0.5 rounded-lg bg-sky-600 text-white text-[11px] font-semibold"
              >
                Tìm
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowCityInput(true)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] shrink-0"
            >
              + Thành phố khác
            </button>
          )}
        </div>

        {/* Weather Outfit Advice & 1-Click Apply */}
        {weather && (
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-sky-300 font-semibold">💡 Tư vấn trang phục: </strong>
                {weather.outfitAdvice}
              </p>

              <button
                onClick={handleApplyWeatherRecommendation}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 transition-all flex items-center gap-1 active:scale-95"
              >
                <span>Ướm đồ này ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Google Search Citations */}
            {weather.searchSources && weather.searchSources.length > 0 && (
              <div className="pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <Search className="w-3 h-3" /> Nguồn tra cứu Google:
                </span>
                {weather.searchSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-300 underline truncate max-w-[150px] flex items-center gap-0.5"
                  >
                    <span>{source.title.split(' - ')[0]}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {weatherError && (
          <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            {weatherError}
          </p>
        )}
      </div>

      {/* Try-on custom user clothing upload banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-fuchsia-950/40 via-purple-950/30 to-slate-950 border border-fuchsia-500/30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-fuchsia-200">
                Thử quần áo từ ảnh riêng của bạn (Online Shop / Tủ đồ)
              </p>
              <p className="text-[11px] text-slate-400">
                Tải ảnh chụp chiếc váy, áo sơ mi hoặc áo khoác bạn muốn AI mặc lên người
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {customClothingImage ? (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-fuchsia-500/60 shadow-sm relative">
                  <img
                    src={customClothingImage}
                    alt="Trang phục tùy chọn"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onSelectCustomClothing(null)}
                    className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    title="Xóa ảnh đồ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => onSelectCustomClothing(null)}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  Gỡ bỏ
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => clothingInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-md shadow-fuchsia-600/25 transition-all"
              >
                + Tải ảnh đồ
              </button>
            )}
            <input
              type="file"
              ref={clothingInputRef}
              onChange={handleUploadClothing}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'winter', label: '❄️ Áo Khoác & Giữ Ấm' },
          { id: 'office', label: '💼 Công sở' },
          { id: 'street', label: '🛹 Dạo phố' },
          { id: 'traditional', label: '🌸 Áo Dài' },
          { id: 'party', label: '✨ Dạ tiệc' },
          { id: 'resort', label: '🏖️ Mùa hè Resort' },
          { id: 'vintage', label: '⚡ Y2K & Retro' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
              categoryFilter === tab.id
                ? 'bg-fuchsia-600 text-white shadow-sm font-semibold'
                : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Outfit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
        {filteredOutfits.map((outfit) => {
          const isSelected = selectedOutfit.id === outfit.id && !customClothingImage;
          const isWeatherMatch = weather && outfit.weatherSuitability === weather.weatherType;

          return (
            <button
              key={outfit.id}
              onClick={() => {
                onSelectOutfit(outfit);
                onSelectCustomClothing(null);
              }}
              className={`group text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between relative ${
                isSelected
                  ? 'border-fuchsia-500 bg-fuchsia-600/10 shadow-md shadow-fuchsia-600/10 ring-1 ring-fuchsia-500'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3
                      className={`text-xs sm:text-sm font-bold transition-colors ${
                        isSelected ? 'text-fuchsia-300' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {outfit.name}
                    </h3>

                    {/* Weather badge */}
                    {isWeatherMatch && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-bold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        Hợp thời tiết {weather.temperature}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-fuchsia-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {outfit.description}
                </p>

                <div className="text-[10px] text-slate-400 mb-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/80">
                  <span className="font-semibold text-slate-300">Gồm: </span>
                  {outfit.pieces}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between mt-auto">
                {/* Color swatches in outfit */}
                <div className="flex items-center gap-1">
                  {outfit.palette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1 truncate max-w-[110px]">
                    {outfit.defaultColors}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {outfit.tempRange && (
                    <span className="text-[9px] text-sky-400/90 font-medium">
                      {outfit.tempRange}
                    </span>
                  )}
                  <span className="text-[10px] text-fuchsia-400/90 font-medium uppercase">
                    {outfit.category}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Outfit notes */}
      <div className="pt-1">
        <label className="block text-xs text-slate-300 mb-1">
          Ghi chú màu sắc hoặc phom dáng mong muốn (Tùy chọn):
        </label>
        <input
          type="text"
          placeholder="VD: Đổi sang màu đỏ đô, thêm áo khoác dạ dáng dài ấm áp..."
          value={customOutfitNotes}
          onChange={(e) => onChangeCustomOutfitNotes(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
        />
      </div>
    </div>
  );
};
