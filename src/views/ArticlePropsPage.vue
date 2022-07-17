<template lang="pug">

.article-props.page

  page-title(title="menu.articlePropsTitle")

  .buttons
    tool-button(tool="add" @click="onAdd")

  resize(:padding="20")
    article-props-list(
      :article-props="articleProps" @click="onPropClick"
      v-if="articleProps.length"
    )
    el-alert(type="info" :title="$t('validation.noData')" :closable="false" v-else)
      el-button(
        type="primary" @click="onAdd" :plain="true"
      ) {{ $tAction('add', 'property') }}

  router-view

</template>
<script>
import ArticleProp from '@/models/ArticleProp';
import ArticlePropsList from '@/components/catalogue/ArticlePropsList.vue';
import orderBy from 'lodash/orderBy';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'ArticlePropsPage',
  props: {
    editRoute: String,
    createRoute: String,
  },
  computed: {
    articleProps() {
      return orderBy(ArticleProp.reactiveFilter({}), ['isRequired', 'name'], ['desc', 'asc']);
    },
    showDrawer() {
      return this.$route.name === this.editRoute;
    },
  },
  methods: {
    onPropClick(prop) {
      this.$router.push({
        name: this.editRoute,
        params: {
          articlePropId: prop.id,
        },
      });
    },
    onAdd() {
      this.$router.push({
        name: this.createRoute,
      });
    },
  },
  components: { PageTitle, ArticlePropsList },
};

</script>
<style scoped lang="scss">
@import "../styles/page";
</style>
