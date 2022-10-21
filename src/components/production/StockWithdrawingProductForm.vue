<template lang="pug">

el-form.stock-withdrawing-product-form(
  :model="model"
  ref="form"
  :rules="rules"
)
  el-form-item(prop="recipeId" :label="$t('concepts.recipe')")
    recipe-select(v-model="model.recipeId")
  el-form-item(prop="units" :label="$t('fields.units')")
    el-input-number(v-model="model.units" :min="1")

</template>
<script>

import RecipeSelect from '@/components/select/RecipeSelect.vue';

export default {
  name: 'StockWithdrawingProductForm',
  components: { RecipeSelect },
  props: {
    model: Object,
  },
  computed: {
    rules() {
      return {};
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
