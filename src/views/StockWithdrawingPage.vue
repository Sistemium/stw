<template lang="pug">

.stock-withdrawing
  //page-title()
  .buttons
    tool-button(tool="add" @click="onAddItem")
  resize(:padding="20")
    stock-withdrawing-item-list(
      :items="stockWithdrawingItems"
      @click="onItemClick"
      v-if="stockWithdrawingItems.length"
    )
    alert-empty(v-else @click="onAddItem" :button-text="$tAction('add', 'position')")
  router-view

</template>
<script>
import StockWithdrawingItem from '@/models/StockWithdrawingItem';
import StockWithdrawingItemList from '@/components/out/StockWithdrawingItemList.vue';
import pageMixin from '@/lib/pageMixin';

export default {
  name: 'StockWithdrawingPage',
  components: { StockWithdrawingItemList },
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
  },
};

</script>
<style scoped lang="scss">
.stock-withdrawing {
  flex: 1;
}
</style>
