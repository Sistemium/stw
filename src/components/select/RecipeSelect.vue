<template lang="pug">

el-select.recipe-select(:value="value" @input="v => $emit('input', v)")
  el-option(
    v-for="{id, name} in recipes"
    :key="id"
    :value="id"
    :label="name"
  )

</template>
<script>

import Recipe from '@/models/Recipe';

export default {
  name: 'RecipeSelect',
  props: {
    value: String,
  },
  computed: {
    recipes() {
      return this.$orderBy(Recipe.reactiveFilter(), 'name');
    },
  },
};

</script>
<style scoped lang="scss">

</style>
