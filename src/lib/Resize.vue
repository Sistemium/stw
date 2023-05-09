<template lang="pug">

.stm-resize(:style="style" ref="root")
  slot

</template>
<script>

import debounce from 'lodash/debounce';

export default {

  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Resize',

  props: {
    padding: Number,
    maximize: Boolean,
  },

  data() {
    return {
      style: {},
      top: 0,
      height: 0,
      handleResize: debounce(this.setHeight, 700),
    };
  },

  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.$nextTick(() => {
      this.setHeight();
    });
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {

    setHeight() {
      const { top } = this.$refs.root.getBoundingClientRect();
      this.top = top;
      this.height = window.innerHeight;
      const resized = this.height - this.top - (this.padding || 0);
      const maxHeight = `${resized}px`;
      this.style = { 'max-height': maxHeight };
      if (this.maximize) {
        this.style = { height: maxHeight };
      }
      this.$emit('resized', resized);
    },

  },

};

</script>
<style scoped lang="scss">

.stm-resize {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  @media print {
    max-height: none !important;
    height: auto !important;
  }
}

</style>
