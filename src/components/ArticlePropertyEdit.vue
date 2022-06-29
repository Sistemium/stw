<template lang="pug">

  drawer-edit.article-property-edit(
    :title="$t('title')"
    :save-fn="saveFn"
    :destroy-fn="destroyFn"
    :model-origin="modelOrigin"
    :from="from"
  )
    template(v-slot="{ model }")
      article-property-form(ref="form" :model="model")

</template>
<script>

import DrawerEdit from '@/lib/DrawerEdit.vue';
import ArticlePropertyForm from '@/components/ArticlePropertyForm.vue';
import ArticleProp from '@/models/ArticleProp';

export default {
  name: 'ArticlePropertyEdit',
  props: {
    articlePropId: String,
    from: Object,
  },
  computed: {
    modelOrigin() {
      const { articlePropId } = this;
      return articlePropId ? ArticleProp.reactiveGet(articlePropId) : {};
    },
  },
  components: {
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
  },
  i18n: {
    messages: {
      en: {
        title: 'Property edit',
      },
      ru: {
        title: 'Редактирование признака',
      },
      lt: {
        title: 'Ypatybės redagavimas',
      },
    },
  },
};

</script>
