<template lang="pug">

el-form.stock-withdrawing-product-form(
  :model="model"
  ref="form"
  :rules="rules"
)
  el-form-item(prop="recipeId" :label="$t('concepts.recipe')")
    recipe-select(v-model="model.recipeId" @change="onRecipeChange")
  el-form-item(prop="units" :label="$t('fields.units')")
    el-input-number(v-model="model.units" :min="1")
  materials-form(:materials="model.materials" v-if="model.recipeId")

</template>
<script>

import Recipe from '@/models/Recipe';
import RecipeSelect from '@/components/select/RecipeSelect.vue';
import MaterialsForm from '@/components/production/MaterialsForm.vue';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'StockWithdrawingProductForm',
  components: { MaterialsForm, RecipeSelect },
  props: {
    model: Object,
  },
  computed: {
    rules() {
      return {};
    },
    // recipe() {
    //   return Recipe.reactiveGet(this.model.recipeId);
    // },
  },
  methods: {
    onRecipeChange(recipeId) {
      const recipe = Recipe.reactiveGet(recipeId);
      // eslint-disable-next-line vue/no-mutating-props
      this.model.materials = cloneDeep(recipe.materials);
    },
  },
};

</script>
<style scoped lang="scss">
.recipe-select {
  width: 100%;
}

.el-form-item {
  text-align: right;
}
</style>
