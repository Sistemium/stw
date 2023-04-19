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
  template(#default="{ model }")
    prop-option-form(ref="form" :model="model")

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
    propId: String,
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
      const { propOptionId, propId } = this;
      return propOptionId ? PropOption.reactiveGet(propOptionId) : { propId };
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
