<template lang="pug">

.storages-page.page
  page-title(title="menu.storages")
    .float-right(v-if="storages.length")
      tool-button(
        tool="add"
        @click="onAdd()"
      )
  v-container.px-0
    resize(:padding="20")
      storages-list(
        :storages="storages"
        @click="onStorageClick"
        v-if="storages.length"
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
import PageTitle from '@/components/PageTitle.vue';
import StoragesList from '@/components/stock/StoragesList.vue';
import Storage from '@/models/Storage';
import Resize from '@/lib/StmResize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import orderBy from 'lodash/orderBy';

const props = defineProps<{
  editRoute: string
  createRoute: string
}>();

const router = useRouter();
const storages = computed(() => orderBy(Storage.reactiveFilter(), 'name'));

function onStorageClick(storage: { id: string }) {
  router.push({
    name: props.editRoute,
    params: {
      storageId: storage.id,
    },
  });
}

function onAdd() {
  router.push({
    name: props.createRoute,
  });
}

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
