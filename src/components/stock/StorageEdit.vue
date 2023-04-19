<template lang="pug">

drawer-edit.storage-edit(
  :title="$tGen('editing', 'storage')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
)
  template(#default="{ model }")
    storage-form(ref="form" :model="model")

</template>
<script>
import DrawerEdit from '@/lib/DrawerEdit.vue';
import Storage from '@/models/Storage';
import StorageForm from '@/components/stock/StorageForm.vue';

export default {
  name: 'StorageEdit',
  props: {
    storageId: String,
    from: Object,
  },
  computed: {
    modelOrigin() {
      const { storageId } = this;
      return storageId ? Storage.reactiveGet(storageId) : { type: 'facility' };
    },
  },
  components: {
    StorageForm,
    DrawerEdit,
  },
  methods: {
    saveFn(props) {
      return Storage.createOne(props);
    },
    destroyFn(id) {
      return Storage.destroy(id);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
