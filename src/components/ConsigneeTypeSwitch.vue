<template lang="pug">

el-radio-group.consignee-type-switch(v-model="type" @change="x => $emit('change', x)")
  el-radio-button(label="LegalEntity") {{ $t('concepts.legalEntity') }}
  //el-radio-button(label="Person") {{ $t('concepts.person') }}
  el-radio-button(label="Storage") {{ $t('concepts.storage') }}
  el-radio-button(:label="null") {{ $t('concepts.unknown') }}

</template>
<script>

export default {
  name: 'ConsigneeTypeSwitch',
  props: {
    value: { type: String, default: null },
  },
  computed: {
    type: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
