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
        el-link(@click="removeMaterial(material)")
          small {{ $t('delete') }}
      recipe-material-form(:model="material")
  .buttons
    el-link(@click="onAddMaterial()")
      small {{ $tAction('add', 'material') }}

</template>
<script setup lang="ts">

import { v4 } from 'uuid';
import RecipeMaterialForm from '@/components/production/RecipeMaterialForm.vue';
import type { RecipeMaterial } from '@/models/Recipes';

/* eslint-disable vue/no-mutating-props */
const props = defineProps<{
  materials: RecipeMaterial[] | null;
}>();

const emit = defineEmits<{
  (e: 'create', materials: RecipeMaterial[]) : void;
}>();

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
