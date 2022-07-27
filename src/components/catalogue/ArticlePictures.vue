<template lang="pug">

.article-pictures
  el-image(
    v-for="pic in pictures"
    :key="pic.id"
    astyle="width: 100px; height: 100px"
    :src="pic.src"
    fit="fit"
  )

</template>
<script>

export default {
  name: 'ArticlePictures',
  props: {
    pictures: Array,
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-image + .el-image {
  margin-top: $margin-top;
}

</style>
