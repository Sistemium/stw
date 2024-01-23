<template lang="pug">
// eslint-disable vue/no-mutating-props
.article-form
  el-form.article-form(
    ref="form"
    :model="model"
    :rules="rules"
  )

    transition-group(name="flip-list")
      el-form-item(
        v-for="(prop, idx) in articleProps" :key="prop.propId"
        :label="prop.prop.name"
        :prop="prop.prop.name"
      )
        ordering-buttons(
          :items="model.props"
          :item="model.props[idx]"
          :show-clear="!prop.prop.isRequired"
          @reorder="setName()"
        )
        el-link.naming(
          :class="{ 'is-naming': prop.isNaming }"
          :icon="View"
          @click.stop.prevent="toggleNaming(prop, idx)"
        )
        component(
          v-if="prop.component"
          :is="prop.component.is"
          :model-value="model.props[idx][prop.component.field]"
          @button-click="addOptionClick(prop)"
          @update:model-value="value => onPropInput(prop, value, idx)"
        )
          template(v-if="prop.options")
            el-option(
              v-for="{ id, name } in prop.options"
              :key="id"
              :label="name"
              :value="id"
            )
    prop-tags(
      :tags="tags"
      @click="addProp"
    )

    el-form-item(
      :label="$t('fields.code')"
      prop="code"
    )
      el-input(v-model.trim="model.code")

    el-form-item(
      :label="$t('fields.name')"
      prop="name"
    )
      el-input(
        v-model="model.name"
        :readonly="!model.isCustomName"
      )
        template(#append)
          el-button(
            :class="model.isCustomName && 'isCustomName'"
            :icon="model.isCustomName ? Unlock : Lock"
            @click="toggleNameLock"
          )

  prop-option-edit(
    :prop-id="editingPropId"
    v-if="editingPropId"
    @saved="optionSaved"
    @closed="editingPropId = null"
  )

</template>
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */

import { computed, ref } from 'vue';
import type { Component } from 'vue';
import findIndex from 'lodash/findIndex';
import findLastIndex from 'lodash/findLastIndex';
import get from 'lodash/get';
import find from 'lodash/find';
import { Unlock, Lock, View } from '@element-plus/icons-vue';
import OrderingButtons from '@/lib/OrderingButtons.vue';
import PropOptionEdit from '@/components/props/PropOptionEdit.vue';
import PropTags from '@/components/props/PropTags.vue';
import * as catalogue from '@/services/catalogue.js';
import PropOption from '@/models/PropOption.js';
import { filterArticleProps, getArticleProp } from '@/models/ArticleProps';
import type ArticleProp from '@/models/ArticleProps';
import { $requiredRule, t } from '@/lib/validations';
import type { IArticle, ArticleProperty } from '@/models/Articles';
import orderBy from 'lodash/orderBy';
import PrependSelect from '@/lib/PrependSelect.vue';
import { useFormValidate } from '@/services/validating';

interface ArticleFormComponent {
  is: string | Component;
  field: string;
}

const props = defineProps<{
  model: IArticle;
}>();

const { form, validate } = useFormValidate();

defineExpose({ validate });

const INPUTS = new Map<string, ArticleFormComponent>([
  ['boolean', { is: 'el-switch', field: 'boolValue' }],
  ['number', { is: 'el-input-number', field: 'numberValue' }],
  ['string', { is: 'el-input', field: 'stringValue' }],
  ['options', { is: PrependSelect, field: 'optionId' }],
]);

const editingPropId = ref('');

const tags = computed(() => {
  const filter = ({ id }) => !find(articleProps.value, ({ propId: id }));
  const items = filterArticleProps(filter);
  return catalogue.articlePropertySort(items);
});

const rules = computed(() => {

  const res = $requiredRule('name');

  articleProps.value.forEach(({ prop }, idx) => {
    if (prop.isRequired) {
      res[prop.name] = [{
        message: t('validation.required', [prop.name]),
        validator: (rule, value, callback) => {
          const propValues = props.model.props[idx];
          if (propValues.optionId || propValues.stringValue || propValues.numberValue) {
            callback();
          } else {
            callback(t('validation.required', [prop.name]));
          }
        },
        trigger: 'blur',
      }];
    }
  });
  return res;

});

interface FormArticleProperty extends ArticleProperty {
  component: ArticleFormComponent;
  prop: ArticleProp;
  options: object[];
}

const articleProps = computed<FormArticleProperty[]>(() => {
  const { props: properties = [] } = props.model;
  return properties.map(p => {
    const { propId } = p;
    const prop = getArticleProp(propId);
    const { type, isNaming } = prop;
    const options = type === 'options'
      && orderBy(PropOption.reactiveFilter({ propId }), 'name');
    return {
      ...p,
      isNaming: (isNaming || p.isNaming) && p.isNaming !== false,
      type,
      prop,
      options,
      component: INPUTS.get(type),
    };
  });
});

function optionSaved(option) {
  if (option) {
    const { value: propId } = editingPropId;
    // debug('optionSaved', propId, option);
    const idx = findIndex(articleProps.value, { propId });
    onPropInput(articleProps.value[idx], option.id, idx);
  }
}

function addOptionClick(prop) {
  // debug('addOptionClick:', prop);
  editingPropId.value = prop.propId;
}

function addProp(prop) {
  const modelProp = catalogue.propToArticlePropMap(prop);
  const { ord } = prop;
  const idx = findLastIndex(articleProps.value, p => p.prop.ord <= ord);
  if (idx === -1) {
    props.model.props.push(modelProp);
  } else {
    props.model.props.splice(idx + 1, 0, modelProp);
  }
  setName();
}

function onPropInput(prop, value, idx) {
  props.model.props[idx][prop.component.field] = value;
  if (prop.type === 'options') {
    props.model.props[idx].stringValue = get(PropOption.getByID(value), 'name');
  }
  setName();
}

function setName() {
  if (!props.model.isCustomName) {
    props.model.name = catalogue.compoundName(props.model.props);
  }
}

function toggleNameLock() {
  props.model.isCustomName = !props.model.isCustomName;
  setName();
}

function toggleNaming(prop, idx) {
  const aProp = props.model.props[idx];
  const { isNaming: isNamingProp } = aProp;
  const { isNaming } = prop.prop;
  const value = (!isNaming || isNamingProp === false) && !isNamingProp;
  aProp.isNaming = (value === isNaming ? null : value);
  setName();
}

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

.isCustomName :deep(i) {
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

.el-form-item {
  display: block;
  :deep(label) {
    float: left;
  }
  :deep(.el-form-item__content) {
    display: block;
  }
}

</style>
