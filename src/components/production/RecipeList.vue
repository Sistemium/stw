<template lang="pug">

.recipe-list.list-group
  .list-group-item(
    v-for="recipe in recipes"
    :key="recipe.id"
    @click="$emit('click', recipe)"
  )
    .name {{ recipe.name }}

</template>
<script>

export default {
  name: 'RecipeList',
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },
};

</script>
<style scoped lang="scss">

</style>
