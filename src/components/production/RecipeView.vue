<template lang="pug">

.recipe-view
  template(v-if="recipe")
    .name {{ recipe.name }}

</template>
<script>

import Recipe from '@/models/Recipe';

export default {
  name: 'RecipeView',
  props: {
    recipeId: String,
  },
  computed: {
    recipe() {
      return Recipe.reactiveGet(this.recipeId);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
