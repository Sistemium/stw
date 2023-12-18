<template lang="pug">
.list-group-item(
  @click="onClick(source)"
  :class="{ active: activeId === source.id }"
)
  .avatar(@click.prevent.stop="onAvatarClick(source)")
    article-avatar(
      :article="source"
      size="default"
    )
  .description
    .name {{ source.name }}
    .code {{ source.code }}
</template>

<script setup lang="ts">
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue';

defineProps<{
  source: object;
  activeId?: string;
  onClick?: (item: object) => void;
  onAvatarClick?: (item: object) => void;
}>();
</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

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
