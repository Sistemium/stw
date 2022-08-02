<template lang="pug">

el-form.legal-entity-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(:label="$t('fields.name')" prop="name")
    el-input(v-model.trim="model.name")

  el-form-item(:label="$t('fields.regCode')" prop="code")
    el-input(v-model.trim="model.code")

  el-form-item(:label="$t('fields.vatCode')" prop="vatCode")
    el-input(v-model.trim="model.vatCode")

  el-form-item(:label="$t('fields.address')" prop="address")
    el-input(v-model.trim="model.address")

</template>
<script>

export default {
  name: 'LegalEntityForm',
  props: {
    model: Object,
    disabled: Boolean,
  },
  computed: {
    rules() {
      return this.$requiredRule(['name']);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
