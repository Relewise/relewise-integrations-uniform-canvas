import axios from 'axios';
import { RelewiseCompositionSettings } from './relewise.types';

export const getRecommendations = async ({
  apiKey,
  datasetId,
  settings,
  dataKeys,
}: {
  apiKey: string;
  datasetId: string;
  settings: RelewiseCompositionSettings;
  dataKeys: string[];
}) => {
  const filters: any[] = [];

  if (settings.filters.brand) {
    filters.push({
      $type: 'Relewise.Client.Requests.Filters.BrandIdFilter, Relewise.Client',
      BrandIds: [settings.filters.brand],
      TypeName: 'BrandIdFilter',
    });
  }

  const body = {
    BasedOn: settings.settings.basedOn,
    SinceMinutesAgo: settings.settings.sinceDaysAgo * 24 * 60,
    Settings: {
      NumberOfRecommendations: settings.settings.numberOfRecommendations,
      AllowFillIfNecessaryToReachNumberOfRecommendations:
        settings.settings.allowFillIfNecessaryToReachNumberOfRecommendations,
      AllowReplacingOfRecentlyShownRecommendations:
        settings.settings.allowReplacingOfRecentlyShownRecommendations,
      RecommendVariant: settings.settings.recommendVariant,
      SelectedProductProperties: {
        DisplayName: true,
        Pricing: true,
        Brand: true,
        DataKeys: dataKeys,
      },
    },
    Language: {
      Value: 'da-dk',
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
    DisplayedAtLocationType: 'uniform',
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
