<template lang="pug">

el-container.stock-withdrawals-page

  //el-header
    page-title(title="menu.stockWithdrawals")

  component(:is="showDetails ? 'el-aside' : 'el-main'")
    template(v-if="stockWithdrawals.length")
      .buttons()
        tool-button(tool="add" @click="onAdd")
      resize(:padding="20")
        stock-withdrawing-list(
          :items="stockWithdrawals"
          @click="onItemClick"
          :active-id="$route.params.stockWithdrawingId"
        )
    alert-empty(
      v-else
      @click="onAdd"
      :button-text="$tAction('start', 'stockWithdrawing')"
    )

  router-view

</template>
<script>

import StockWithdrawingList from '@/components/out/StockWithdrawingList.vue';
import StockWithdrawing from '@/models/StockWithdrawing';
import pageMixin from '@/lib/pageMixin';
import find from 'lodash/find';
// import find from 'lodash/find';

export default {
  name: 'StockWithdrawalsPage',
  mixins: [pageMixin],
  components: { StockWithdrawingList },
  computed: {
    stockWithdrawals() {
      return this.$orderBy(StockWithdrawing.reactiveFilter(), ['date'], ['desc']);
    },
    showDetails() {
      const { name } = this.$route;
      return name === this.editRoute
        || find(this.$router.currentRoute.matched, { name: this.editRoute });
    },
  },
  methods: {
    onItemClick(item) {
      this.updateRouteParams({
        stockWithdrawingId: item.id,
      }, {}, this.editRoute);
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

@include responsive-only(lt-md) {
  .el-aside {
    display: none;
  }
}

.el-aside {
  margin-right: $margin-right;
}

</style>
