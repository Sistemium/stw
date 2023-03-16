<template lang="pug">

el-form-item.vat-mode-switch(
  :label="$t('fields.vatPrice')"
)
  el-switch(v-model="model")

</template>
<script>

export default {
  name: 'VatModeSwitch',
  props: {
    value: Boolean,
  },
  computed: {
    model: {
      get() {
        return this.value || false;
      },
      set(value) {
        this.$emit('input', value || false);
      },
    },
  },
};

</script>
<style scoped lang="scss">
</style>
