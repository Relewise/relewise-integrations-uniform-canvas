<script lang="ts" setup>
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  compose,
  CompositionGetListResponse,
  enhance,
  EnhancerBuilder,
  type ComponentInstance,
} from "@uniformdev/canvas";
import { createRelewiseEnhancer, RELEWISE_CANVAS_PARAMETER_TYPES } from '@relewise/uniform-canvas';
import { Tracker, UserFactory } from "@relewise/client";

const { $useComposition, $uniformCanvasClient, $preview, $config } = useNuxtApp();

const tracker = new Tracker($config.public.relewise.datasetId, $config.public.relewise.apiKey)

const enhancer = createRelewiseEnhancer({
  apiKey: $config.public.relewise.apiKey,
  datasetId: $config.public.relewise.datasetId,
  dataKeys: { products: ['ImageUrl', 'ShortDescription'], contents: ['url'] },
  language: 'en-US',
  currency: 'USD',
  userFactory: getUser
});

async function doEnhance(composition: ComponentInstance) {
   const enhancedComposition = { ...composition };

   try {
      await enhance({
        composition: enhancedComposition,
        enhancers: new EnhancerBuilder().parameterType(RELEWISE_CANVAS_PARAMETER_TYPES, compose(enhancer)),
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

tracker.trackContentView({ contentId: `uniform_${data.value.composition._name}`, user: getUser() })

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

function getUser() {
  return UserFactory.byAuthenticatedId('bdf0123c-9228-420b-9e39-d5c95e2977b4'); // ID is generated using crypto.randomUUID() in the browser
}
</script>

<template>
  <PageComposition :composition="composition" :navLinks="navLinks" />
</template>
