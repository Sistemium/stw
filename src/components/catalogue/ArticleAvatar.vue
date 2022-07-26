<template lang="pug">

el-avatar.article-avatar(
  :src="picture.thumbnailHref"
  icon="el-icon-picture-outline"
  :size="size"
)

</template>
<script>

import Picture from '@/models/Picture';

export default {
  name: 'ArticleAvatar',
  props: {
    article: Object,
    size: Number,
  },
  computed: {
    picture() {
      const { article } = this;
      return Picture.reactiveGet(article.avatarPictureId) || {};
    },
  },
};

</script>
<style scoped lang="scss">

</style>
