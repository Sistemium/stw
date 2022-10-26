<template lang="pug">

.stock-withdrawals-page

  //el-header
  page-title(:title="`menu.${rootState}`")

  el-container
    component(:is="showDetails ? 'el-aside' : 'el-main'")
      template
        .buttons()
          storage-select(v-model="storageId" ref="storageSelect" :disabled="showDetails")
          tool-button(tool="back" @click="onBack" v-if="showDetails")
          tool-button(tool="add" @click="onAdd()")
        resize(:padding="20")
          template(v-if="viewData.length")
            stock-operation-list(
              v-if="showList"
              :view-data="viewData"
              @click="onItemClick"
              :active-id="$route.params.stockOperationId"
            )
            stock-operation-table(
              v-else
              :view-data="viewData"
              @click="onItemClick"
              :size="tableSize"
              :counterparty-role="counterpartyRole"
            )
      alert-empty(
        v-if="currentStorageId && !stockOperations.length"
        @click="onAdd()"
        :button-text="$tAction('start', operationName)"
      )

    router-view

</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import StockOperationList from '@/components/out/StockOperationList.vue';
import pageMixin from '@/lib/pageMixin';
import find from 'lodash/find';
import { stockOperationToViewData } from '@/services/warehousing';
import StorageSelect from '@/components/stock/StorageSelect.vue';
import StockOperationTable from '@/components/out/StockOperationTable.vue';
import vssMixin from '@/components/vssMixin';
import * as g from '@/store/inv/getters';
import * as m from '@/store/inv/mutations';

const { mapGetters, mapMutations } = createNamespacedHelpers('inv');

export default {
  name: 'StockOperationsPage',
  mixins: [pageMixin, vssMixin],
  components: { StockOperationTable, StorageSelect, StockOperationList },
  props: {
    model: Object,
    positionsModel: Object,
    operationName: String,
    counterpartyRole: String,
  },
  computed: {
    viewData() {
      return this.stockOperations
        .map(o => stockOperationToViewData(o, this.positionsModel, this.operationName));
    },
    ...mapGetters({
      currentStorageId: g.CURRENT_STORAGE,
    }),
    showList() {
      return !this.showTable || this.showDetails;
    },
    stockOperations() {
      return this.$orderBy(this.model.reactiveFilter({
        storageId: this.storageId,
      }), ['date', 'cts'], ['desc', 'desc']);
    },
    showDetails() {
      const { name } = this.$route;
      return name === this.editRoute
        || !!find(this.$router.currentRoute.matched, { name: this.editRoute });
    },
    storageId: {
      get() {
        const { stockOperationId } = this.$route.params;
        if (stockOperationId) {
          const { storageId } = this.model.reactiveGet(stockOperationId) || {};
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
        stockOperationId: item.id,
      }, {}, this.editRoute);
    },
    onBack() {
      this.updateRouteParams({
        stockOperationId: null,
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

    ::v-deep .stock-operation-list-item:not(.active) {
      display: none;
    }

    margin-bottom: $margin-right;
  }
  .el-aside ::v-deep .stock-operation-list-item {
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
