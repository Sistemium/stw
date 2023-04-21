<template lang="pug">

.storages-page.page
  page-title(title="menu.storages")
  .buttons(v-if="storages.length")
    tool-button(
      tool="add"
      @click="onAdd()"
    )
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
      el-button(
        :plain="true"
        type="primary"
        @click="onAdd()"
      ) {{ $tAction('add', 'storage') }}

  router-view

</template>
<script setup>
import PageTitle from '@/components/PageTitle.vue';
import StoragesList from '@/components/stock/StoragesList.vue';
import Storage from '@/models/Storage';
import Resize from '@/lib/Resize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  editRoute: String,
  createRoute: String,
});

const router = useRouter();
const storages = computed(() => Storage.reactiveFilter());

function onStorageClick(storage) {
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
