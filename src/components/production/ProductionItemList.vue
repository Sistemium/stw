<template lang="pug">

.production-item-list.list-group(v-if="items && items.length")
  .list-group-item(v-for="item in items" :key="item.id" @click="$emit('click', item)")
    .title
      recipe-view(:recipe-id="item.recipeId")
    .right
      span {{ item.units }} {{ $t('units.short.piece') }}

</template>
<script>

import RecipeView from '@/components/production/RecipeView.vue';

export default {
  name: 'ProductionItemList',
  components: { RecipeView },
  props: {
    items: Array,
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
