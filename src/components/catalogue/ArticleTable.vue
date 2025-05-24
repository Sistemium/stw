<template lang="pug">
v-data-table-virtual.article-table(
  ref="tableInstance"
  :headers="columns"
  :items="articles"
  :height="height"
  fixed-header
  :row-props="rowProps"
  hover
)
  template(#item.avatar="{ item }")
    article-avatar(
      :article="item"
      @click="() => emit('avatarClick', item)"
    )
  template(#item.buttons="{ item }")
    tool-button(
      tool="edit"
      :circle="false"
      @click="() => emit('click', item)"
    )
</template>
<script setup lang="tsx">

import { computed, ref } from 'vue'
import ToolButton from '@/lib/ToolButton.vue'
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue'
import { t } from '@/lib/validations'
import type { BaseItem } from '@/init/Model'
import type { IArticle } from '@/models/Articles'
import type { IArticleProp } from '@/models/ArticleProps'
import { useRowProps } from '@/services/util'

const props = defineProps<{
  articles: IArticle[],
  propColumns: (IArticleProp & { align: 'end' | 'start' })[],
  height?: number;
  activeId?: string;
}>()

const rowPropsClass = useRowProps(props)

function rowProps(row: { item: IArticle }) {
  return {
    onClick() {
      const article = (props.activeId === row.item.id) ? undefined : row.item
      emit('currentChange', article)
    },
    ...rowPropsClass(row),
  }
}

const tableInstance = ref()

const emit = defineEmits<{
  (e: 'avatarClick', row: BaseItem): void;
  (e: 'click', row: BaseItem): void;
  (e: 'currentChange', current: IArticle | undefined): void;
}>()

const columns = computed(() => [
  {
    key: 'avatar',
    title: '',
    width: 60,
  },
  {
    align: 'left',
    key: 'name',
    title: t('fields.name'),
  },
  {
    key: 'code',
    title: t('fields.code'),
  },
  ...props.propColumns.map(prop => ({
    key: prop.id,
    title: prop.name,
    align: prop.align,
  })),
  {
    key: 'buttons',
    width: 50,
    align: 'end',
  },
])

defineExpose({
  isReady(): boolean {
    return !!tableInstance.value
  },
  scrollToId(id: string): boolean {
    const idx = props.articles.findIndex(item => item.id === id)
    const { value: table } = tableInstance
    if (idx < 0 || !table) {
      return false
    }
    setTimeout(() => {
      table.scrollToIndex(idx ? idx - 1 : 0)
      emit('currentChange', props.articles[idx])
    }, 100)
    return true
  },
})

</script>
