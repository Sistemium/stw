<template lang="pug">

.article-list.list-group
  slot(name="header")
  .list-group-item(
    v-for="article in articles" :key="article.id"
    @click="$emit('click', article)"
  )
    .name {{ article.name }}
  slot(name="footer")

</template>
<script>

export default {
  name: 'ArticleList',
  props: {
    articles: Array,
  },
};

</script>
<style scoped lang="scss">

</style>
