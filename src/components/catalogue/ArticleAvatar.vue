<template lang="pug">

el-avatar.article-avatar(
  fit="cover"
  icon="el-icon-picture-outline"
  :id="id"
  shape="square"
  :size="size"
  :src="picture.thumbnailHref"
)

</template>
<script setup>

import Picture from '@/models/Picture';
import { computed } from 'vue';

const props = defineProps({
  article: Object,
  size: String,
  id: String,
});

const picture = computed(() => Picture.reactiveGet(props.article.avatarPictureId) || {});

</script>
<style scoped lang="scss">

.article-avatar :deep(img) {
  width: 100%;
}

</style>
