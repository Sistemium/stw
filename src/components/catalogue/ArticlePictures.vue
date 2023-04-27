<template lang="pug">

.article-pictures
  el-image(
    v-for="pic in pictures"
    :key="pic.id"
    astyle="width: 100px; height: 100px"
    :src="pic.src"
    fit="fill"
  )

</template>
<script setup lang="ts">
import type { Picture } from '@/models/Pictures';

defineProps<{
  pictures: Picture[],
}>();

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.el-image + .el-image {
  margin-top: $margin-top;
}

</style>
