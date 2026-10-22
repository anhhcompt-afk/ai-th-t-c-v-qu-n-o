/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Scissors,
  Shirt,
  Wand2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Flame,
  ArrowRight,
  Columns2,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { HairstyleSelector } from './components/HairstyleSelector';
import { OutfitSelector } from './components/OutfitSelector';
import { ComparisonSlider } from './components/ComparisonSlider';
import { DualLookComparison } from './components/DualLookComparison';
import { SocialSharePanel } from './components/SocialSharePanel';
import { FaceAnalysisModal } from './components/FaceAnalysisModal';
import { LookbookModal } from './components/LookbookModal';
import { HelpModal } from './components/HelpModal';
import { PricingModal, UserPlan } from './components/PricingModal';
import { HAIR_STYLES, HAIR_COLORS, OUTFIT_PRESETS, SAMPLE_MODELS } from './data/presets';
import { TransformMode, HairStylePreset, HairColorPreset, OutfitPreset, Gender, GeneratedLook, FaceAnalysisResult } from './types';
import { generateSimulatedMakeover } from './utils/imageUtils';

export default function App() {
  // Main photo state (default initialized with first sample model so app is immediately interactive)
  const [userImage, setUserImage] = useState<string | null>(SAMPLE_MODELS[0].imageUrl);
  const [userGender, setUserGender] = useState<Gender>(SAMPLE_MODELS[0].gender);

  // Mode state
  const [activeMode, setActiveMode] = useState<TransformMode>('hair');

  // Hair customization
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairStylePreset>(HAIR_STYLES[0]);
  const [selectedHairColor, setSelectedHairColor] = useState<HairColorPreset>(HAIR_COLORS[2]); // Nâu trà sữa
  const [hairVolume, setHairVolume] = useState<number>(100);
  const [customHairNotes, setCustomHairNotes] = useState<string>('');

  // Outfit customization
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitPreset>(OUTFIT_PRESETS[0]);
  const [customClothingImage, setCustomClothingImage] = useState<string | null>(null);
  const [customOutfitNotes, setCustomOutfitNotes] = useState<string>('');

  // AI Generation State
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [transformError, setTransformError] = useState<string | null>(null);
  const [isSimulatedResult, setIsSimulatedResult] = useState<boolean>(false);

  // Face Analysis State
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Lookbook and modals
  const [isLookbookOpen, setIsLookbookOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [helpModalTab, setHelpModalTab] = useState<'guide' | 'tips' | 'update'>('guide');

  const handleOpenHelp = (tab: 'guide' | 'tips' | 'update' = 'guide') => {
    setHelpModalTab(tab);
    setIsHelpOpen(true);
  };

  // Pricing & Subscription state
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    try {
      return (localStorage.getItem('ai_salon_user_plan') as UserPlan) || 'free';
    } catch {
      return 'free';
    }
  });

  const [resultsTab, setResultsTab] = useState<'before-after' | 'dual-looks'>('before-after');
  const [generatedHistory, setGeneratedHistory] = useState<GeneratedLook[]>([]);

  const [lookbook, setLookbook] = useState<GeneratedLook[]>(() => {
    try {
      const saved = localStorage.getItem('ai_salon_lookbook');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const resultSectionRef = useRef<HTMLDivElement>(null);
  const shareSectionRef = useRef<HTMLDivElement>(null);

  // Helper to append a generated look to history
  const recordLookToHistory = (imageUrl: string) => {
    const newLook: GeneratedLook = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalImage: userImage || '',
      resultImage: imageUrl,
      mode: activeMode,
      hairStyleName: activeMode !== 'outfit' ? selectedHairstyle.name : undefined,
      hairColorName: activeMode !== 'outfit' ? selectedHairColor.name : undefined,
      outfitName: activeMode !== 'hair' ? (customClothingImage ? 'Trang phục tự chọn' : selectedOutfit.name) : undefined,
    };
    setGeneratedHistory((prev) => [newLook, ...prev]);
  };

  // Sync lookbook to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ai_salon_lookbook', JSON.stringify(lookbook));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [lookbook]);

  // Handle changing user photo
  const handleImageSelected = (imageDataUrl: string, detectedGender?: Gender) => {
    setUserImage(imageDataUrl);
    if (detectedGender) {
      setUserGender(detectedGender);
      // Auto switch suggested hairstyle for gender
      const matchingStyle = HAIR_STYLES.find((h) => h.gender === detectedGender);
      if (matchingStyle) setSelectedHairstyle(matchingStyle);
    }
    setResultImage(null);
    setAnalysisResult(null);
  };

  // Perform AI transformation
  const handleStartTransform = async () => {
    if (!userImage) return;

    setIsTransforming(true);
    setTransformError(null);
    setIsSimulatedResult(false);

    try {
      const payload: any = {
        image: userImage,
        mode: activeMode,
        gender: userGender,
        hairStyle: selectedHairstyle.name,
        hairColor: selectedHairColor.name,
        hairLength: selectedHairstyle.category === 'short' ? 'Ngắn' : selectedHairstyle.category === 'medium' ? 'Ngang vai' : 'Dài',
        outfitStyle: selectedOutfit.name,
        outfitColor: selectedOutfit.defaultColors,
        outfitItem: selectedOutfit.pieces,
        clothingImage: customClothingImage,
        customPrompt: [
          customHairNotes ? `Tóc: ${customHairNotes}` : '',
          customOutfitNotes ? `Đồ: ${customOutfitNotes}` : '',
          hairVolume !== 100 ? `Độ bồng tóc: ${hairVolume}%` : '',
        ].filter(Boolean).join('. '),
      };

      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setResultImage(data.imageUrl);
        recordLookToHistory(data.imageUrl);
        // Scroll smoothly to results
        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        // Fallback to high-fidelity visual simulation
        console.warn('API error, switching to interactive studio simulator:', data.error);
        const simImage = await generateSimulatedMakeover(userImage, {
          mode: activeMode,
          hairStyleName: selectedHairstyle.name,
          hairColorHex: selectedHairColor.hex,
          hairColorName: selectedHairColor.name,
          outfitName: customClothingImage ? 'Đồ tự chọn' : selectedOutfit.name,
          outfitColors: selectedOutfit.defaultColors,
        });

        setResultImage(simImage);
        recordLookToHistory(simImage);
        setIsSimulatedResult(true);
        if (data.isQuotaError) {
          setTransformError(data.error);
        } else {
          setTransformError(data.error || 'Đang hiển thị mô phỏng tạo mẫu Studio.');
        }

        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      // Fallback to interactive studio simulator
      const simImage = await generateSimulatedMakeover(userImage, {
        mode: activeMode,
        hairStyleName: selectedHairstyle.name,
        hairColorHex: selectedHairColor.hex,
        hairColorName: selectedHairColor.name,
        outfitName: selectedOutfit.name,
      });
      setResultImage(simImage);
      recordLookToHistory(simImage);
      setIsSimulatedResult(true);
      setTransformError('Đã tạo ảnh mô phỏng Studio (kết nối máy chủ bận).');
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } finally {
      setIsTransforming(false);
    }
  };

  // Run face analysis using Gemini 3.8
  const handleRunFaceAnalysis = async () => {
    if (!userImage) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/ai/analyze-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: userImage }),
      });

      const data = await response.json();
      if (response.ok && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setAnalysisError(data.error || 'Không thể phân tích ảnh lúc này. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setAnalysisError('Lỗi kết nối khi phân tích gương mặt. Vui lòng kiểm tra lại mạng.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save current look to Lookbook
  const handleSaveLook = () => {
    if (!resultImage || !userImage) return;
    const newLook: GeneratedLook = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalImage: userImage,
      resultImage: resultImage,
      mode: activeMode,
      hairStyleName: activeMode !== 'outfit' ? selectedHairstyle.name : undefined,
      hairColorName: activeMode !== 'outfit' ? selectedHairColor.name : undefined,
      outfitName: activeMode !== 'hair' ? (customClothingImage ? 'Đồ tự chọn' : selectedOutfit.name) : undefined,
    };
    setLookbook([newLook, ...lookbook]);
  };

  // Apply quick preset combos
  const handleApplyQuickCombo = (combo: {
    title: string;
    hairId: string;
    colorId: string;
    outfitId: string;
    gender: Gender;
  }) => {
    const hair = HAIR_STYLES.find((h) => h.id === combo.hairId) || HAIR_STYLES[0];
    const color = HAIR_COLORS.find((c) => c.id === combo.colorId) || HAIR_COLORS[0];
    const outfit = OUTFIT_PRESETS.find((o) => o.id === combo.outfitId) || OUTFIT_PRESETS[0];

    setSelectedHairstyle(hair);
    setSelectedHairColor(color);
    setSelectedOutfit(outfit);
    setUserGender(combo.gender);
    setActiveMode('both');
  };

  const isCurrentLookSaved = lookbook.some((item) => item.resultImage === resultImage);

  // Active generated look object
  const currentGeneratedLook: GeneratedLook = {
    id: 'current-active-look',
    timestamp: Date.now(),
    originalImage: userImage || '',
    resultImage: resultImage || '',
    mode: activeMode,
    hairStyleName: activeMode !== 'outfit' ? selectedHairstyle.name : undefined,
    hairColorName: activeMode !== 'outfit' ? selectedHairColor.name : undefined,
    outfitName: activeMode !== 'hair' ? (customClothingImage ? 'Trang phục tự chọn' : selectedOutfit.name) : undefined,
  };

  // Combine current look, generated history, and lookbook for A/B comparison without duplicates
  const allAvailableLooks: GeneratedLook[] = [
    ...(resultImage ? [currentGeneratedLook] : []),
    ...generatedHistory,
    ...lookbook,
  ].filter((item, index, self) => index === self.findIndex((t) => t.resultImage === item.resultImage));

  // Synthesize an alternate variant hairstyle if user has only 1 look, so A/B comparison is immediately testable
  useEffect(() => {
    if (resultImage && userImage && generatedHistory.length === 0) {
      const alternateStyle =
        userGender === 'male'
          ? (selectedHairstyle.id === 'korean-two-block' ? HAIR_STYLES[9] : HAIR_STYLES[7]) // Gentleman Side Part or Two Block
          : (selectedHairstyle.id === 'korean-layer-curtain' ? HAIR_STYLES[1] : HAIR_STYLES[0]); // French Chic Bob or Korean Layer
      const alternateColor =
        selectedHairColor.id === 'milk-tea-brown' ? HAIR_COLORS[4] : HAIR_COLORS[2]; // Ash Gray or Milk Tea Brown

      generateSimulatedMakeover(userImage, {
        mode: 'hair',
        hairStyleName: alternateStyle.name,
        hairColorHex: alternateColor.hex,
        hairColorName: alternateColor.name,
      }).then((simImg) => {
        const variantLook: GeneratedLook = {
          id: 'variant-sample-b',
          timestamp: Date.now() - 1000,
          originalImage: userImage,
          resultImage: simImg,
          mode: 'hair',
          hairStyleName: alternateStyle.name,
          hairColorName: alternateColor.name,
        };
        setGeneratedHistory([variantLook]);
      });
    }
  }, [resultImage, userImage, userGender, selectedHairstyle.id, selectedHairColor.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
      {/* Navbar */}
      <Navbar
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        onOpenAnalysis={() => setIsAnalysisModalOpen(true)}
        lookbookCount={lookbook.length}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        onOpenHelp={(tab) => handleOpenHelp(tab || 'guide')}
        onOpenPricing={() => setIsPricingOpen(true)}
        currentPlan={userPlan}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Top Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-violet-950/40 via-slate-900 to-fuchsia-950/40 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Công nghệ AI Thử Kiểu Tóc & Trang Phục Chân Thực 100%
              </div>
              {userPlan === 'vip' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300">
                  👑 Gói Salon VIP (Không Giới Hạn)
                </div>
              ) : userPlan === 'pro' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-xs font-bold text-violet-300">
                  ⭐ Gói Cá Nhân Pro Stylist
                </div>
              ) : userPlan === 'trial' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-xs font-bold text-cyan-300">
                  ⚡ Gói Trải Nghiệm 30 Lượt
                </div>
              ) : (
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-colors"
                >
                  <span>Gói Miễn Phí (3 lượt/ngày)</span>
                  <span className="text-[10px] underline font-bold">Nâng Cấp VIP MBBank →</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Biến Hóa Diện Mạo Hoàn Hảo{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                Chỉ Trong Vài Giây
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Chọn ảnh của bạn, thỏa sức thử hàng chục kiểu tóc hot trend Hàn Quốc, màu nhuộm salon cao cấp và ướm thử những bộ cánh lộng lẫy trước khi quyết định cắt tóc hay mua sắm!
            </p>

            {/* Quick Combo Presets */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Combo Hot 1-Click:
              </span>

              <button
                onClick={() =>
                  handleApplyQuickCombo({
                    title: 'Nàng Thơ Áo Dài',
                    hairId: 'mermaid-waves',
                    colorId: 'jet-black',
                    outfitId: 'vietnamese-ao-dai-modern',
                    gender: 'female',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-pink-500/50 transition-colors"
              >
                🌸 Nàng Thơ Áo Dài
              </button>

              <button
                onClick={() =>
                  handleApplyQuickCombo({
                    title: 'Công Sở Hàn Quốc',
                    hairId: 'korean-layer-curtain',
                    colorId: 'milk-tea-brown',
                    outfitId: 'office-blazer-chic',
                    gender: 'female',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-violet-500/50 transition-colors"
              >
                💼 Nữ Công Sở Chic
              </button>

              <button
                onClick={() =>
                  handleApplyQuickCombo({
                    title: 'Soái Ca Hàn Quốc',
                    hairId: 'korean-two-block',
                    colorId: 'chocolate-brown',
                    outfitId: 'korean-street-minimalist',
                    gender: 'male',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-indigo-500/50 transition-colors"
              >
                ✨ Soái Ca Two-Block
              </button>

              <button
                onClick={() =>
                  handleApplyQuickCombo({
                    title: 'Doanh Nhân Lịch Lãm',
                    hairId: 'gentleman-side-part',
                    colorId: 'jet-black',
                    outfitId: 'executive-suit-gent',
                    gender: 'male',
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-amber-500/50 transition-colors"
              >
                👔 Quý Ông Executive
              </button>
            </div>
          </div>

          {/* Decorative background light bubbles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Configuration Workspace (Step 1 & Step 2) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image Input (Step 1) */}
          <div className="lg:col-span-5 space-y-4">
            <ImageUploader
              currentImage={userImage}
              onImageSelected={handleImageSelected}
              onClearImage={() => {
                setUserImage(null);
                setResultImage(null);
              }}
            />

            {/* Quick Stylist Face Scan Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Chưa biết mặt mình hợp kiểu nào?</p>
                  <p className="text-[11px] text-slate-400">Để AI đo góc mặt và tìm kiểu tóc tôn bạn nhất</p>
                </div>
              </div>
              <button
                onClick={() => setIsAnalysisModalOpen(true)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1"
              >
                <span>Tư vấn ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Style Controls (Step 2) */}
          <div className="lg:col-span-7 space-y-4">
            {activeMode === 'hair' && (
              <HairstyleSelector
                selectedStyle={selectedHairstyle}
                onSelectStyle={(s) => setSelectedHairstyle(s)}
                selectedColor={selectedHairColor}
                onSelectColor={(c) => setSelectedHairColor(c)}
                hairVolume={hairVolume}
                onChangeVolume={(v) => setHairVolume(v)}
                customNotes={customHairNotes}
                onChangeNotes={(n) => setCustomHairNotes(n)}
              />
            )}

            {activeMode === 'outfit' && (
              <OutfitSelector
                selectedOutfit={selectedOutfit}
                onSelectOutfit={(o) => setSelectedOutfit(o)}
                customClothingImage={customClothingImage}
                onSelectCustomClothing={(img) => setCustomClothingImage(img)}
                customOutfitNotes={customOutfitNotes}
                onChangeCustomOutfitNotes={(n) => setCustomOutfitNotes(n)}
              />
            )}

            {activeMode === 'both' && (
              <div className="space-y-4">
                <HairstyleSelector
                  selectedStyle={selectedHairstyle}
                  onSelectStyle={(s) => setSelectedHairstyle(s)}
                  selectedColor={selectedHairColor}
                  onSelectColor={(c) => setSelectedHairColor(c)}
                  hairVolume={hairVolume}
                  onChangeVolume={(v) => setHairVolume(v)}
                  customNotes={customHairNotes}
                  onChangeNotes={(n) => setCustomHairNotes(n)}
                />

                <OutfitSelector
                  selectedOutfit={selectedOutfit}
                  onSelectOutfit={(o) => setSelectedOutfit(o)}
                  customClothingImage={customClothingImage}
                  onSelectCustomClothing={(img) => setCustomClothingImage(img)}
                  customOutfitNotes={customOutfitNotes}
                  onChangeCustomOutfitNotes={(n) => setCustomOutfitNotes(n)}
                />
              </div>
            )}

            {/* Main Action Callout Button */}
            <div className="pt-2">
              <button
                onClick={handleStartTransform}
                disabled={!userImage || isTransforming}
                className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base tracking-wide uppercase transition-all shadow-xl flex items-center justify-center gap-3 ${
                  !userImage
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : isTransforming
                    ? 'bg-violet-700 text-white cursor-wait animate-pulse'
                    : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white shadow-violet-600/35 active:scale-[0.99]'
                }`}
              >
                {isTransforming ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>AI Đang Xử Lý Kiểu Tóc & Trang Phục...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-amber-300" />
                    <span>
                      {activeMode === 'hair' && 'Áp Dụng Kiểu Tóc & Màu Nhuộm AI'}
                      {activeMode === 'outfit' && 'Thử Trang Phục Ảo Này Lên Người'}
                      {activeMode === 'both' && 'Tạo Makeover Toàn Diện (Tóc + Trang Phục)'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {!userImage && (
                <p className="text-center text-xs text-slate-500 mt-2">
                  Vui lòng tải ảnh chân dung hoặc chọn một người mẫu mẫu ở Bước 1
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Results & Comparison Section */}
        {resultImage && userImage && (
          <section ref={resultSectionRef} className="pt-4 scroll-mt-24 space-y-4">
            {transformError && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{transformError}</span>
              </div>
            )}

            {/* Results Mode Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setResultsTab('before-after')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    resultsTab === 'before-after'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Đối Chiếu Trước & Sau (Gốc vs AI)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResultsTab('dual-looks')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    resultsTab === 'dual-looks'
                      ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white shadow-md shadow-pink-600/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Columns2 className="w-4 h-4 text-pink-300" />
                  <span>So Sánh 2 Kiểu Tóc (Look A vs Look B)</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-200 text-[10px] font-bold border border-pink-500/30">
                    Split-Screen
                  </span>
                </button>
              </div>

              <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2 pr-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{allAvailableLooks.length} kiểu tóc có sẵn để so sánh</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Comparison Slider OR Dual Look Comparison */}
              <div className="lg:col-span-7 xl:col-span-8">
                {resultsTab === 'before-after' ? (
                  <ComparisonSlider
                    originalImage={userImage}
                    resultImage={resultImage}
                    hairStyleName={activeMode !== 'outfit' ? selectedHairstyle.name : undefined}
                    hairColorName={activeMode !== 'outfit' ? selectedHairColor.name : undefined}
                    outfitName={activeMode !== 'hair' ? (customClothingImage ? 'Trang phục tự chọn' : selectedOutfit.name) : undefined}
                    onSaveToLookbook={handleSaveLook}
                    isSaved={isCurrentLookSaved}
                    onOpenShare={() => {
                      shareSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onOpenPricing={() => setIsPricingOpen(true)}
                  />
                ) : (
                  <DualLookComparison
                    currentLook={currentGeneratedLook}
                    allLooks={allAvailableLooks}
                    onSelectActiveLook={(look) => {
                      setResultImage(look.resultImage);
                      if (look.hairStyleName) {
                        const matched = HAIR_STYLES.find((h) => h.name === look.hairStyleName);
                        if (matched) setSelectedHairstyle(matched);
                      }
                      if (look.hairColorName) {
                        const matchedColor = HAIR_COLORS.find((c) => c.name === look.hairColorName);
                        if (matchedColor) setSelectedHairColor(matchedColor);
                      }
                    }}
                    onRequestNewHairstyle={() => {
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                  />
                )}
              </div>

              {/* Right Column: Social Sharing Component */}
              <div ref={shareSectionRef} className="lg:col-span-5 xl:col-span-4 scroll-mt-24">
                <SocialSharePanel
                  originalImage={userImage}
                  resultImage={resultImage}
                  hairStyleName={activeMode !== 'outfit' ? selectedHairstyle.name : undefined}
                  hairColorName={activeMode !== 'outfit' ? selectedHairColor.name : undefined}
                  outfitName={activeMode !== 'hair' ? (customClothingImage ? 'Trang phục tự chọn' : selectedOutfit.name) : undefined}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} AI Studio Thử Tóc & Quần Áo Ảo • Powered by Gemini 3.1 & 3.8
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsPricingOpen(true)} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1">
              <span>Bảng Giá Gói Dịch Vụ (MB Bank)</span>
            </button>
            <button onClick={() => handleOpenHelp('guide')} className="hover:text-white transition-colors">
              Hướng dẫn (Help)
            </button>
            <button onClick={() => handleOpenHelp('update')} className="hover:text-white transition-colors">
              Cập nhật (v2.4)
            </button>
            <button onClick={() => setIsAnalysisModalOpen(true)} className="hover:text-white transition-colors">
              Tư vấn dáng mặt
            </button>
            <button onClick={() => setIsLookbookOpen(true)} className="hover:text-white transition-colors">
              Lookbook ({lookbook.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentPlan={userPlan}
        onUpgradePlan={(plan) => {
          setUserPlan(plan);
          try {
            localStorage.setItem('ai_salon_user_plan', plan);
          } catch {
            // ignore
          }
        }}
      />

      <FaceAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        userImage={userImage}
        analysisResult={analysisResult}
        onRunAnalysis={handleRunFaceAnalysis}
        isLoading={isAnalyzing}
        error={analysisError}
        onApplyRecommendation={(style, color) => {
          setSelectedHairstyle(style);
          setSelectedHairColor(color);
          setActiveMode('hair');
        }}
      />

      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        lookbook={lookbook}
        onSelectLook={(look) => {
          if (look.originalImage) setUserImage(look.originalImage);
          setResultImage(look.resultImage);
          setActiveMode(look.mode);
        }}
        onDeleteLook={(id) => setLookbook(lookbook.filter((item) => item.id !== id))}
        onClearAll={() => setLookbook([])}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTab={helpModalTab}
        onOpenPricing={() => setIsPricingOpen(true)}
      />
    </div>
  );
}
