<template lang="pug">

.stock-taking-item-list.list-group(v-if="items.length")
  .list-group-item(
    v-for="item in items"
    :key="item.id"
    @click="emit('click', item)"
  )
    .title
      article-view(:article-id="item.articleId")
      .cts {{ $ts(item.deviceCts || item.cts) }}
    .right
      .volumes
        template(v-if="item.packages")
          span.quantity {{ item.packages }} {{ shortenedPackage(item.packageTypeId) }}
          span x
          span.boxRel {{ item.unitsInPackage }}
          template(v-if="item.units > item.packages * item.unitsInPackage")
            span +
            span {{ item.units - item.packages * item.unitsInPackage }}
            span {{ $t(`units.short.${item.measureUnitId}`) }}
          span &equals;
        span.units {{ item.units }} {{ $t(`units.short.${item.measureUnitId}`) }}

</template>
<script setup>
import ArticleView from '@/components/catalogue/ArticleView.vue';
import { shortenedPackage } from '@/models/PackageType';

defineProps({
  items: Array,
});

const emit  = defineEmits(['click']);

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
</style>
