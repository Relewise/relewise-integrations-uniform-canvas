import { getProductRecommendations, getContentRecommendations } from "./relewise.api";
import { RelewiseCompositionSettings } from "./relewise.types";
import { ComponentParameter, ComponentParameterEnhancer } from "@uniformdev/canvas";

interface RelewiseEnhancerConfig {
  apiKey: string;
  datasetId: string;
  dataKeys?: {
    products?: string[];
    contents?: string[];
  }
  language: string;
}

export interface EditorValue {
  type: string
}

export const RELEWISE_CANVAS_PARAMETER_TYPES = Object.freeze(['relewiseProductRecommendation', 'relewiseContentRecommendation']);

function parameterIsProductRecommendationEntry(
  parameter: ComponentParameter<any>
): parameter is ComponentParameter<EditorValue> {
  const test = parameter as ComponentParameter<EditorValue>;
  return Boolean(test.type === RELEWISE_CANVAS_PARAMETER_TYPES[0] && !!test.value?.type);
}

function parameterIsContentRecommendationEntry(
  parameter: ComponentParameter<any>
): parameter is ComponentParameter<EditorValue> {
  const test = parameter as ComponentParameter<EditorValue>;
  return Boolean(test.type === RELEWISE_CANVAS_PARAMETER_TYPES[1] && !!test.value?.type);
}

export const createRelewiseEnhancer = ({
  apiKey,
  datasetId,
  dataKeys,
  language
}: RelewiseEnhancerConfig): ComponentParameterEnhancer => {
  return {
    enhanceOne: async function RelewiseEnhancer({ parameter, parameterName, component, context }: any) {
      const { value: settings }: { value: RelewiseCompositionSettings } = parameter;
      const uniformSlugName: string = component._slug;
      
      if (parameterIsProductRecommendationEntry(parameter)) {

        const productDataKeys: string[] = (dataKeys?.products ?? []);
        const recommendations = await getProductRecommendations({
          apiKey,
          datasetId,
          settings,
          productDataKeys,
          language,
          uniformSlugName,
        });

        return recommendations;
      }

      if (parameterIsContentRecommendationEntry(parameter)) {

        const contentDataKeys: string[] = (dataKeys?.contents ?? []);
        const recommendations = await getContentRecommendations({
          apiKey,
          datasetId,
          settings,
          contentDataKeys,
          language,
          uniformSlugName
        });

        return recommendations;
      }
    },
  }
};
