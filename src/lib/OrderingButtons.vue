<template lang="pug">

.ordering-buttons
  el-button(
    type="text"
    @click.prevent.stop="reorder(-1)"
    :disabled = "index === 0"
  )
    i.el-icon-arrow-up

  el-button(
    type="text"
    @click.prevent.stop="reorder(1)"
    :disabled = "index === length - 1"
  )
    i.el-icon-arrow-down

</template>
<script>

export default {
  name: 'OrderingButtons',
  props: {
    items: Array,
    item: Object,
  },
  computed: {
    length() {
      return this.items.length;
    },
    index() {
      return this.items.indexOf(this.item);
    },
  },
  methods: {
    reorder(change) {
      const { items } = this;
      const ord1 = this.index;
      const ord2 = ord1 + change;
      items.splice(ord1, 1);
      items.splice(ord2, 0, this.item);
      this.$emit('reorder');
    },
  },
};

</script>
<style scoped lang="scss">

</style>
