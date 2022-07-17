<template lang="pug">

.storages-list.list-group
  .list-group-item(v-for="storage in storages" :key="storage.id" @click="$emit('click', storage)")
    .name {{ storage.name }}
    simple-label(:text="`concepts.${storage.type}`")

</template>
<script>

export default {
  name: 'StoragesList',
  props: {
    storages: Array,
  },
};

</script>
<style scoped lang="scss">

.list-group-item {
  display: flex;
  justify-content: space-between;
}

</style>
