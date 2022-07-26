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
            @click="toggleNameLock"
            :icon="model.isCustomName ? 'el-icon-unlock' : 'el-icon-lock'"
          )

    el-form-item(:label="$t('fields.code')" prop="code")
      el-input(v-model="model.code")

    transition-group(name="flip-list")
      el-form-item(
        v-for="(prop, idx) in articleProps" :key="prop.propId"
        :label="prop.prop.name"
        :prop="prop.prop.name"
      )
        ordering-buttons(
          :items="model.props"
          :item="model.props[idx]"
          @reorder="setName()"
          :show-clear="!prop.prop.isRequired"
        )
        el-button.naming(
          type="text"
          icon="el-icon-view"
          @click.stop.prevent="toggleNaming(prop, idx)"
          :class="{ 'is-naming': prop.isNaming }"
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
    prop-tags(:tags="tags" @click="addProp")

</template>
<script>
/* eslint-disable vue/no-mutating-props */

import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import * as catalogue from '@/services/catalogue';
import get from 'lodash/get';
import OrderingButtons from '@/lib/OrderingButtons.vue';
import PropTags from '@/components/props/PropTags.vue';
import find from 'lodash/find';
import findLastIndex from 'lodash/findLastIndex';

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
    tags() {
      const filter = ({ id }) => !find(this.articleProps, ({ propId: id }));
      const items = ArticleProp.reactiveFilter(filter);
      return catalogue.articlePropertySort(items);
    },
    rules() {
      const res = {
        ...this.$requiredRule('name'),
      };
      this.articleProps.forEach(({ prop }, idx) => {
        if (prop.isRequired) {
          res[prop.name] = [{
            message: this.$t('validation.required', [prop.name]),
            validator: (rule, value, callback) => {
              const propValues = this.model.props[idx];
              if (propValues.optionId || propValues.stringValue || propValues.numberValue) {
                callback();
              } else {
                callback(this.$t('validation.required', [prop.name]));
              }
            },
            trigger: 'blur',
          }];
        }
      });
      return res;
    },
    articleProps() {
      const { props = [] } = this.model;
      if (!props) {
        return [];
      }
      return props.map(p => {
        const { propId } = p;
        const prop = ArticleProp.reactiveGet(propId);
        const { type, isNaming } = prop;
        const options = type === 'options'
          && this.$orderBy(PropOption.reactiveFilter({ propId }), 'name');
        return {
          ...p,
          isNaming: (isNaming || p.isNaming) && p.isNaming !== false,
          type,
          prop,
          options,
          component: INPUTS.get(type),
        };
      });
    },
  },
  methods: {
    addProp(prop) {
      const modelProp = catalogue.propToArticlePropMap(prop);
      const { ord } = prop;
      const idx = findLastIndex(this.articleProps, p => p.prop.ord <= ord);
      if (idx === -1) {
        this.model.props.push(modelProp);
      } else {
        this.model.props.splice(idx + 1, 0, modelProp);
      }
      this.setName();
    },
    onPropInput(prop, value, idx) {
      this.model.props[idx][prop.component.field] = value;
      if (prop.type === 'options') {
        this.model.props[idx].stringValue = get(PropOption.getByID(value), 'name');
      }
      this.setName();
    },
    setName() {
      if (!this.model.isCustomName) {
        this.model.name = catalogue.compoundName(this.model.props);
      }
    },
    toggleNameLock() {
      this.model.isCustomName = !this.model.isCustomName;
      this.setName();
    },
    toggleNaming(prop, idx) {
      const aProp = this.model.props[idx];
      const { isNaming: isNamingProp } = aProp;
      const { isNaming } = prop.prop;
      const value = (!isNaming || isNamingProp === false) && !isNamingProp;
      this.$set(aProp, 'isNaming', value === isNaming ? null : value);
      this.setName();
    },
  },
  components: { OrderingButtons, PropTags },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.list-group-item {
  //display: flex;
  //justify-content: space-between;
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

.clear-prop {
  padding: $padding $padding $padding 0;
}

.naming {
  float: left;
  margin-left: $margin-right;
}

.el-select {
  display: flex;
  width: 100%;
}

.naming.is-naming {
  color: $green;
  font-weight: bold;
}

</style>
