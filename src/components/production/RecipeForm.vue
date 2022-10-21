<template lang="pug">

.recipe-form
  el-form.article-form(
    :model="model"
    ref="form"
    :rules="rules"
  )
    el-form-item(:label="$t('fields.name')" prop="name")
      el-input(v-model="model.name")

    //template(v-if="model.materials.length")
    //  tool-button(tool="add" @click="onAddMaterial")

    .materials
      .material(
        v-for="(material, idx) in model.materials"
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

import RecipeMaterialForm from '@/components/production/RecipeMaterialForm.vue';
import { v4 } from 'uuid';
/* eslint-disable vue/no-mutating-props */

export default {
  name: 'RecipeForm',
  components: { RecipeMaterialForm },
  props: {
    model: Object,
  },
  computed: {
    rules() {
      return this.$requiredRule('name');
    },
  },
  methods: {
    removeMaterial(material) {
      const { materials } = this.model;
      const idx = materials.indexOf(material);
      if (idx < 0) {
        return;
      }
      materials.splice(idx, 1);
    },
    onAddMaterial() {
      this.model.materials.push({
        id: v4(),
        articleId: null,
        measureId: null,
        measureUnitId: null,
        units: null,
      });
    },
  },
};

</script>
<style scoped lang="scss">
.buttons + div {
  margin-top: 0;
}
.idx {
  flex: 1;
}
</style>
