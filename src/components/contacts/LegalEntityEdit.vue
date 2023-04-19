<template lang="pug">

drawer-edit.legal-entity-edit(
  :title="$tGen('editing', 'legalEntity')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
  :is-drawer="isDrawer"
)
  template(#default="{ model }")
    legal-entity-form(:model="model")

</template>
<script>
import drawerEditMixin from '@/lib/drawerEditMixin';
import LegalEntity from '@/models/LegalEntity';
import LegalEntityForm from '@/components/contacts/LegalEntityForm.vue';

export default {
  name: 'LegalEntityEdit',
  components: { LegalEntityForm },
  mixins: [drawerEditMixin],
  props: {
    legalEntityId: String,
  },
  computed: {
    stockWithdrawing() {
      return LegalEntity.reactiveGet(this.legalEntityId);
    },
    modelOrigin() {
      const { legalEntityId } = this;
      return legalEntityId ? LegalEntity.reactiveGet(legalEntityId)
        : {
          name: null,
          code: null,
          vatCode: null,
          address: null,
        };
    },
    editable() {
      const { processing } = this.stockWithdrawing || {};
      return processing === 'progress';
    },
  },
  methods: {
    saveFn(props) {
      return LegalEntity.createOne(props);
    },
    destroyFn(id) {
      return LegalEntity.destroy(id);
    },
  },
};

</script>
<style scoped lang="scss">

</style>
