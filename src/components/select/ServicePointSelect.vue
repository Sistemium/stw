<template lang="pug">
el-select-v2.service-point-select(
  ref="select"
  filterable
  :disabled="!siteId"
  remote
  :placeholder="$t('typeToSearch')"
  :remote-method="remoteMethod"
  :loading="loading"
  v-model="selectedId"
  label="name"
  value="id"
  :debounce="300"
  v-cancel-read-only

  popper-class="article-select-popper"
  :options="options"
  :clearable="true"
  :automatic-dropdown="true"
  :props="selectProps"
  :item-height="itemHeight"
  :height="itemHeight*6"
)
  template(#default="{item}")
    div {{ item.name }}
    .color-gray-500
      small {{ item.address }}
  template(#empty)
    p.el-select-v2__empty {{ $t('validation.noData') }}
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import orderBy from 'lodash/orderBy'
import debounce from 'lodash/debounce'
import ServicePointCustomer, { type IServicePointCustomer } from '@/models/ServicePointCustomer.ts'
import find from 'lodash/find'

const props = defineProps<{
  siteId?: string
}>()
const itemHeight = 50
const selectProps = {
  label: 'name',
  value: 'id',
}
const loading = ref<boolean>(false)
const selectedId = defineModel<string>()
const remoteOptions = ref<IServicePointCustomer[]>([])
const remoteMethod = debounce(searcher, 300)
const options = computed(() => orderBy(remoteOptions.value, 'name'))
const servicePoint = computed(() => ServicePointCustomer.reactiveGet(selectedId.value))

watch(() => servicePoint.value?.id, id => {
  if (id && !find(options.value, { id })) {
    remoteOptions.value = ServicePointCustomer.reactiveFilter({ siteId: props.siteId })
  }
}, { immediate: true })

watch(() => props.siteId, siteId => {
  if (!siteId) {
    remoteOptions.value = []
  }
})


function searcher(search: string) {
  if ((search?.length || 0) < 4) {
    remoteOptions.value = ServicePointCustomer.reactiveFilter({ siteId: props.siteId })
    return
  }
  loading.value = true
  ServicePointCustomer.findAll({ search, siteId: props.siteId })
    .then(records => {
      remoteOptions.value = records
    })
    .finally(() => {
      loading.value = false
    })
}

</script>
<style scoped>
.color-gray-500 {
  line-height: 0;
  color: gray;
}
</style>
