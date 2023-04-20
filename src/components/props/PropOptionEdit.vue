<template lang="pug">

drawer-edit.prop-option-edit(
  :title="t('title')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :drawer-style="{ top: '65px', height: 'auto' }"
  :deletable="true"
)
  template(#default="{ model }")
    prop-option-form(
      ref="form"
      :model="model"
    )

</template>
<script setup>

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DrawerEdit from '@/lib/DrawerEdit.vue';
import PropOption from '@/models/PropOption';
import PropOptionForm from '@/components/props/PropOptionForm.vue';

const props = defineProps({
  propOptionId: String,
  from: Object,
  propId: String,
});

const form = ref(null);

function saveFn(props) {
  return PropOption.createOne(props);
}

function destroyFn(id) {
  return PropOption.destroy(id);
}

const modelOrigin = computed(() => {
  const { propOptionId, propId } = props;
  return propOptionId ? PropOption.reactiveGet(propOptionId) : { propId };
});

const { t } = useI18n({
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
});

</script>
