<template lang="pug">

el-popover.article-avatar(
  placement="right"
  :width="350"
  trigger="hover"
  :disabled="!picture.href"
)
  template(#reference)
    el-avatar.article-avatar(
      fit="cover"
      :icon="Picture"
      :id="id"
      shape="square"
      :size="size"
      :src="picture.thumbnailHref"
      @click="emit('click')"
    )
  template(
    #default
  )
    el-image(
      :src="picture.href"
    )


</template>
<script setup lang="ts">

import model from '@/models/Picture'
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import type { IArticle as ArticleType } from '@/models/Articles'
import Article from '@/models/Article'

const props = defineProps<{
  article?: ArticleType
  articleId?: string
  size?: string
  id?: string
}>()

const article = computed(() => props.article || Article.reactiveGet(props.articleId))
const picture = computed(() => model.reactiveGet(article.value?.avatarPictureId) || {})
const emit = defineEmits<{
  (e: 'click'): void
}>()

</script>
<style scoped lang="scss">

.article-avatar :deep(img) {
  width: 100%;
}

</style>
