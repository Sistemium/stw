<template lang="pug">

el-table.article-table(
  :size="size"
  stripe
  :data="articles"
  :height="height"
  @row-click="rowClick"
  row-key="id"
)
  el-table-column(
    column-key="avatar"
    :width="60"
  )
    template(v-slot="{ row }")
      article-avatar(:article="row" size="medium")
  el-table-column(
    prop="name"
    :label="$t('fields.name')"
  )
  el-table-column(
    prop="code"
    :label="$t('fields.code')"
  )
  el-table-column(
    v-for="prop in propColumns"
    :key="prop.id"
    :prop="prop.id"
    :label="prop.name"
    :align="prop.align"
  )
  el-table-column(column-key="buttons" :width="50" align="center")
    i.el-icon-edit

</template>
<script>

import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';

export default {
  name: 'ArticleTable',
  components: { ArticleAvatar },
  props: {
    articles: Array,
    propColumns: Array,
    size: String,
    height: Number,
  },
  methods: {
    rowClick(row, { columnKey }) {
      // eslint-disable-next-line default-case
      switch (columnKey) {
        case 'buttons':
          this.$emit('click', row);
          break;
        case 'avatar':
          this.$emit('avatarClick', row);
      }
    },
  },
};

</script>
<style scoped lang="scss">
.el-icon-edit {
  cursor: pointer;
}
</style>
