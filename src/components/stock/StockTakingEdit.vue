<template lang="pug">

drawer-edit.stock-taking-edit(
  :title="$tGen('editing', 'stockTaking')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="editable"
  :is-drawer="isDrawer"
  :after-close-to="afterCloseTo"
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
    editRoute: String,
    isDrawer: { type: Boolean, default: true },
  },
  data() {
    return {
      afterCloseTo: null,
    };
  },
  computed: {
    modelOrigin() {
      const { stockTakingId } = this;
      const { storageId } = this.$route.query;
      return stockTakingId ? StockTaking.reactiveGet(stockTakingId) : {
        date: new Date().toJSON(),
        processing: 'progress',
        deviceCts: new Date().toJSON(),
        storageId,
      };
    },
    editable() {
      const { processing } = this.modelOrigin || {};
      return workflow.step(processing).editable;
    },
  },
  methods: {
    async saveFn(props) {
      const { id: stockTakingId, processing } = await StockTaking.createOne(props);
      if (processing === 'progress') {
        this.afterCloseTo = {
          name: 'stockTakingProgress',
          params: { stockTakingId },
        };
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
