<script lang="ts" setup>
const props = defineProps({
  relewiseProductRecommendation: Object,
  headline: String
})

const { relewiseProductRecommendation, headline } = toRefs(props);

</script>
<template>
  <div class="container">
    <h1>{{headline}}</h1>

    <div v-for="product in relewiseProductRecommendation" style="padding-bottom: 15px">
      <strong>{{product.productId}} - {{product.displayName}}</strong>
      <div style="font-size: 13px;">{{product.data?.ShortDescription?.value}}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>