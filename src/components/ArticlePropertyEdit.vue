<template lang="pug">

drawer-edit.article-property-edit(
  :title="$t('title')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
)
  template(v-slot="{ model }")
    el-tabs
      el-tab-pane(:label="$t('form')")
        article-property-form(ref="form" :model="model")
      el-tab-pane(:label="$t('options')" v-if="articlePropId && model.type === 'options'")
        prop-option-list(:options="options" @click="optionClick")

    prop-option-edit(
      :prop-option-id="currentOptionId"
      v-if="currentOptionId"
      @closed="currentOptionId = null"
    )

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import ArticlePropertyForm from '@/components/ArticlePropertyForm.vue';
import ArticleProp from '@/models/ArticleProp';
import PropOption from '@/models/PropOption';
import PropOptionList from '@/components/catalogue/PropOptionList.vue';
import PropOptionEdit from '@/components/props/PropOptionEdit.vue';
import orderBy from 'lodash/orderBy';

export default {
  name: 'ArticlePropertyEdit',
  props: {
    articlePropId: String,
    from: Object,
  },
  data() {
    return {
      currentOptionId: null,
    };
  },
  computed: {
    modelOrigin() {
      const { articlePropId } = this;
      return articlePropId ? ArticleProp.reactiveGet(articlePropId) : {};
    },
    options() {
      const { articlePropId: propId } = this;
      return propId ? orderBy(PropOption.reactiveFilter({ propId }), 'name') : [];
    },
  },
  components: {
    PropOptionEdit,
    PropOptionList,
    ArticlePropertyForm,
    DrawerEdit,
  },
  methods: {
    saveFn(props) {
      return ArticleProp.createOne(props);
    },
    destroyFn(id) {
      return ArticleProp.destroy(id);
    },
    optionClick(option) {
      this.currentOptionId = option.id;
    },
  },
  i18n: {
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
  },
};

</script>
<style lang="scss" scoped>
@import "../styles/variables";

.el-tabs {
  margin-top: -$margin-top;
}
</style>
