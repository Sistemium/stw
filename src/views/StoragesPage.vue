<template lang="pug">

.storages-page.mx-auto(style="max-width: 1200px")
  page-title(title="menu.storages")
    .float-right(v-if="storages.length")
      tool-button(
        tool="add"
        @click="onAdd()"
      )
  v-sheet
    .filters.d-flex
      search-input.flex-1-1(v-model="search")
    stm-resize.my-1(:padding="20" v-if="storages.length")
      template(#default="{ resized }")
        storage-table(
          :storages="storages"
          :height="resized"
          @edit-click="onStorageClick"
        )
    el-alert.empty(
      v-else
      :closable="false"
      :title="$t('validation.noData')"
      type="info"
    )
      v-btn(
        variant="plain"
        @click="onAdd()"
      ) {{ $tAction('add', 'storage') }}

  router-view

</template>
<script setup lang="ts">
import PageTitle from '@/components/PageTitle.vue'
// import StoragesList from '@/components/stock/StoragesList.vue';
import Storage from '@/models/Storage'
import StmResize from '@/lib/StmResize.vue'
import ToolButton from '@/lib/ToolButton.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StorageTable from '@/components/stock/StorageTable.vue'
import SearchInput from '@/lib/SearchInput.vue'
import { orderByName, useSearch } from '@/services/util'
import { applySearch } from '@/services/lt'

const props = defineProps<{
  editRoute: string
  createRoute: string
}>()

const { search } = useSearch()
const router = useRouter()
const storages = computed(() => {
  const searcher = applySearch(search.value, ['name'])
  return orderByName(searcher(Storage.reactiveFilter()))
})

function onStorageClick(storage: { id: string }) {
  router.push({
    name: props.editRoute,
    params: {
      storageId: storage.id,
    },
  })
}

function onAdd() {
  router.push({
    name: props.createRoute,
  })
}

</script>
