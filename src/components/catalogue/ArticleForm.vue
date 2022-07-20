<template lang="pug">

.article-form
  el-form.article-form(
    :model="model"
    ref="form"
    :rules="rules"
  )

    el-form-item(:label="$t('fields.name')" prop="name")
      el-input(v-model="model.name" :readonly="!model.isCustomName")
        template(v-slot:append)
          el-button(
            :class="model.isCustomName && 'isCustomName'"
            @click="toggleClock"
            :icon="model.isCustomName ? 'el-icon-unlock' : 'el-icon-lock'"
          )

    el-form-item(
      v-for="(prop, idx) in articleProps" :key="prop.id"
      :label="prop.prop.name"
    )
      ordering-buttons(
        :items="model.props"
        :item="model.props[idx]"
        @reorder="setName()"
      )
      component(
        v-if="prop.component"
        :is="prop.component.is"
        :value="model.props[idx][prop.component.field]"
        @input="value => onPropInput(prop, value, idx)"
      )
        template(v-if="prop.options")
          el-option(
            v-for="{ id, name } in prop.options" :key="id"
            :value="id"
            :label="name"
          )

</template>
<script>
/* eslint-disable vue/no-mutating-props */

import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import { compoundName } from '@/services/catalogue';
import get from 'lodash/get';
import OrderingButtons from '@/lib/OrderingButtons.vue';

const INPUTS = new Map([
  ['boolean', { is: 'el-switch', field: 'boolValue' }],
  ['number', { is: 'el-input-number', field: 'numberValue' }],
  ['string', { is: 'el-input', field: 'stringValue' }],
  ['options', { is: 'el-select', field: 'optionId' }],
]);

export default {
  name: 'ArticleForm',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    rules() {
      return {
        ...this.$requiredRule('name'),
      };
    },
    articleProps() {
      const { props = [] } = this.model;
      if (!props) {
        return [];
      }
      return props.map(p => {
        const { propId } = p;
        const prop = ArticleProp.reactiveGet(propId);
        const { type } = prop;
        const options = type === 'options' && PropOption.reactiveFilter({ propId });
        return {
          ...p,
          type,
          prop,
          options,
          component: INPUTS.get(type),
        };
      });
    },
  },
  methods: {
    onPropInput(prop, value, idx) {
      this.$debug(prop, value, idx);
      this.model.props[idx][prop.component.field] = value;
      if (prop.type === 'options') {
        this.model.props[idx].stringValue = get(PropOption.getByID(value), 'name');
      }
      this.setName();
    },
    setName() {
      if (!this.model.isCustomName) {
        this.model.name = compoundName(this.model.props);
      }
    },
    toggleClock() {
      this.model.isCustomName = !this.model.isCustomName;
      this.setName();
    },
  },
  components: { OrderingButtons },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.list-group-item {
  display: flex;
  justify-content: space-between;
}

.ordering-buttons {
  float: left;
}

.el-form-item {
  text-align: right;
}

.isCustomName ::v-deep i {
  color: $red;
}

</style>
