<template lang="pug">

.stock-withdrawing

  el-tabs
    el-tab-pane(:lazy="true" :label="$t('concepts.items')")
      .buttons
        tool-button(tool="add" @click="onAddItem")
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
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import StockWithdrawingItemList from '@/components/out/StockWithdrawingItemList.vue';
import StockWithdrawingEdit from '@/components/out/StockWithdrawingEdit.vue';
import pageMixin from '@/lib/pageMixin';

export default {
  name: 'StockWithdrawingPage',
  components: { StockWithdrawingEdit, StockWithdrawingItemList },
  mixins: [pageMixin],
  props: {
    stockWithdrawingId: String,
    from: Object,
  },
  computed: {
    stockWithdrawingItems() {
      const { stockWithdrawingId } = this;
      return StockWithdrawingItem.reactiveFilter({ stockWithdrawingId });
    },
  },
  methods: {
    onAddItem() {
      this.$router.push({
        name: this.createRoute,
        params: {
          // from: this.$route,
          stockWithdrawingId: this.stockWithdrawingId,
        },
      });
    },
    onItemClick(item) {
      this.$router.push({
        name: this.editRoute,
        params: {
          // from: this.$route,
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
