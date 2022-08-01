<template lang="pug">

drawer-edit.stock-withdrawing-edit(
  :title="$tGen('editing', 'stockWithdrawing')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :is-drawer="isDrawer"
)
  template(v-slot="{ model }")
    stock-withdrawing-form(ref="form" :model="model")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockWithdrawing from '@/models/StockWithdrawing';
import StockWithdrawingForm from '@/components/out/StockWithdrawingForm.vue';
// import { stockWithdrawingIdSync } from '@/services/dataSync';

export default {
  name: 'StockWithdrawingEdit',
  components: { DrawerEdit, StockWithdrawingForm },
  props: {
    stockWithdrawingId: String,
    from: Object,
    editRoute: String,
    isDrawer: { type: Boolean, default: true },
  },
  computed: {
    modelOrigin() {
      const { stockWithdrawingId } = this;
      return stockWithdrawingId ? StockWithdrawing.reactiveGet(stockWithdrawingId) : {
        date: new Date().toJSON(),
        processing: 'progress',
        deviceCts: new Date().toJSON(),
        consigneeType: null,
        consigneeId: null,
      };
    },
  },
  methods: {
    async saveFn(props) {
      const { id: stockWithdrawingId } = await StockWithdrawing.createOne(props);
      if (!this.stockWithdrawingId) {
        setTimeout(() => {
          this.$router.push({
            name: this.editRoute,
            params: { stockWithdrawingId },
          })
            .then(res => this.$debug(res))
            .catch(e => this.$error(e));
        }, 1);
      }
      return StockWithdrawing.reactiveGet(stockWithdrawingId);
    },
    destroyFn(id) {
      return StockWithdrawing.destroy(id);
    },
  },
  beforeRouteUpdate(to, from, next) {
    // eslint-disable-next-line no-console
    console.log('before', this.$route.path);
    next();
  },
};

</script>
<style scoped lang="scss">

</style>
