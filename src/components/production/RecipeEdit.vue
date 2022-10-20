<template lang="pug">

drawer-edit.recipe-edit(
  :title="$tGen('editing', 'recipe')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
)
  template(v-slot="{ model }")
    recipe-form(:model="model")

</template>
<script>

import drawerEditMixin from '@/lib/drawerEditMixin';
import Recipe from '@/models/Recipe';
import RecipeForm from '@/components/production/RecipeForm.vue';

export default {
  name: 'RecipeEdit',
  components: { RecipeForm },
  mixins: [drawerEditMixin],
  props: {
    recipeId: String,
  },
  computed: {
    modelOrigin() {
      const { recipeId } = this;
      return recipeId ? Recipe.reactiveGet(recipeId) : {
        name: '',
        materials: [],
      };
    },
  },
  methods: {
    destroyFn() {
      const { recipeId } = this;
      return recipeId && Recipe.destroy(recipeId);
    },
    saveFn(props) {
      return Recipe.createOne(props);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
