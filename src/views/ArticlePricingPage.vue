<template lang="pug">
.article-pricing-page.page
  page-title(title="menu.articlePricing")

  .filters
    pricing-select(v-model="pricingId")
    tool-button(
      :disabled="!pricingId"
      tool="add"
      @click="onAdd()"
    )

  article-pricing-row-edit(
    v-model="edit"
    :columns="tableColumns"
    @done="onAdd"
  )
  resize(
    :padding="20"
  )
    template(#default="{ resized } ")
      el-auto-resizer
        template(#default="{ width }")
          article-pricing-table(
            :article-pricing="articlePricing"
            :width="width"
            :column-width="150"
            :height="resized"
            @resize="onColumnsResize"
          )

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Resize from '@/lib/StmResize.vue'
import PageTitle from '@/components/PageTitle.vue'
import PricingSelect from '@/components/select/PricingSelect.vue'
import ArticlePricingTable from '@/components/catalogue/ArticlePricingTable.vue'
import ArticlePricing from '@/models/ArticlePricing'
import { fetchArticlePricing } from '@/services/dataSync'
import ToolButton from '@/lib/ToolButton.vue'
import { useRouteParams } from '@/lib/updateRouteParams'
import ArticlePricingRowEdit from '@/components/catalogue/ArticlePricingRowEdit.vue'

const { route, updateRouteParams } = useRouteParams()
const pricingId = ref(route.query.pricingId as string)
const articlePricing = computed(() => ArticlePricing.reactiveFilter({ pricingId: pricingId.value }))
const edit = ref({ price: 0, articleId: '' })
interface ColumnInfo {
  width: number
  key: string
}
const tableColumns = ref<ColumnInfo[]>([])

watch(pricingId, async (id: string) => {
  await updateRouteParams({}, { pricingId: id || undefined })
  if (id) {
    await fetchArticlePricing(id)
  }
})

watch(edit, e => {
  console.log(e)
}, { deep: true })

function onAdd() {
  ArticlePricing.createOne({ ...edit.value, date: new Date(), pricingId: pricingId.value })
    .then(() => {
      edit.value = { price: 0, articleId: '' }
    })
}

function onColumnsResize(columns: ColumnInfo[]) {
  tableColumns.value = columns
}

</script>

<style scoped lang="scss">
@import "@/styles/filters.scss";

.filters {
  justify-content: space-between;
  .pricing-select {
    width: 200px;
  }
  margin-bottom: $margin-right;
}

.article-pricing-row-edit {
  text-align: right;
}
</style>
