<template lang="pug">

el-form.storage-form(:model="model" ref="form" :rules="rules")

  el-form-item(prop="type" :label="$t('fields.type')")
    el-radio-group(v-model="model.type")
      el-radio-button(label="facility") {{ $t('concepts.facility') }}
      el-radio-button(label="personal") {{ $t('concepts.personal') }}

  el-form-item(:label="$t('fields.name')" prop="name")
    el-input(v-model="model.name")

</template>
<script>

export default {
  name: 'StorageForm',
  props: {
    model: Object,
  },
  computed: {
    rules() {
      return {
        ...this.$requiredRule('name'),
      };
    },
  },
};

</script>
<style scoped lang="scss">

</style>
