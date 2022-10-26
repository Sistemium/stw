<template lang="pug">

el-avatar.article-avatar(
  :src="picture.thumbnailHref"
  icon="el-icon-picture-outline"
  :size="size"
  shape="square"
  fit="cover"
  :id="id"
)

</template>
<script>

import Picture from '@/models/Picture';

export default {
  name: 'ArticleAvatar',
  props: {
    article: Object,
    size: String,
    id: String,
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

.article-avatar ::v-deep img {
  width: 100%;
}

</style>
