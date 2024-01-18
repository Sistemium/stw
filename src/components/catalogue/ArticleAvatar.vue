<template lang="pug">

el-avatar.article-avatar(
  fit="cover"
  :icon="Picture"
  :id="id"
  shape="square"
  :size="size"
  :src="picture.thumbnailHref"
)

</template>
<script setup lang="ts">

import model from '@/models/Picture';
import { computed } from 'vue';
import { Picture } from '@element-plus/icons-vue';
import type { Article as ArticleType } from '@/models/Articles'
import Article from '@/models/Article';

const props = defineProps<{
  article?: ArticleType
  articleId?: string
  size?: string
  id?: string
}>();

const article = computed(() => props.article || Article.reactiveGet(props.articleId))
const picture = computed(() => model.reactiveGet(article.value?.avatarPictureId) || {});

</script>
<style scoped lang="scss">

.article-avatar :deep(img) {
  width: 100%;
}

</style>
