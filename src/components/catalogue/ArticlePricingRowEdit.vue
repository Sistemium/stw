<template lang="pug">
.article-pricing-row-edit
  article-select(v-model="model.articleId")
  el-input-number(v-model="model.price")
</template>

<script setup lang="ts">
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue'
interface AP {
  price?: number,
  articleId?: string,
}
const model = defineModel<AP>({ required: true })

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
