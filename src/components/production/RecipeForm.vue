<template lang="pug">

.recipe-form
  el-form.article-form(
    :model="model"
    ref="form"
    :rules="rules"
  )
    el-form-item(:label="$t('fields.name')" prop="name")
      el-input(v-model="model.name")

</template>
<script>

export default {
  name: 'RecipeForm',
  props: {
    model: Object,
  },
  computed: {
    rules() {
      return this.$requiredRule('name');
    },
  },
};

</script>
<style scoped lang="scss">

</style>
