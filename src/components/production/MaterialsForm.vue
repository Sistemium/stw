<template lang="pug">

.materials-form
  //template(v-if="materials.length")
    tool-button(tool="add" @click="onAddMaterial")
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
        el-link(@click="removeMaterial(material)" :disabled="disabled")
          small {{ $t('delete') }}
      recipe-material-form(
        :model="material"
        :ref="el => el && itemRefs.push(el)"
        :disabled="disabled"
      )
  .buttons
    el-link(@click="onAddMaterial()" :disabled="disabled")
      small {{ $tAction('add', 'material') }}

</template>
<script setup lang="ts">

import { onBeforeUpdate, ref } from 'vue';
import { v4 } from 'uuid';
import { eachSeries } from 'async';
import RecipeMaterialForm from '@/components/production/RecipeMaterialForm.vue';
import type { RecipeMaterial } from '@/models/Recipes';

/* eslint-disable vue/no-mutating-props */
const props = defineProps<{
  materials: RecipeMaterial[] | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'create', materials: RecipeMaterial[]): void;
}>();

const itemRefs = ref([]);

onBeforeUpdate(() => {
  itemRefs.value = [];
});

defineExpose({
  validate(callback) {
    eachSeries(itemRefs.value, (item, cb) => {
      item.validate(itemValid => {
        cb(itemValid ? null : Error('invalid item'));
      });
    }, err => {
      callback(!err);
    });
  },
})

function removeMaterial(material) {
  const { materials } = props;
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
    articleId: null,
    measureId: null,
    measureUnitId: null,
    units: null,
  };
  if (props.materials) {
    props.materials.push(material);
  } else {
    emit('create', [material]);
  }
}

</script>
<style scoped lang="scss">
.idx {
  flex: 1;
}

.materials-form {
  padding-bottom: 60px;
}

</style>
