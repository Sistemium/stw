<template lang="pug">

.stock-withdrawals-page

  //el-header
  page-title(title="menu.stockWithdrawals")

  el-container
    component(:is="showDetails ? 'el-aside' : 'el-main'")
      template
        .buttons()
          storage-select(v-model="storageId" ref="storageSelect")
          tool-button(tool="back" @click="onBack" v-if="showDetails")
          tool-button(tool="add" @click="onAdd()")
        resize(:padding="20")
          template(v-if="stockWithdrawals.length")
            stock-withdrawing-list(
              v-if="showList"
              :items="stockWithdrawals"
              @click="onItemClick"
              :active-id="$route.params.stockWithdrawingId"
            )
            stock-withdrawing-table(
              v-else
              @click="onItemClick"
              :items="stockWithdrawals"
              :size="tableSize"
            )
      alert-empty(
        v-if="currentStorageId && !stockWithdrawals.length"
        @click="onAdd()"
        :button-text="$tAction('start', 'stockWithdrawing')"
      )

    router-view

</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import StockWithdrawingList from '@/components/out/StockWithdrawingList.vue';
import StockWithdrawing from '@/models/StockWithdrawing';
import pageMixin from '@/lib/pageMixin';
import find from 'lodash/find';
import StorageSelect from '@/components/stock/StorageSelect.vue';
import StockWithdrawingTable from '@/components/out/StockWithdrawingTable.vue';
import vssMixin from '@/components/vssMixin';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockWithdrawalsPage',
  mixins: [pageMixin, vssMixin],
  components: { StockWithdrawingTable, StorageSelect, StockWithdrawingList },
  computed: {
    ...mapGetters({
      currentStorageId: g.CURRENT_STORAGE,
    }),
    showList() {
      return !this.showTable || this.showDetails;
    },
    stockWithdrawals() {
      return this.$orderBy(StockWithdrawing.reactiveFilter({
        storageId: this.storageId,
      }), ['date', 'cts'], ['desc', 'desc']);
    },
    showDetails() {
      const { name } = this.$route;
      return name === this.editRoute
        || find(this.$router.currentRoute.matched, { name: this.editRoute });
    },
    storageId: {
      get() {
        const { stockWithdrawingId } = this.$route.params;
        if (stockWithdrawingId) {
          const { storageId } = StockWithdrawing.reactiveGet(stockWithdrawingId) || {};
          if (storageId) {
            return storageId;
          }
        }
        return this.currentStorageId;
      },
      set(id) {
        this.setCurrentStorageId(id);
      },
    },
  },
  methods: {
    onAdd() {
      this.pushCreate({ storageId: this.storageId });
    },
    ...mapMutations({
      setCurrentStorageId: m.SET_CURRENT_STORAGE,
    }),
    onItemClick(item) {
      this.updateRouteParams({
        stockWithdrawingId: item.id,
      }, {}, this.editRoute);
    },
    onBack() {
      this.updateRouteParams({
        stockWithdrawingId: null,
      }, {}, this.rootState);
    },
  },
  created() {
    if (!this.storageId) {
      this.$nextTick(() => {
        this.$refs.storageSelect.open();
      });
    }
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

@include responsive-only(lt-md) {
  .el-container {
    flex-direction: column;
  }
  .el-aside {
    width: 100% !important;

    ::v-deep .stock-withdrawing-list-item:not(.active) {
      display: none;
    }

    margin-bottom: $margin-right;
  }
  .el-aside ::v-deep .stock-withdrawing-list-item {
    background: none;
    border-top: none;

    &, .el-button {
      color: inherit;
    }
  }
}

.el-aside {
  margin-right: $margin-top;

  .buttons {
    .storage-select {
      flex: 1;
    }
  }
}

.el-main {
  padding: 0;
}
</style>
