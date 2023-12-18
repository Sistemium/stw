import StorageSelect from '@/components/select/StorageSelect.vue';

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
