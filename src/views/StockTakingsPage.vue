<template lang="pug">

.stock-takings-page.page
  page-title(title="menu.stockTakings")
  template(v-if="showList")
    .buttons(v-if="stockTakings.length")
      tool-button(tool="add" @click="onAdd")
    resize(:padding="20")
      stock-taking-list(
        :items="stockTakings"
        @click="onItemClick"
        @positionsClick="onPositionsClick"
        v-if="stockTakings.length"
      )
      el-alert.empty(type="info" :title="$t('validation.noData')" :closable="false" v-else)
        el-button(
          type="primary" @click="onAdd" :plain="true"
        ) {{ $tAction('start', 'stockTaking') }}
  router-view

</template>
<script>

import find from 'lodash/find';
import StockTaking from '@/models/StockTaking';
import StockTakingList from '@/components/stock/StockTakingList.vue';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'StockTakingsPage',
  components: { StockTakingList, PageTitle },
  props: {
    rootState: String,
    editRoute: String,
    createRoute: String,
    progressRoute: String,
  },
  computed: {
    stockTakings() {
      return StockTaking.reactiveFilter();
    },
    showList() {
      return this.$route.name
        && !find(this.$router.currentRoute.matched, { name: this.progressRoute });
    },
  },
  methods: {
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
    onAdd() {
      this.$router.push({
        name: this.createRoute,
      });
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/page";

</style>