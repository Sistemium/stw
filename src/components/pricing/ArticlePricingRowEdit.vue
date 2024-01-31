<template lang="pug">
  .article-pricing-row-edit
    article-select(
      ref="articleRef"
      v-model="model.articleId"
      :width="width.article"
      :style="{ width: `${width.article}px` }"
    )
    el-input-number(
      ref="priceRef"
      v-model="model.price"
      v-select-on-focus
      :style="{ width: width.price }"
    )
</template>

<script setup lang="ts">
import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import { computed, ref, watch } from 'vue'
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue'
import { useEnter } from '@/services/validating'

interface ColumnInfo {
  width: number
  key: string
}

interface AP {
  price?: number,
  articleId?: string,
}

const props = defineProps<{
  columns: ColumnInfo[]
}>()

const articleRef = ref()
const priceRef = ref()
const model = defineModel<AP>({ required: true })
const width = computed(() => mapValues(keyBy(props.columns, 'key'), c => c.width))

const emit = defineEmits<{
  (e: 'done'): void
}>()

useEnter((e: EventTarget | null) => {
  if (document.activeElement === e) {
    emit('done')
  }
})

watch(model, ({ articleId }) => {
  if (!articleId && articleRef.value) {
    articleRef.value.focus()
  } else if (articleId) {
    priceRef.value.focus()
  }
}, { deep: true })

</script>

<style scoped lang="scss">
@import "@/styles/variables";

.article-select {
  box-sizing: border-box;
  padding-right: $padding;
}
</style>
