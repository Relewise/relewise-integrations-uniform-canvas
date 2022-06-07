export interface RelewiseCompositionSettings {
  type: string;
  filters: {
    brand: string;
  };
  settings: {
    basedOn?: 'MostPurchased' | 'MostViewed';
    sinceDaysAgo: number;
    recommendVariant: boolean;
    numberOfRecommendations: number;
    allowReplacingOfRecentlyShownRecommendations: boolean;
    allowFillIfNecessaryToReachNumberOfRecommendations: boolean;
  };
}

export interface RelewiseComposition {
  type: string;
  value: RelewiseCompositionSettings;
}

export type EnhancedRelewiseComposition = RelewiseComposition & { data: { recommendations: any[] }}