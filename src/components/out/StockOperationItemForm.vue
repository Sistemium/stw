<template lang="pug">

el-tabs.stock-operation-item-form(:class="tabClass")

  el-tab-pane(:label="$t('concepts.article')")
    stock-taking-item-form(
      :model="model"
      :editable="editable"
      ref="form"
    )
      template(#article-extra)
        vat-mode-switch(v-model="formVatPrices" v-if="editable")
        price-form(
          :model="model"
          :vat-prices="formVatPrices"
        )
        article-cost-info(
          v-if="model.articleId && storageId && date"
          :article-id="model.articleId"
          :storage-id="storageId"
          :date="date"
          :vat-prices="formVatPrices"
          :vat-rate="vatRate"
          :materials="model.materials"
          :units="1"
          type="resultCost"
          @update-value="onUpdateCost"
        )

        template(
          v-if="model.tare"
        )
          el-form-item(:label="$t('fields.tare')")
          recipe-material-form(
            :model="model.tare"
            :units="false"
          )

        article-cost-info(
          v-if="model.articleId && model.stockReceivingId && finished"
          :article-id="model.articleId"
          :storage-id="storageId"
          :date="date"
          :vat-prices="formVatPrices"
          :vat-rate="vatRate"
          :materials="model.materials"
          :units="1"
          type="resultCost"
          :label-suffix="$t('after.stockReceiving')"
        )

  el-tab-pane(:label="$t('menu.materials')" v-if="model.materials")
    el-form(:model="model" :disabled="!editable")
      materials-form(
        :materials="model.materials"
        :disabled="!editable"
      )
        template(#material="{ material: material }")
          article-cost-info(
            v-if="material?.articleId && storageId && date"
            :article-id="material.articleId"
            :storage-id="storageId"
            :date="date"
            :vat-prices="formVatPrices"
            :vat-rate="vatRate"
            :units="material.units"
            :type="finished ? 'resultCost' : 'initCost'"
          )

</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import round from 'lodash/round'
import StockTakingItemForm from '@/components/stock/StockTakingItemForm.vue'
import MaterialsForm from '@/components/production/MaterialsForm.vue'
import ArticleCostInfo from '@/components/production/ArticleCostInfo.vue'
import PriceForm from '@/components/out/PriceForm.vue'
import Article from '@/models/Article'
import Storage from '@/models/Storage'
import VatModeSwitch from '@/components/out/VatModeSwitch.vue'
import type { StockOperationItem } from '@/models/StockOperations'
import { useFormValidate } from '@/services/validating'
import { type IPricing } from '@/models/Pricing'
import { getPricing, useSetPrices } from '@/services/pricing'
import RecipeMaterialForm from '@/components/production/RecipeMaterialForm.vue'

const props = defineProps<{
  editable: boolean;
  finished?: boolean;
  model: StockOperationItem;
  vatPrices: boolean;
  vatRate?: number;
  storageId?: string;
  date?: string;
  pricing?: IPricing
  markup?: number
}>()

const { form, validate } = useFormValidate()
const { setOtherPrice } = useSetPrices(props)

defineExpose({ validate })

const formVatPrices = ref(props.vatPrices)

const article = computed(() => Article.reactiveGet(props.model.articleId))
const articleMaterials = computed(() => {
  const { materials = null } = article.value || {}
  return materials
})
const tabClass = computed(() => !articleMaterials.value && 'single')
const storage = computed(() => Storage.reactiveGet(props.storageId))

watch(() => props.model.articleId, articleId => {
  const { value: materials } = articleMaterials
  const { vatRate } = props
  // eslint-disable-next-line vue/no-mutating-props
  props.model.materials = materials && cloneDeep(materials)
    .map(m => ({
      ...m,
      // vatRate,
    }));
  const { date, pricing } = props
  const tareArticleId = article.value?.tareArticleId
  if (tareArticleId) {
    // eslint-disable-next-line vue/no-mutating-props
    props.model.tare = {
      articleId: tareArticleId,
      price: 0,
      vatPrice: 0,
      units: 1,
      vatRate,
    }
  }
  if (articleId && date && pricing) {
    const { vatPrices } = pricing
    const priceField = vatPrices ? 'vatPrice' : 'price'
    const price = getPricing(
      pricing.id,
      articleId,
      date,
      storage.value?.siteId,
      storage.value?.employeeId,
    )
    formVatPrices.value = vatPrices
    // eslint-disable-next-line vue/no-mutating-props
    props.model[priceField] = price
    setOtherPrice(vatPrices, props.vatRate || 0, price)
  }
})

function onUpdateCost(cost: number) {
  if (props.markup) {
    const { value: vatPrices } = formVatPrices
    const priceField = vatPrices ? 'vatPrice' : 'price'
    // eslint-disable-next-line vue/no-mutating-props
    props.model[priceField] = round(cost * (1 + props.markup / 100), 2)
  }
}

</script>
<style scoped lang="scss">
.el-tabs.single :deep(.el-tabs__header) {
  display: none;
}
</style>
