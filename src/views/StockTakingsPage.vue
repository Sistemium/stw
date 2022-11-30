<template lang="pug">

.stock-takings-page.page
  page-title(title="menu.stockTakings")
  .filters
    storage-select(v-model="storageId" ref="storageSelect")
  template(v-if="showList")
    .buttons(v-if="stockTakings.length")
      tool-button(tool="add" @click="pushCreate()")
    resize(:padding="20" v-if="storageId")
      stock-taking-list(
        :items="stockTakings"
        @click="onItemClick"
        @positionsClick="onPositionsClick"
        v-if="stockTakings.length"
      )
      alert-empty(
        v-else
        @click="pushCreate()"
        :button-text="$tAction('start', 'stockTaking')"
      )

  router-view

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import find from 'lodash/find';
import StockTaking from '@/models/StockTaking';
import StockTakingList from '@/components/stock/StockTakingList.vue';
import pageMixin from '@/lib/pageMixin';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';
import storageSelectMixin from '@/components/storageSelectMixin';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockTakingsPage',
  mixins: [pageMixin, storageSelectMixin],
  components: { StockTakingList },
  props: {
    progressRoute: String,
  },
  computed: {
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
      const { storageId } = this;
      return this.$orderBy(StockTaking.reactiveFilter({ storageId }), ['date'], ['desc']);
    },
    showList() {
      return this.$route.name
        && !find(this.$router.currentRoute.matched, { name: this.progressRoute });
    },
  },
  methods: {
    ...mapMutations({
      setCurrentStorageId: m.SET_CURRENT_STORAGE,
    }),
    onItemClick(stockTaking, toProgress = false) {
      const { processing } = stockTaking;
      const progress = processing === 'progress' || toProgress;
      const name = progress ? this.progressRoute : this.editRoute;
      this.$router.push({
        name,
        params: {
          stockTakingId: stockTaking.id,
        },
      });
    },
    onPositionsClick(stockTaking) {
      this.onItemClick(stockTaking, true);
    },
  },

};

</script>
<style scoped lang="scss">
@import "../styles/page";

</style>
