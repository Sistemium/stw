<template lang="pug">

drawer-edit.stock-withdrawing-product-edit(
  :title="$tGen('editing', 'productionItem')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
)
  template(v-slot="{ model }")
    stock-withdrawing-product-form(:model="model")

</template>
<script>

import drawerEditMixin from '@/lib/drawerEditMixin';
import StockWithdrawingProduct from '@/models/StockWithdrawingProduct';
import StockWithdrawingProductForm from '@/components/production/StockWithdrawingProductForm.vue';

export default {
  name: 'StockWithdrawingProductEdit',
  components: { StockWithdrawingProductForm },
  mixins: [drawerEditMixin],
  props: {
    stockOperationId: String,
    stockOperationItemId: String,
    from: Object,
  },
  computed: {
    modelOrigin() {
      const { stockOperationItemId: id, stockOperationId } = this;
      return id ? StockWithdrawingProduct.reactiveGet(id) : {
        stockWithdrawingId: stockOperationId,
        recipeId: null,
        units: null,
        materials: [],
      };
    },
  },
  methods: {
    destroyFn() {
      const { stockOperationItemId: id } = this;
      return id && StockWithdrawingProduct.destroy(id);
    },
    saveFn(props) {
      return StockWithdrawingProduct.createOne(props);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
