import StorageSelect from '@/components/stock/StorageSelect.vue';

export default {
  components: { StorageSelect },
  created() {
    const { storageId, $refs } = this;
    if (!storageId) {
      this.$nextTick(() => {
        if (!$refs.storageSelect) {
          return;
        }
        $refs.storageSelect.open();
      });
    }
  },
};
