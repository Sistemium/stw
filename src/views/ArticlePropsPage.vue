<template lang="pug">

.article-props.mx-auto(style="max-width: 1000px")

  page-title(title="menu.articlePropsTitle")
    .float-right
      tool-button(tool="add" @click="onAdd()")

  resize(:padding="20" :scrollable="false")
    template(#default="{ resized }")
      article-prop-table(
        :article-props="articleProps"
        @click="onPropClick"
        v-if="articleProps.length"
        :height="resized"
        :active-id="currentId"
      )
      el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)
        el-button(
          type="primary" @click="onAdd()" :plain="true"
        ) {{ $tAction('add', 'property') }}

  router-view

</template>
<script setup lang="ts">
import { computed } from 'vue'
import ArticleProp from '@/models/ArticleProp'
import PageTitle from '@/components/PageTitle.vue'
import Resize from '@/lib/StmResize.vue'
import ToolButton from '@/lib/ToolButton.vue'
import ArticlePropTable from '@/components/catalogue/ArticlePropTable.vue'
import { articlePropertySort } from '@/services/catalogue'
import { useRouteParams } from '@/lib/updateRouteParams'

const { route, router } = useRouteParams()

const props = defineProps<{
  editRoute: string
  createRoute: string
}>()

const articleProps = computed(() => {
  const items = ArticleProp.reactiveFilter({})
  return articlePropertySort(items)
})

const currentId = computed(() => route.params.articlePropId as string)

function onPropClick(prop: { id: string }) {
  router.push({
    name: props.editRoute,
    params: {
      articlePropId: prop.id,
    },
  })
}

function onAdd() {
  router.push({
    name: props.createRoute,
  })
}

</script>
