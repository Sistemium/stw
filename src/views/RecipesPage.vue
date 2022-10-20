<template lang="pug">

.recipes-page.page
  page-title(title="menu.recipes")
  template(v-if="recipes.length")
    .buttons
      tool-button(tool="add" @click="onAdd()")
    recipe-list(:recipes="recipes" @click="onItemClick")
  alert-empty(
    v-else
    @click="onAdd()"
    :button-text="$tAction('add', 'recipe')"
  )
  router-view

</template>
<script>

import pageMixin from '@/lib/pageMixin';
import RecipeList from '@/components/production/RecipeList.vue';
import Recipe from '@/models/Recipe';

export default {
  name: 'RecipesPage',
  components: { RecipeList },
  mixins: [pageMixin],
  computed: {
    recipes() {
      return Recipe.reactiveFilter();
    },
  },
  methods: {
    onItemClick(item) {
      this.$router.push({
        name: this.editRoute,
        params: {
          recipeId: item.id,
        },
      });
    },
    onAdd() {
      this.pushCreate({});
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
