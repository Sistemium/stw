<template lang="pug">

virtual-scroll-list.article-list.list-group(
  v-if="height"
  :style="{ height: `${height}px` }"
  data-key="id"
  :data-sources="articles"
  :data-component="ArticleListItem"
  ref="scrollRef"
  :extra-props="{ activeId: selectedId, onClick, onAvatarClick }"
)

</template>
<script setup lang="ts">
import { ref } from 'vue';
import ArticleListItem from '@/components/catalogue/ArticleListItem.vue';
import VirtualScrollList from 'vue3-virtual-scroll-list';

//slot(name="header")
//slot(name="footer")
const props = defineProps<{
  articles: object[];
  selectedId?: string;
  propColumns: object[];
  height?: number;
}>();

const scrollRef = ref<{
  scrollToIndex(idx: number): void;
}>();

const emit = defineEmits<{
  (e: 'click', article: object): void
  (e: 'avatarClick', article: object): void
}>();

function onClick(item: object): void {
  emit('click', item);
}

function onAvatarClick(item: object): void {
  emit('avatarClick', item);
}

defineExpose({
  isReady(): boolean {
    return !!scrollRef.value;
  },
  scrollToId(id: string): boolean {
    const idx = props.articles.findIndex(item => item.id === id);
    if (idx < 0 || !scrollRef.value) {
      return false;
    }
    setTimeout(() => {
      scrollRef.value.scrollToIndex(idx ? idx - 1 : 0);
    }, 100);
    return true;
  },
});

</script>
<style scoped lang="scss">
@import "../../styles/variables";

.article-list {
  overflow-y: auto;
}
</style>
