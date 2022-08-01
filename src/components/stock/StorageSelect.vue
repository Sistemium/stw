<template lang="pug">

el-select.storage-select(
  v-model="storageId"
  :placeholder="$tAction('select', 'storage')"
  ref="select"
)
  el-option-group(v-for="group in groups" :key="group.type" :label="group.label")
    el-option(
      v-for="storage in group.options"
      :key="storage.id"
      :label="storage.name"
      :value="storage.id"
    )

</template>
<script>

import Storage from '@/models/Storage';

export default {
  name: 'StorageSelect',
  props: {
    value: String,
  },
  methods: {
    open() {
      this.$refs.select.visible = true;
    },
  },
  computed: {
    storageId: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    groups() {
      return ['facility', 'personal']
        .map(type => ({
          type,
          label: this.$t(`concepts.${type}`),
          options: this.$orderBy(Storage.reactiveFilter({ type }), 'name'),
        }))
        .filter(({ options }) => options.length);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
