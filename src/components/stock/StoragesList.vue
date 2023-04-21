<template lang="pug">

.storages-list.list-group
  .list-group-item(
    v-for="storage in storages"
    :key="storage.id"
    @click="$emit('click', storage)"
  )
    .name {{ storage.name }}
    simple-label(:text="`concepts.${storage.type}`")

</template>
<script setup>

import SimpleLabel from '@/lib/SimpleLabel.vue';

defineProps({
  storages: Array,
});

defineEmits(['click']);

</script>
<style scoped lang="scss">

.list-group-item {
  display: flex;
  justify-content: space-between;
}

</style>
