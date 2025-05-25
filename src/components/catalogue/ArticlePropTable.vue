<template lang="pug">
v-data-table-virtual(
  :headers="columns"
  :items="articleProps"
  :height="height"
  fixed-header
  :row-props="rowProps"
  hover
  density="compact"
)
  template(#item.ord="{ value }") {{ $n(value) }}
  template(#item.type="{ value }") {{ $t(`dataTypes.${value}`) }}
  template(#item.buttons="{ item }")
    tool-button(
      tool="edit"
      :circle="false"
      @click="() => emit('click', item)"
    )
</template>

<script setup lang="ts">

import { type IArticleProp } from '@/models/ArticleProps'
import ToolButton from '@/lib/ToolButton.vue'
import { computed } from 'vue'
import { t } from '@/lib/validations'
import { useRowProps } from '@/services/util'

const props = defineProps<{
  articleProps: IArticleProp[]
  height?: number
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'click', item: IArticleProp): void
}>()
const rowProps = useRowProps(props)

const columns = computed(() => [
  {
    key: 'ord',
    width: 100,
    title: t('fields.ord'),
  },
  {
    key: 'name',
    title: t('fields.name'),
  },
  {
    key: 'prefix',
    title: t('fields.prefix'),
  },
  {
    key: 'suffix',
    title: t('fields.suffix'),
  },
  {
    key: 'type',
    width: 180,
    title: t('fields.type'),
  },
  {
    key: 'buttons',
    width: 50,
    align: 'end',
  },
])
</script>
