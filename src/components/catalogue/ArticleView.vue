<template lang="pug">

.article-view(v-if="article")
  .name {{ article.name }}
  .code {{ article.code }}

</template>
<script setup lang="ts">
import { computed } from 'vue';
import Article from '@/models/Article.js';

const props = defineProps<{
  articleId?: string;
}>();

const article = computed(() => Article.reactiveGet(props.articleId));

</script>
<style scoped lang="scss">
@import "@/styles/variables";

.code {
  font-size: smaller;
  color: $gray;
}

.name, .code {
  line-height: 15px;
}

</style>
