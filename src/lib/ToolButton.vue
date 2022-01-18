<template lang="pug">

  el-button.tool-button(
    :icon="icon"
    :size="size"
    :disabled="disabled"
    circle
    @click="$emit('click')"
  )

</template>
<script>

const ICONS = {
  add: 'el-icon-circle-plus',
  edit: 'el-icon-edit',
  refresh: 'el-icon-refresh',
  loading: 'el-icon-loading',
};

export default {
  name: 'ToolButton',
  props: {
    tool: {
      type: String,
      required: true,
      validator(value) {
        return Object.keys(ICONS)
          .includes(value);
      },
    },
    busy: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'mini',
    },
  },
  computed: {
    icon() {
      const { tool } = this;
      if (this.busy && tool === 'refresh') {
        return ICONS.loading;
      }
      return ICONS[tool];
    },
  },
};

</script>
<style scoped lang="scss">

@import "../styles/variables";

.tool-button:not(.is-disabled) {
  color: $primary-color;
  font-size: 19px;
  padding: 2px;
}

</style>
