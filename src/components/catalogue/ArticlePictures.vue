<template lang="pug">

.article-pictures
  el-image(
    v-for="pic in pictures"
    astyle="width: 100px; height: 100px"
    :src="pic.src"
    fit="fit"
  )

</template>
<script>

import Picture, { mapPictureInfo } from '@/models/Picture';

export default {
  name: 'ArticlePictures',
  props: {
    articleId: String,
  },
  computed: {
    pictures() {
      return Picture.reactiveFilter({ ownerXid: this.articleId })
        .map(mapPictureInfo('smallImage'));
    },
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-image + .el-image {
  margin-top: $margin-top;
}

</style>
