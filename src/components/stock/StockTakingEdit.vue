<template lang="pug">

drawer-edit.stock-taking-edit(
  :title="$tGen('editing', 'stockTaking')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="editable"
  :is-drawer="isDrawer"
)
  template(v-slot="{ model }")
    stock-taking-form(ref="form" :model="model" :disabled="!editable")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockTaking, { workflow } from '@/models/StockTaking';
import StockTakingForm from '@/components/stock/StockTakingForm.vue';

export default {
  name: 'StockTakingEdit',
  props: {
    stockTakingId: String,
    from: Object,
    progressRoute: String,
    isDrawer: { type: Boolean, default: true },
  },
  computed: {
    modelOrigin() {
      const { stockTakingId } = this;
      return stockTakingId ? StockTaking.reactiveGet(stockTakingId) : {
        date: new Date().toJSON(),
        processing: 'progress',
        deviceCts: new Date().toJSON(),
      };
    },
    editable() {
      const { processing } = this.modelOrigin;
      return workflow.step(processing).editable;
    },
  },
  methods: {
    async saveFn(props) {
      const { id: stockTakingId, processing } = await StockTaking.createOne(props);
      const { progressRoute } = this;
      if (progressRoute && processing === 'progress') {
        await this.$router.push({
          name: this.progressRoute,
          params: { stockTakingId },
        });
      }
      return StockTaking.reactiveGet(stockTakingId);
    },
    destroyFn(id) {
      return StockTaking.destroy(id);
    },
  },
  components: { StockTakingForm, DrawerEdit },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.stock-taking-edit {
  text-align: left;
  @include responsive-only(xxs) {
    text-align: right;
  }
}
</style>
