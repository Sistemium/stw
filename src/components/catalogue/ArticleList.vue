<template lang="pug">

.article-list.list-group
  slot(name="header")
  .list-group-item(
    :id="`id-${article.id}`"
    v-for="article in articles" :key="article.id"
    @click="$emit('click', article)"
  )
    .avatar(@click.prevent.stop="$emit('avatarClick', article)")
      article-avatar(:article="article" size="medium")
    .description
      .name {{ article.name }}
      .code {{ article.code }}
  slot(name="footer")

</template>
<script>

import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';

export default {
  name: 'ArticleList',
  components: { ArticleAvatar },
  props: {
    articles: Array,
  },
};

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.code {
  text-align: right;
  font-size: smaller;
}

.list-group-item {
  display: flex;
  text-align: left;
  .description {
    margin-left: $padding;
    flex: 1;
  }
  .el-avatar {
    //width: 30px;
    //height: 30px;
  }
}

</style>
