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
          el-badge(type="info" :value="idx +1")
        el-button(type="text" @click="removeMaterial(material)") {{ $t('delete') }}
      recipe-material-form(:model="material")
  .buttons
    el-button(type="text" @click="onAddMaterial") {{ $tAction('add', 'material') }}

</template>
<script>

import { v4 } from 'uuid';
import RecipeMaterialForm from '@/components/production/RecipeMaterialForm.vue';

/* eslint-disable vue/no-mutating-props */
export default {
  name: 'MaterialsForm',
  props: {
    materials: Array,
  },
  components: { RecipeMaterialForm },
  methods: {
    removeMaterial(material) {
      const { materials } = this;
      const idx = materials.indexOf(material);
      if (idx < 0) {
        return;
      }
      materials.splice(idx, 1);
      if (!materials.length) {
        this.$emit('create', null);
      }
    },
    onAddMaterial() {
      const material = {
        id: v4(),
        articleId: null,
        measureId: null,
        measureUnitId: null,
        units: null,
      };
      if (this.materials) {
        this.materials.push(material);
      } else {
        this.$emit('create', [material]);
      }
    },
  },
};

</script>
<style scoped lang="scss">
.idx {
  flex: 1;
}

.materials-form {
  padding-bottom: 60px;
}

</style>
