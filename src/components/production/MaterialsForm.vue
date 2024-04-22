<template lang="pug">

.materials-form
  .materials
    .material(
      v-for="(material, idx) in materials"
      :key="material.id"
    )
      .buttons
        .idx
          el-badge(
            type="info"
            :value="idx +1"
          )
        article-view(:article-id="material.articleId")
        el-link(@click="removeMaterial(material)" :disabled="disabled")
          small {{ $t('delete') }}
      recipe-material-form(
        :model="material"
        :vat-prices="vatPrices"
        :ref="el => el && itemRefs.push(el)"
        :disabled="disabled"
        :prices="prices"
      )
        template(#default)
          slot(name="material" :material="material")
  .buttons
    el-link(@click="onAddMaterial()" :disabled="disabled")
      small {{ $tAction('add', 'material') }}

</template>
<script setup lang="ts">

import { onBeforeUpdate, ref } from 'vue';
import { v4 } from 'uuid';
import { eachSeries } from 'async';
import RecipeMaterialForm from '@/components/production/RecipeMaterialForm.vue';
import ArticleView from '@/components/catalogue/ArticleView.vue';
import type { MaterialFields, RecipeMaterial } from '@/models/Recipes'

/* eslint-disable vue/no-mutating-props */
const props = defineProps<{
  materials: Partial<RecipeMaterial>[] | null;
  disabled?: boolean;
  vatPrices?: boolean;
  vatRate?: number;
  prices?: boolean;
}>();
const emit = defineEmits<{
  (e: 'create', materials: Partial<RecipeMaterial>[] | null): void;
}>();

type Validator = (result: boolean) => any

const itemRefs = ref<{ validate(cb: Validator): any }[]>([]);

onBeforeUpdate(() => {
  itemRefs.value = [];
});

defineSlots<{
  material(props: { material: Partial<MaterialFields> }): any
}>()

defineExpose({
  validate(callback: Validator) {
    eachSeries(itemRefs.value, (item, cb) => {
      item.validate((itemValid: boolean) => {
        cb(itemValid ? null : Error('invalid item'));
      });
    }, err => {
      callback(!err);
    });
  },
})

function removeMaterial(material: RecipeMaterial) {
  const { materials } = props;
  if (!materials) {
    return
  }
  const idx = materials.indexOf(material);
  if (idx < 0) {
    return;
  }
  materials.splice(idx, 1);
  if (!materials.length) {
    emit('create', null);
  }
}

function onAddMaterial() {
  const material = {
    id: v4(),
    articleId: undefined,
    measureId: undefined,
    measureUnitId: undefined,
    units: undefined,
    price: undefined,
    vatPrice: undefined,
    vatRate: props.vatRate || 0,
  };
  if (props.materials) {
    props.materials.push(material);
  } else {
    emit('create', [material]);
  }
}

</script>
<style scoped lang="scss">
.article-view {
  flex: 1;
  :deep(.name) {
    display: none;
  }
}

.materials-form {
  padding-bottom: 60px;
}

</style>
