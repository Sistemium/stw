<template lang="pug">

.stock-operation-item-list.list-group
  .list-group-item(
    v-for="item in items"
    :key="item.id"
    @click="emit('click', item)"
  )
    article-avatar(
      :article-id="item.articleId"
      size="default"
      @click.stop.prevent="emit('avatarClick', item.articleId)"
    )
    .title
      article-view(:article-id="item.articleId")
    .right
      .volume
        template(v-if="item.packages")
          span {{ item.packages }} {{ shortenedPackage(item.packageTypeId) }}
          template(v-if="item.packages > 1")
            span x
            span {{ item.unitsInPackage }}
          template(v-if="item.units > item.packages * item.unitsInPackage")
            span +
            span {{ item.units - item.packages * item.unitsInPackage }}
            span {{ $t(`units.short.${item.measureUnitId}`) }}
          span &equals;
        span {{ item.units }} {{ $t(`units.short.${item.measureUnitId}`) }}
      .cost(v-if="item.price")
        .price {{ item[priceField] }} &euro;
      article-cost-info(
        v-if="showSelfCost"
        :article-id="item.articleId"
        :storage-id="storageId"
        :date="date"
        :vat-prices="vatPrices"
        :vat-rate="item.vatRate"
        :materials="item.materials"
        :units="1"
        type="initCost"
        :custom-label="$t('shortened.selfCost')"
      )

</template>
<script setup lang="ts">
import ArticleView from '@/components/catalogue/ArticleView.vue';
import { shortenedPackage } from '@/models/PackageType.js';
import type { StockOperationItem } from '@/models/StockOperations';
import ArticleAvatar from '@/components/catalogue/ArticleAvatar.vue'
import ArticleCostInfo from '@/components/production/ArticleCostInfo.vue'

withDefaults(defineProps<{
  items: StockOperationItem[]
  priceField?: string
  vatPrices: boolean
  storageId: string
  date: string
  showSelfCost?: boolean
}>(), { priceField: 'price' });

const emit = defineEmits<{
  (e: 'click', item: StockOperationItem): void
  (e: 'avatarClick', articleId: string): void
}>();

</script>
<style scoped lang="scss">
@import "../../styles/pageLists";
.list-group-item {
  justify-content: flex-start;
  .title {
    flex: 1;
    margin-left: $padding;
  }
  .article-cost-info {
    margin-bottom: 0;
    :deep(> *) {
      line-height: inherit;
      height: inherit;
    }
    :deep(.el-form-item__label) {
      padding-right: $padding;
    }
  }
}
</style>
