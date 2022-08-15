<template lang="pug">

drawer-edit.stock-operation-edit(
  :title="$tGen('editing', operationName)"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :is-drawer="isDrawer"
)
  template(v-slot="{ model }")
    stock-operation-form(
      ref="form"
      :model="model"
      :counterparty-role="counterpartyRole"
    )

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import StockOperationForm from '@/components/out/StockOperationForm.vue';

export default {
  name: 'StockOperationEdit',
  components: { DrawerEdit, StockOperationForm },
  props: {
    stockOperationId: String,
    from: Object,
    editRoute: String,
    isDrawer: { type: Boolean, default: true },
    model: { type: Object, required: true },
    operationName: { type: String, required: true },
    counterpartyRole: { type: String, required: true },
  },
  computed: {
    modelOrigin() {
      const { stockOperationId } = this;
      return stockOperationId ? this.model.reactiveGet(stockOperationId) : {
        date: new Date().toJSON(),
        processing: 'progress',
        deviceCts: new Date().toJSON(),
        counterpartyType: null,
        counterpartyId: null,
        storageId: this.$route.query.storageId || null,
      };
    },
  },
  methods: {
    async saveFn(props) {
      const { id: stockOperationId } = await this.model.createOne(props);
      if (!this.stockWithdrawingId) {
        setTimeout(() => {
          this.$router.push({
            name: this.editRoute,
            params: { stockOperationId },
          })
            // .then(res => this.$debug(res))
            .catch(e => this.$error(e));
        }, 1);
      }
      return this.model.reactiveGet(stockOperationId);
    },
    destroyFn(id) {
      return this.model.destroy(id);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
