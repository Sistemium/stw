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
<script setup>

import model from '@/models/Picture';
import { computed } from 'vue';
import { Picture } from '@element-plus/icons-vue';

const props = defineProps({
  article: Object,
  size: String,
  id: String,
});

const picture = computed(() => model.reactiveGet(props.article.avatarPictureId) || {});

</script>
<style scoped lang="scss">

.article-avatar :deep(img) {
  width: 100%;
}

</style>
