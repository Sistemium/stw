<template lang="pug">

.storages-page.page
  page-title(title="menu.storages")
  .buttons(v-if="storages.length")
    tool-button(tool="add" @click="onAdd()")
  resize(:padding="20")
    storages-list(
      :storages="storages"
      @click="onStorageClick"
      v-if="storages.length"
    )
    el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)
      el-button(
        type="primary" @click="onAdd()" :plain="true"
      ) {{ $tAction('add', 'storage') }}
  router-view

</template>
<script>
import PageTitle from '@/components/PageTitle.vue';
import StoragesList from '@/components/stock/StoragesList.vue';
import Storage from '@/models/Storage';

export default {
  name: 'StoragesPage',
  props: {
    editRoute: String,
    createRoute: String,
  },
  computed: {
    storages() {
      return Storage.reactiveFilter();
    },
  },
  methods: {
    onStorageClick(storage) {
      this.$router.push({
        name: this.editRoute,
        params: {
          storageId: storage.id,
        },
      });
    },
    onAdd() {
      this.$router.push({
        name: this.createRoute,
      });
    },
  },
  components: {
    StoragesList,
    PageTitle,
  },
};

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
