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
<script setup lang="ts">

import { computed } from 'vue';
import orderBy from 'lodash/orderBy';
import RecipeList from '@/components/production/RecipeList.vue';
import Recipe from '@/models/Recipe.js';
import { useRouter } from 'vue-router';
import { useRouteParams } from '@/lib/updateRouteParams.js';

const props = defineProps({
  rootState: String,
  editRoute: String,
  createRoute: String,
  closeRoute: String,
});

const recipes = computed(() => orderBy(Recipe.reactiveFilter(), 'name'));
const router = useRouter();
const { updateRouteParams } = useRouteParams();

function onItemClick(item) {
  router.push({
    name: props.editRoute,
    params: {
      recipeId: item.id,
    },
  });
}

function onAdd() {
  updateRouteParams({}, {}, props.createRoute)
}

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
