<template lang="pug">

.stock-takings-page.page(:class="{ detailed: !!showDetails }")
  page-title(title="menu.stockTakings")
  el-container
    component.operations(:is="showDetails ? 'el-aside' : 'el-main'")
      .filters
        search-input(v-model="search")
        .buttons
          //(v-if="stockTakings.length")
          storage-select(
            ref="storageSelectRef"
            v-model="store.currentStorageId"
          )
          tool-button(
            v-if="showDetails"
            tool="back"
            @click="onBack"
          )
          tool-button(
            tool="add"
            @click="onAdd"
          )
      resize#stock-takings-scroll(
        :padding="20"
        v-if="store.currentStorageId"
      )
        stock-taking-list(
          v-if="stockTakings.length"
          :active-id="$route.params.stockTakingId"
          :items="stockTakings"
          @click="onPositionsClick"
          @positions-click="onPositionsClick"
        )
        alert-empty(
          v-else
          :button-text="$tAction('start', 'stockTaking')"
          @click="onAdd"
        )
    router-view

</template>
<script setup lang="ts">

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import orderBy from 'lodash/orderBy';
import find from 'lodash/find';
import StockTaking from '@/models/StockTaking';
import StockTakingList from '@/components/stock/StockTakingList.vue';
import SearchInput from '@/lib/SearchInput.vue';
import { searchOperations } from '@/services/warehousing';
import StockTakingItem from '@/models/StockTakingItem';
import AlertEmpty from '@/lib/AlertEmpty.vue';
import Resize from '@/lib/Resize.vue';
import ToolButton from '@/lib/ToolButton.vue';
import StorageSelect from '@/components/stock/StorageSelect.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useInvStore } from '@/store/invStore';
import { useRouteParams } from '@/lib/updateRouteParams';
import { pageProps } from '@/lib/pageMixin';
import { useScrollToCreated } from '@/services/scrolling';

const { updateRouteParams } = useRouteParams();

const storageSelectRef = ref(null);

const props = defineProps(pageProps({
  progressRoute: String,
}));

const route = useRoute();

const search = computed({
  get() {
    return route.query.search || '';
  },
  set(search) {
    updateRouteParams({}, { search: search || undefined });
  },
});

const store = useInvStore();

const stockTakings = computed(() => {
  const data = StockTaking.reactiveManyByIndex('storageId', store.currentStorageId);
  const filtered = search.value
    ? data.filter(searchOperations(search.value, StockTakingItem, 'stockTakingId'))
    : data;
  return orderBy(filtered, ['date'], ['desc']);
});

const showDetails = computed(() => route.name
  && find(route.matched, { name: props.progressRoute }));

useScrollToCreated({
  blink: false,
  watchFor: 'stockTakingId',
  watchToRepeat() {
    return !!route.query.search;
  },
});

function onBack() {
  this.updateRouteParams({
    stockTakingId: null,
  }, {}, props.rootState);
}

function onAdd() {
  updateRouteParams({}, { storageId: store.currentStorageId }, props.createRoute)
    .catch(e => this.$error(e));
}

function onItemClick(stockTaking, toProgress = false) {
  const { processing } = stockTaking;
  const progress = processing === 'progress' || toProgress;
  const name = progress ? props.progressRoute : props.editRoute;
  updateRouteParams({ stockTakingId: stockTaking.id }, {}, name);
}

function onPositionsClick(stockTaking) {
  onItemClick(stockTaking, true);
}

</script>
<style scoped lang="scss">
@import "../styles/page";

.filters {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: $padding;
  @include responsive-only(xxs) {
    flex-direction: column;
    .search-input {
      margin-bottom: $padding;
    }
  }
}

.el-aside {
  .filters {
    flex-direction: column;

    .search-input {
      margin-bottom: $padding;
    }
  }

  .buttons {
    display: flex;
  }

  .storage-select {
    flex: 1;
  }

  + .el-main {
    margin-left: $margin-top;
  }
}

.page.detailed {
  max-width: 1024px;
}

.el-main {
  padding: 0;
}

</style>
