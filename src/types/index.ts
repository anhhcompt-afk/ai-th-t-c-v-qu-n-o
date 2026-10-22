export type TransformMode = 'hair' | 'outfit' | 'both';

export type Gender = 'female' | 'male' | 'unisex';

export interface HairStylePreset {
  id: string;
  name: string;
  nameEn: string;
  gender: Gender;
  category: 'short' | 'medium' | 'long' | 'special';
  description: string;
  promptDescription: string;
  recommendedFaceShapes: string[];
  iconUrl?: string;
  tags: string[];
}

export interface HairColorPreset {
  id: string;
  name: string;
  nameEn: string;
  hex: string;
  secondaryHex?: string;
  undertone: 'warm' | 'cool' | 'neutral';
  description: string;
  promptDescription: string;
}

export interface OutfitPreset {
  id: string;
  name: string;
  nameEn: string;
  category: 'office' | 'street' | 'party' | 'traditional' | 'resort' | 'vintage' | 'winter';
  gender: Gender;
  description: string;
  pieces: string;
  defaultColors: string;
  promptDescription: string;
  palette: string[];
  weatherSuitability?: 'cold' | 'hot' | 'pleasant' | 'rain' | 'all';
  tempRange?: string;
}

export interface WeatherInfo {
  location: string;
  temperature: string;
  condition: string;
  weatherType: 'cold' | 'hot' | 'rain' | 'pleasant';
  feelsLike?: string;
  humidity?: string;
  wind?: string;
  outfitAdvice: string;
  recommendedCategories?: string[];
  searchSources?: { uri: string; title: string }[];
}

export interface SampleModel {
  id: string;
  name: string;
  gender: Gender;
  description: string;
  imageUrl: string;
  faceShape: string;
}

export interface FaceAnalysisResult {
  faceShape: string;
  faceShapeDesc: string;
  skinUndertone: string;
  skinToneDesc: string;
  hairRecommendations: {
    name: string;
    reason: string;
    tag: string;
    colorSuggestion: string;
    hex: string;
  }[];
  outfitRecommendations: {
    style: string;
    pieces: string;
    colorPalette: string[];
    fitTip: string;
  }[];
  overallVerdict: string;
}

export interface GeneratedLook {
  id: string;
  timestamp: number;
  originalImage: string;
  resultImage: string;
  mode: TransformMode;
  hairStyleName?: string;
  hairColorName?: string;
  outfitName?: string;
  notes?: string;
}
