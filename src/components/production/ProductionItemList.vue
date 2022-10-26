<template lang="pug">

.production-item-list.list-group(v-if="items && items.length")
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      recipe-view(:recipe-id="item.recipeId")
    .right
      .units {{ item.units }} {{ $t('units.short.piece') }}
      .cost(v-if="item.price")
        .price {{ item[priceField] }} &euro;

</template>
<script>

import RecipeView from '@/components/production/RecipeView.vue';

export default {
  name: 'ProductionItemList',
  components: { RecipeView },
  props: {
    items: Array,
    priceField: { type: String, required: true },
  },
};

</script>
<style scoped lang="scss">
.list-group-item {
  display: flex;
  text-align: left;
}
.title {
  flex: 1;
}
</style>
