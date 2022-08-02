<template lang="pug">

.stock-withdrawing

  el-tabs(tab-position="top")
    el-tab-pane(:lazy="true" :label="$t('concepts.items')")
      .buttons
        workflow-transitions(
          :workflow="workflow"
          :value="stockWithdrawing.processing"
          @input="onProcessing"
          :disabled="busy"
        )
        tool-button(tool="add" @click="onAddItem" :disabled="disabled")
      resize(:padding="20")
        stock-withdrawing-item-list(
          :items="stockWithdrawingItems"
          @click="onItemClick"
          v-if="stockWithdrawingItems.length"
        )
        alert-empty(v-else @click="onAddItem" :button-text="$tAction('add', 'position')")
    el-tab-pane(:lazy="true" :label="$t('concepts.settings')")
      stock-withdrawing-edit(
        :is-drawer="false"
        :stock-withdrawing-id="stockWithdrawingId"
        @closed="onEditClose"
      )
  router-view

</template>
<script>
import StockWithdrawing, { workflow } from '@/models/StockWithdrawing';
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import StockWithdrawingItemList from '@/components/out/StockWithdrawingItemList.vue';
import StockWithdrawingEdit from '@/components/out/StockWithdrawingEdit.vue';
import pageMixin from '@/lib/pageMixin';
import WorkflowTransitions from '@/lib/WorkflowTransitions.vue';

export default {
  name: 'StockWithdrawingPage',
  components: { WorkflowTransitions, StockWithdrawingEdit, StockWithdrawingItemList },
  mixins: [pageMixin],
  props: {
    stockWithdrawingId: String,
    from: Object,
  },
  computed: {
    workflow() {
      return workflow;
    },
    stockWithdrawingItems() {
      const { stockWithdrawingId } = this;
      return StockWithdrawingItem.reactiveFilter({ stockWithdrawingId });
    },
    stockWithdrawing() {
      return StockWithdrawing.reactiveGet(this.stockWithdrawingId) || {};
    },
    disabled() {
      const { processing } = this.stockWithdrawing;
      return !workflow.step(processing).editable;
    },
  },
  methods: {
    onAddItem() {
      this.$router.push({
        name: this.createRoute,
        params: {
          stockWithdrawingId: this.stockWithdrawingId,
        },
      });
    },
    onItemClick(item) {
      this.$router.push({
        name: this.editRoute,
        params: {
          stockWithdrawingId: this.stockWithdrawingId,
          stockWithdrawingItemId: item.id,
        },
      });
    },
    onEditClose(record) {
      if (!record) {
        this.$router.replace({ name: this.from.name });
      }
    },
    onProcessing(processing) {
      this.setBusy(StockWithdrawing.patch(this.stockWithdrawingId, { processing }));
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

.stock-withdrawing {
  flex: 1;
}

.stock-withdrawing-edit {
  text-align: left;
  @include responsive-only(xxs) {
    text-align: right;
  }
}
</style>
