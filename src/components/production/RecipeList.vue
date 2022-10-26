<template lang="pug">

.recipe-list.list-group
  .list-group-item(
    v-for="recipe in recipes"
    :key="recipe.id"
    @click="$emit('click', recipe)"
  )
    .name {{ recipe.name }}
    .materials(v-if="recipe.materials")
      el-badge(:value="recipe.materials.length" type="info")

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
.list-group-item {
  display: flex;
}
.name {
  flex: 1;
}
</style>
