<template lang="pug">

drawer-edit.prop-option-edit(
  :title="$t('title')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :drawer-style="{ top: '65px' }"
  :deletable="true"
)
  template(v-slot="{ model }")
    prop-option-form(:model="model")

</template>
<script>
import DrawerEdit from '@/lib/DrawerEdit.vue';
import PropOption from '@/models/PropOption';
import PropOptionForm from '@/components/props/PropOptionForm.vue';

export default {
  name: 'PropOptionEdit',
  props: {
    propOptionId: String,
    from: Object,
  },
  methods: {
    saveFn(props) {
      return PropOption.createOne(props);
    },
    destroyFn(id) {
      return PropOption.destroy(id);
    },
  },
  computed: {
    modelOrigin() {
      const { propOptionId } = this;
      return propOptionId ? PropOption.reactiveGet(propOptionId) : {};
    },
  },
  components: {
    PropOptionForm,
    DrawerEdit,
  },
  i18n: {
    messages: {
      en: {
        title: 'Option editing',
      },
      ru: {
        title: 'Редактирование варианта',
      },
      lt: {
        title: 'Parinkties redagavimas',
      },
    },
  },
};

</script>
<style scoped lang="scss">

</style>
