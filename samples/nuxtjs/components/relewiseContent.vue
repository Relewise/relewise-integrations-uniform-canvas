<script lang="ts" setup>
const props = defineProps({
  relewiseContent: Object,
  headline: String
})

const { relewiseContent, headline } = toRefs(props);

</script>
<template>
  <div class="container">
    <h1>{{headline}}</h1>
    
    <div v-for="content in relewiseContent" style="padding-bottom: 15px">
      <strong>{{content.contentId}} - {{content.displayName}}</strong>
      <div>{{content.data?.url?.value}}</div>
    </div>
    </div>
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
