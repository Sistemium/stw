<template lang="pug">

.prop-option-list.list-group
  .list-group-item(v-for="option in options" @click="$emit('click', option)" :key="option.id")
    .name {{ option.name }}

</template>
<script>

export default {
  name: 'PropOptionList',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
};

</script>
<style scoped lang="scss">

</style>
