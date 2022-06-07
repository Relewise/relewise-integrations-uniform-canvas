import { getProductRecommendations } from "./relewise.api";
import { RelewiseCompositionSettings } from "./relewise.types";
import { ComponentParameter } from "@uniformdev/canvas";

interface RelewiseEnhancerConfig {
  apiKey: string;
  datasetId: string;
  dataKeys: string[]; // Extra product fields you wish returned thats stored in the Data field
  language: string;
}

export interface EditorValue {
  type: string
}

export const RELEWISE_CANVAS_PARAMETER_TYPES = Object.freeze(['relewiseProductRecommendation', 'relewiseContentRecommendation']);

function parameterIsEntry(
  parameter: ComponentParameter<any>
): parameter is ComponentParameter<EditorValue> {
  const test = parameter as ComponentParameter<EditorValue>;
  return Boolean(test.type === RELEWISE_CANVAS_PARAMETER_TYPES[0] && !!test.value?.type);
}

export const createRelewiseEnhancer = ({
  apiKey,
  datasetId,
  dataKeys,
  language
}: RelewiseEnhancerConfig) => {
  return {
    enhanceOne: async function RelewiseEnhancer({ parameter, parameterName, component, context }: any) {
      const { value: settings }: { value: RelewiseCompositionSettings } = parameter;

      if (parameterIsEntry(parameter)) {
        const recommendations = await getProductRecommendations({
          apiKey,
          datasetId,
          settings,
          dataKeys,
          language
        });

        return recommendations;
      }
    },
  }
};
