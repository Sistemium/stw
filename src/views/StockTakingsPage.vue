<template lang="pug">

.stock-takings-page.page
  page-title(title="menu.stockTakings")
  .buttons(v-if="stockTakings.length")
    tool-button(tool="add" @click="onAdd")
  resize(:padding="20")
    stock-taking-list(
      :items="stockTakings"
      @click="onItemClick"
      v-if="stockTakings.length"
    )
    el-alert(type="info" :title="$t('validation.noData')" :closable="false" v-else)
      el-button(
        type="primary" @click="onAdd" :plain="true"
      ) {{ $tAction('start', 'stockTaking') }}
  router-view

</template>
<script>

import StockTaking from '@/models/StockTaking';
import StockTakingList from '@/components/stock/StockTakingList.vue';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'StockTakingsPage',
  components: { StockTakingList, PageTitle },
  props: {
    editRoute: String,
    createRoute: String,
  },
  computed: {
    stockTakings() {
      return StockTaking.reactiveFilter();
    },
  },
  methods: {
    onItemClick(stockTaking) {
      this.$router.push({
        name: this.editRoute,
        params: {
          stockTakingId: stockTaking.id,
        },
      });
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
