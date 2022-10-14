import { Recommender, PopularProductsBuilder, PersonalProductRecommendationBuilder, PopularContentsBuilder, PersonalContentRecommendationBuilder } from '@relewise/client';

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getProductRecommendations = ({ apiKey, datasetId, settings, productDataKeys, language, currency, uniformSlugName, userFactory }) => __awaiter$1(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const defaultSettings = {
        currency: currency,
        displayedAtLocation: 'Uniform: ' + uniformSlugName,
        language: language,
        user: userFactory(),
    };
    const recommender = new Recommender(datasetId, apiKey);
    const isPopularProductsRequest = settings.type === "PopularProductsRequest";
    if (isPopularProductsRequest) {
        const builder = new PopularProductsBuilder(defaultSettings)
            .basedOn('MostPurchased')
            .sinceMinutesAgo(settings.settings.sinceDaysAgo * 24 * 60);
        baseProductSettings(builder, settings, productDataKeys);
        const request = builder.build();
        return (_b = (_a = (yield recommender.recommendPopularProducts(request))) === null || _a === void 0 ? void 0 : _a.recommendations) !== null && _b !== void 0 ? _b : [];
    }
    else {
        const builder = new PersonalProductRecommendationBuilder(defaultSettings);
        baseProductSettings(builder, settings, productDataKeys);
        const request = builder.build();
        return (_d = (_c = (yield recommender.recommendPersonalProducts(request))) === null || _c === void 0 ? void 0 : _c.recommendations) !== null && _d !== void 0 ? _d : [];
    }
});
const getContentRecommendations = ({ apiKey, datasetId, settings, contentDataKeys, language, currency, uniformSlugName, userFactory, }) => __awaiter$1(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    const defaultSettings = {
        currency: currency,
        displayedAtLocation: 'Uniform: ' + uniformSlugName,
        language: language,
        user: userFactory(),
    };
    const recommender = new Recommender(datasetId, apiKey);
    const isPopularContentsRequest = settings.type === "PopularContentsRequest";
    if (isPopularContentsRequest) {
        const request = new PopularContentsBuilder(defaultSettings)
            .setNumberOfRecommendations(settings.settings.numberOfRecommendations)
            .allowFillIfNecessaryToReachNumberOfRecommendations(settings.settings.allowFillIfNecessaryToReachNumberOfRecommendations)
            .allowReplacingOfRecentlyShownRecommendations(settings.settings.allowReplacingOfRecentlyShownRecommendations)
            .setSelectedContentProperties({
            DisplayName: true,
            DataKeys: contentDataKeys,
        })
            .build();
        return (_f = (_e = (yield recommender.recommendPopularContents(request))) === null || _e === void 0 ? void 0 : _e.recommendations) !== null && _f !== void 0 ? _f : [];
    }
    else {
        const request = new PersonalContentRecommendationBuilder(defaultSettings)
            .setNumberOfRecommendations(settings.settings.numberOfRecommendations)
            .allowFillIfNecessaryToReachNumberOfRecommendations(settings.settings.allowFillIfNecessaryToReachNumberOfRecommendations)
            .allowReplacingOfRecentlyShownRecommendations(settings.settings.allowReplacingOfRecentlyShownRecommendations)
            .setSelectedContentProperties({
            DisplayName: true,
            DataKeys: contentDataKeys,
        })
            .build();
        return (_h = (_g = (yield recommender.recommendPersonalContents(request))) === null || _g === void 0 ? void 0 : _g.recommendations) !== null && _h !== void 0 ? _h : [];
    }
});
function baseProductSettings(builder, settings, productDataKeys) {
    builder
        .setNumberOfRecommendations(settings.settings.numberOfRecommendations)
        .allowFillIfNecessaryToReachNumberOfRecommendations(settings.settings.allowFillIfNecessaryToReachNumberOfRecommendations)
        .allowReplacingOfRecentlyShownRecommendations(settings.settings.allowReplacingOfRecentlyShownRecommendations)
        .recommendVariant(settings.settings.recommendVariant)
        .setSelectedProductProperties({
        DisplayName: true,
        Pricing: true,
        Brand: true,
        DataKeys: productDataKeys,
    })
        .filters(f => {
        if (settings.filters.brand && settings.filters.brand !== '') {
            f.addBrandIdFilter([settings.filters.brand]);
        }
    });
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const RELEWISE_CANVAS_PARAMETER_TYPES = Object.freeze(['relewiseProductRecommendation', 'relewiseContentRecommendation']);
function parameterIsProductRecommendationEntry(parameter) {
    var _a;
    const test = parameter;
    return Boolean(test.type === RELEWISE_CANVAS_PARAMETER_TYPES[0] && !!((_a = test.value) === null || _a === void 0 ? void 0 : _a.type));
}
function parameterIsContentRecommendationEntry(parameter) {
    var _a;
    const test = parameter;
    return Boolean(test.type === RELEWISE_CANVAS_PARAMETER_TYPES[1] && !!((_a = test.value) === null || _a === void 0 ? void 0 : _a.type));
}
const createRelewiseEnhancer = ({ apiKey, datasetId, dataKeys, language, currency, userFactory }) => {
    return {
        enhanceOne: function RelewiseEnhancer({ parameter, parameterName, component, context }) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const { value: settings } = parameter;
                const uniformSlugName = parameter.type;
                if (parameterIsProductRecommendationEntry(parameter)) {
                    const productDataKeys = ((_a = dataKeys === null || dataKeys === void 0 ? void 0 : dataKeys.products) !== null && _a !== void 0 ? _a : []);
                    const recommendations = yield getProductRecommendations({
                        apiKey,
                        datasetId,
                        settings,
                        productDataKeys,
                        language,
                        currency,
                        uniformSlugName,
                        userFactory
                    });
                    return recommendations;
                }
                if (parameterIsContentRecommendationEntry(parameter)) {
                    const contentDataKeys = ((_b = dataKeys === null || dataKeys === void 0 ? void 0 : dataKeys.contents) !== null && _b !== void 0 ? _b : []);
                    const recommendations = yield getContentRecommendations({
                        apiKey,
                        datasetId,
                        settings,
                        contentDataKeys,
                        language,
                        currency,
                        uniformSlugName,
                        userFactory
                    });
                    return recommendations;
                }
            });
        },
    };
};

export { RELEWISE_CANVAS_PARAMETER_TYPES, createRelewiseEnhancer };
