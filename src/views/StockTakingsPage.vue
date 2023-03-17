<template lang="pug">

.stock-takings-page.page(:class="{ detailed: !!showDetails }")
  page-title(title="menu.stockTakings")
  el-container
    component.operations(:is="showDetails ? 'el-aside' : 'el-main'")
      .filters
        search-input(v-model="search")
        .buttons(v-if="stockTakings.length")
          storage-select(v-model="storageId" ref="storageSelect")
          tool-button(tool="back" @click="onBack" v-if="showDetails")
          tool-button(tool="add" @click="onAdd")
      resize#stock-takings-scroll(:padding="20" v-if="storageId")
        stock-taking-list(
          :items="stockTakings"
          @click="onPositionsClick"
          @positionsClick="onPositionsClick"
          v-if="stockTakings.length"
          :active-id="$route.params.stockTakingId"
        )
        alert-empty(
          v-else
          @click="onAdd"
          :button-text="$tAction('start', 'stockTaking')"
        )
    router-view

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import find from 'lodash/find';
import StockTaking from '@/models/StockTaking';
import StockTakingList from '@/components/stock/StockTakingList.vue';
import SearchInput from '@/lib/SearchInput.vue';
import pageMixin from '@/lib/pageMixin';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';
import storageSelectMixin from '@/components/storageSelectMixin';
import { searchOperations } from '@/services/warehousing';
import StockTakingItem from '@/models/StockTakingItem';
import scrollToCreated from '@/components/scrollToCreated';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockTakingsPage',
  mixins: [
    pageMixin,
    storageSelectMixin,
    scrollToCreated({
      container: '#stock-takings-scroll',
      blink: false,
      watchFor: '$route.params.stockTakingId',
      watchToRepeat() {
        return !!this.$route.query.search;
      },
    }),
  ],
  components: { SearchInput, StockTakingList },
  props: {
    progressRoute: String,
  },
  computed: {
    search: {
      get() {
        return this.$route.query.search || '';
      },
      set(search) {
        this.updateRouteParams({}, { search: search || undefined });
      },
    },
    ...mapGetters({
      defaultStorageId: g.CURRENT_STORAGE,
    }),
    storageId: {
      get() {
        return this.defaultStorageId;
      },
      set(id) {
        this.setCurrentStorageId(id);
      },
    },
    stockTakings() {
      const { storageId, search } = this;
      const data = StockTaking.reactiveManyByIndex('storageId', storageId);
      const filtered = search
        ? data.filter(searchOperations(search, StockTakingItem, 'stockTakingId'))
        : data;
      return this.$orderBy(filtered, ['date'], ['desc']);
    },
    showDetails() {
      return this.$route.name
        && find(this.$router.currentRoute.matched, { name: this.progressRoute });
    },
  },
  methods: {
    onBack() {
      this.updateRouteParams({
        stockTakingId: null,
      }, {}, this.rootState);
    },
    onAdd() {
      this.pushCreate({ storageId: this.storageId });
    },
    ...mapMutations({
      setCurrentStorageId: m.SET_CURRENT_STORAGE,
    }),
    onItemClick(stockTaking, toProgress = false) {
      const { processing } = stockTaking;
      const progress = processing === 'progress' || toProgress;
      const name = progress ? this.progressRoute : this.editRoute;
      this.updateRouteParams({ stockTakingId: stockTaking.id }, {}, name);
    },
    onPositionsClick(stockTaking) {
      this.onItemClick(stockTaking, true);
    },
  },

};

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
