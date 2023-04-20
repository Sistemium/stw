<template lang="pug">

.prop-option-list.list-group
  .list-group-item(
    v-for="option in options"
    :key="option.id"
    @click="emit('click', option)"
  )
    .name {{ option.name }}

</template>
<script setup>

defineProps({
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['click']);

</script>
<style scoped lang="scss">

</style>
