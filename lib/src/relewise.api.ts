import axios from 'axios';
import { RelewiseCompositionSettings } from './relewise.types';

export const getProductRecommendations = async ({
  apiKey,
  datasetId,
  settings,
  productDataKeys,
  language,
  uniformSlugName
}: {
  apiKey: string;
  datasetId: string;
  settings: RelewiseCompositionSettings;
  productDataKeys: string[];
  language: string;
  uniformSlugName: string;
}) => {
  const filters: any[] = [];

  if (settings.filters.brand && settings.filters.brand !== '') {
    filters.push({
      $type: 'Relewise.Client.Requests.Filters.BrandIdFilter, Relewise.Client',
      BrandIds: [settings.filters.brand],
      TypeName: 'BrandIdFilter',
    });
  }

  const isPopularProductsRequest = settings.type === "PopularProductsRequest";

  const body = {
    ...(isPopularProductsRequest && {
      BasedOn: 'MostPurchased',
      SinceMinutesAgo: settings.settings.sinceDaysAgo * 24 * 60
    }),
    Settings: {
      NumberOfRecommendations: settings.settings.numberOfRecommendations,
      AllowFillIfNecessaryToReachNumberOfRecommendations: settings.settings.allowFillIfNecessaryToReachNumberOfRecommendations,
      AllowReplacingOfRecentlyShownRecommendations: settings.settings.allowReplacingOfRecentlyShownRecommendations,
      RecommendVariant: settings.settings.recommendVariant,
      SelectedProductProperties: {
        DisplayName: true,
        Pricing: true,
        Brand: true,
        DataKeys: productDataKeys,
      },
    },
    Language: {
      Value: language,
    },
    User: {
      Classifications: {},
      Identifiers: {},
      Data: {},
    },
    RelevanceModifiers: {},
    Filters: {
      Items: filters,
    },
    DisplayedAtLocationType: 'Uniform: '+ uniformSlugName,
  };

  const url = `https://api.relewise.com/${datasetId}/v1/${settings.type}`;
  const apiKeyHeader = `APIKey ${apiKey}`;

  return (
    (
      await axios.post(url, body, {
        withCredentials: false,
        method: 'POST',
        headers: {
          Authorization: apiKeyHeader,
          'Content-Type': 'application/json',
        },
      })
    )?.data?.recommendations ?? []
  );
};

export const getContentRecommendations = async ({
  apiKey,
  datasetId,
  settings,
  contentDataKeys,
  language,
  uniformSlugName,
}: {
  apiKey: string;
  datasetId: string;
  settings: RelewiseCompositionSettings;
  contentDataKeys: string[];
  language: string;
  uniformSlugName: string;
}) => {
  const filters: any[] = [];

  const body = {
    BasedOn: settings.settings.basedOn,
    SinceMinutesAgo: settings.settings.sinceDaysAgo * 24 * 60,
    Settings: {
      NumberOfRecommendations: settings.settings.numberOfRecommendations,
      AllowFillIfNecessaryToReachNumberOfRecommendations: settings.settings.allowFillIfNecessaryToReachNumberOfRecommendations,
      AllowReplacingOfRecentlyShownRecommendations: settings.settings.allowReplacingOfRecentlyShownRecommendations,
      RecommendVariant: settings.settings.recommendVariant,
      SelectedContentProperties: {
        DisplayName: true,
        DataKeys: contentDataKeys,
      },
    },
    Language: {
      Value: 'en-us',
    },
    User: {
      Classifications: {},
      Identifiers: {},
      Data: {},
    },
    RelevanceModifiers: {},
    Filters: {
      Items: filters,
    },
    DisplayedAtLocationType: 'Uniform: ' + uniformSlugName,
  };

   const url = `https://api.relewise.com/${datasetId}/v1/${settings.type}`;
   const apiKeyHeader = `APIKey ${apiKey}`;

  return (
    (
      await axios.post(url, body, {
        withCredentials: false,
        method: 'POST',
        headers: {
          Authorization: apiKeyHeader,
          'Content-Type': 'application/json',
        },
      })
    )?.data?.recommendations ?? []
  );
};
