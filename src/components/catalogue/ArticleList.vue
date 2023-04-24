<template lang="pug">

.article-list.list-group
  slot(name="header")
  .list-group-item(
    v-for="article in articles"
    :key="article.id"
    :id="`id-${article.id}`"
    @click="emit('click', article)"
  )
    .avatar(@click.prevent.stop="emit('avatarClick', article)")
      article-avatar(
        :article="article"
        size="default"
      )
    .description
      .name {{ article.name }}
      .code {{ article.code }}

  slot(name="footer")

</template>
<script setup lang="ts">

import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';

defineProps<{
  articles: object[],
}>();

const emit = defineEmits<{
  (e: 'click', article: object): void
  (e: 'avatarClick', article: object): void
}>();

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
