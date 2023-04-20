<template lang="pug">

drawer-edit.article-property-edit(
  :title="t('title')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="currentTab ==='0'"
)
  template(#default="{ model }")
    el-tabs(v-model="currentTab")
      el-tab-pane(:label="t('form')")
        article-property-form(ref="form" :model="model")
      el-tab-pane(
        :label="t('options')"
        v-if="articlePropId && model.type === 'options'"
        :lazy="true"
      )
        template(v-if="options.length")
          .tools
            tool-button(
              tool="add"
              @click="onAdd()"
            )
          resize(:padding="60")
            prop-option-list(:options="options" @click="optionClick" v-if="options.length")
        el-button.empty(v-else @click="onAdd()" type="primary") {{ $tAction('add', 'property') }}

    prop-option-edit(
      :prop-option-id="currentOptionId"
      v-if="currentOptionId !== null"
      @closed="currentOptionId = null"
      :prop-id="articlePropId"
    )

</template>
<script setup>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import ArticlePropertyForm from '@/components/ArticlePropertyForm.vue';
import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import PropOptionList from '@/components/catalogue/PropOptionList.vue';
import PropOptionEdit from '@/components/props/PropOptionEdit.vue';
import orderBy from 'lodash/orderBy';
import ToolButton from '@/lib/ToolButton.vue';
import Resize from '@/lib/Resize.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  articlePropId: String,
  from: Object,
});

const currentOptionId = ref('');
const currentTab = ref(null);

const modelOrigin = computed(() => {
  const { articlePropId } = props;
  return articlePropId ? ArticleProp.reactiveGet(articlePropId) : {
    isRequired: false,
    isNaming: true,
    ord: 0,
  };
});

const options = computed(() => {
  const { articlePropId: propId } = props;
  return propId ? orderBy(PropOption.reactiveFilter({ propId }), 'name') : [];
});

function saveFn(item) {
  return ArticleProp.createOne(item);
}

function destroyFn(id) {
  return ArticleProp.destroy(id);
}

function optionClick(option) {
  currentOptionId.value = option.id;
}

function onAdd() {
  currentOptionId.value = '';
}

const { t } = useI18n({
  messages: {
    en: {
      title: 'Property edit',
      form: 'Parameters',
      options: 'Options',
    },
    ru: {
      title: 'Редактирование признака',
      form: 'Параметры',
      options: 'Опции выбора',
    },
    lt: {
      title: 'Ypatybės redagavimas',
      form: 'Parametrai',
      options: 'Pasirinkimai',
    },
  },
});

</script>
<style lang="scss" scoped>
@import "../styles/variables";

.el-tabs {
  //margin-top: -$margin-top;
}

.tools {
  text-align: right;
  margin-bottom: $margin-right;
}

.empty {
  width: 100%;
}

</style>
