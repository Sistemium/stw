<template lang="pug">

el-form.prop-option-form(
  :model="model"
  ref="form"
  :rules="rules"
)
  el-form-item(:label="$t('fields.name')" prop="name")
    el-input(v-model="model.name")

</template>
<script>

export default {
  name: 'PropOptionForm',
  props: {
    model: {
      type: Object,
      required: true,
    },
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
