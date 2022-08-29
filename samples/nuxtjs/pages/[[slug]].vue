<script lang="ts" setup>
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  CompositionGetListResponse,
  enhance,
  EnhancerBuilder,
  type ComponentInstance,
} from "@uniformdev/canvas";
import { createRelewiseEnhancer, RELEWISE_CANVAS_PARAMETER_TYPES } from '@relewise/uniform-canvas';

const { $useComposition, $uniformCanvasClient, $preview, $config } = useNuxtApp();

const enhancer = createRelewiseEnhancer({
  apiKey: $config.public.relewise.apiKey,
  datasetId: $config.public.relewise.datasetId,
  dataKeys: { products: ['ImageUrl', 'ShortDescription'], contents: ['url'] },
  language: 'en-US'
});

console.log($uniformCanvasClient)
async function doEnhance(composition: ComponentInstance) {
   const enhancedComposition = { ...composition };

   try {
      await enhance({
        composition: enhancedComposition,
        enhancers: new EnhancerBuilder().parameterType(RELEWISE_CANVAS_PARAMETER_TYPES, enhancer),
        context: { preview: $preview }
      });
    }
    catch (e) {
      console.log(e);
    }

  return enhancedComposition;
}

const { slug: slugWithoutSlash } = useRoute().params;

const slug = `/${slugWithoutSlash}`;


const { data } = await $useComposition({ slug });

const composition = await doEnhance(data.value.composition);

// Used only for routing!
const { compositions }: CompositionGetListResponse =
  await $uniformCanvasClient.getCompositionList({
    skipEnhance: true,
    state: $preview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });

const navLinks = compositions
  .filter((c) => c.composition._slug)
  .map((c) => {
    return {
      title: c.composition._name,
      url: c.composition._slug,
    };
  });
</script>

<template>
  <PageComposition :composition="composition" :navLinks="navLinks" />
</template>
