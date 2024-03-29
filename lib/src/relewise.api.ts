import { PersonalContentRecommendationBuilder, PersonalProductRecommendationBuilder, PopularContentsBuilder, PopularProductsBuilder, ProductSettingsRecommendationBuilder, Recommender, SelectedContentPropertiesSettings, SelectedProductPropertiesSettings, Settings, User } from '@relewise/client';
import { RecommendationRequestInterceptorContext, RelewiseCompositionSettings } from './relewise.types';

export const getProductRecommendations = async ({
  recommender,
  settings,
  productDataKeys,
  language,
  currency,
  uniformSlugName,
  userFactory,
  useRecommendationRequestInterceptor
}: {
  recommender: Recommender;
  settings: RelewiseCompositionSettings;
  productDataKeys: string[];
  language: string;
  currency: string;
  uniformSlugName: string;
  userFactory: () => User;
  useRecommendationRequestInterceptor?: (context: RecommendationRequestInterceptorContext) => void;
}) => {
  const defaultSettings: Settings = {
    currency: currency,
    displayedAtLocation: 'Uniform: ' + uniformSlugName,
    language: language,
    user: userFactory(),
  };

  const isPopularProductsRequest = settings.type === "PopularProductsRequest";

  if (isPopularProductsRequest) {
    const builder = new PopularProductsBuilder(defaultSettings)
      .basedOn('MostPurchased')
      .sinceMinutesAgo(settings.settings.sinceDaysAgo * 24 * 60);
    
      baseProductSettings(builder, settings, productDataKeys);

    if (useRecommendationRequestInterceptor) useRecommendationRequestInterceptor({ builder, recommendationType: 'PopularProducts'});

    const request = builder.build();

    return (await recommender.recommendPopularProducts(request))?.recommendations ?? [];
  } else {
    const builder = new PersonalProductRecommendationBuilder(defaultSettings);
    baseProductSettings(builder, settings, productDataKeys);

    if (useRecommendationRequestInterceptor) useRecommendationRequestInterceptor({ builder, recommendationType: 'PersonalProducts'});

    const request = builder.build();

    return (await recommender.recommendPersonalProducts(request))?.recommendations ?? [];
  }
};

export const getContentRecommendations = async ({
  recommender,
  settings,
  contentDataKeys,
  language,
  currency,
  uniformSlugName,
  userFactory,
  useRecommendationRequestInterceptor
}: {
  recommender: Recommender;
  settings: RelewiseCompositionSettings;
  contentDataKeys: string[];
  language: string;
  currency: string;
  uniformSlugName: string;
  userFactory: () => User;
  useRecommendationRequestInterceptor?: (context: RecommendationRequestInterceptorContext) => void;
}) => {

  const defaultSettings: Settings = {
    currency: currency,
    displayedAtLocation: 'Uniform: ' + uniformSlugName,
    language: language,
    user: userFactory(),
  };

  const isPopularContentsRequest = settings.type === "PopularContentsRequest";
  if (isPopularContentsRequest) {
    const builder = new PopularContentsBuilder(defaultSettings)
      .setNumberOfRecommendations(settings.settings.numberOfRecommendations)
      .setSelectedContentProperties({
        displayName: true,
        dataKeys: contentDataKeys,
      } as SelectedContentPropertiesSettings);
      
      if (useRecommendationRequestInterceptor) useRecommendationRequestInterceptor({ builder, recommendationType: 'PopularContents'});

      const request = builder.build();

    return (await recommender.recommendPopularContents(request))?.recommendations ?? [];
  } else {
    const builder = new PersonalContentRecommendationBuilder(defaultSettings)
      .setNumberOfRecommendations(settings.settings.numberOfRecommendations)
      .setSelectedContentProperties({
        displayName: true,
        dataKeys: contentDataKeys,
      } as SelectedContentPropertiesSettings);
      
      if (useRecommendationRequestInterceptor) useRecommendationRequestInterceptor({ builder, recommendationType: 'PersonalContents'});

      const request = builder.build();
    return (await recommender.recommendPersonalContents(request))?.recommendations ?? [];
  }
};

function baseProductSettings(builder: ProductSettingsRecommendationBuilder, settings: RelewiseCompositionSettings, productDataKeys: string[]) {
  builder
    .setNumberOfRecommendations(settings.settings.numberOfRecommendations)
    .recommendVariant(settings.settings.recommendVariant)
    .setSelectedProductProperties({
      displayName: true,
      pricing: true,
      brand: true,
      dataKeys: productDataKeys,
    } as SelectedProductPropertiesSettings)
    .filters(f => {
      if (settings.filters.brand && settings.filters.brand !== '') {
        f.addBrandIdFilter([settings.filters.brand])
      }
    })
}