<template>
  <composition :composition="composition">
    <pre>{{ composition }}</pre>
  </composition>
</template>

<script lang="ts">
import Vue from 'vue';
import { createRelewiseEnhancer, RELEWISE_CANVAS_PARAMETER_TYPES } from 'relewise-uniform-mesh-enhancer';
import { enhance, EnhancerBuilder } from '@uniformdev/canvas/.';
import { ExtendedContext } from '~/types/client';

export default Vue.extend({
  name: 'IndexPage',
  async asyncData({ $uniformCanvasNuxt }: ExtendedContext) {
    const { composition } = await $uniformCanvasNuxt.getCompositionBySlug({
      slug: '/about',
    });

    console.log(composition);

    const enhancer = createRelewiseEnhancer({
      apiKey: process.env.RELEWISE_API_KEY!,
      datasetId: process.env.RELEWISE_DATASET_ID!,
      dataKeys: { products: ['Images', 'SubTitle'], contents: ['url'] },
      language: 'da-DK'
    });

    try {
      await enhance({
        composition: composition,
        enhancers: new EnhancerBuilder().parameterType(RELEWISE_CANVAS_PARAMETER_TYPES, enhancer),
        context: {},
      });
    }
    catch (e) {
      console.log(e);
    }
    
    return { composition };
  },
});
</script>

