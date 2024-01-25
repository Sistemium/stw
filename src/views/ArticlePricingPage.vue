<template lang="pug">
  .article-pricing-page.page
    page-title(title="menu.articlePricing")

    .filters
      .searchers
        pricing-select(v-model="pricingId")
        search-input(
          v-model="search"
        )
      .tools
        tool-button(
          :disabled="!pricingId"
          :tool="editing ? 'check' : 'edit'"
          @click="onEdit()"
        )
        //tool-button(
        //  :disabled="!pricingId || editing"
        //  tool="add"
        //  @click="onAdd()"
        //)

    //article-pricing-row-edit(
    //  v-model="edit"
    //  :columns="tableColumns"
    //  @done="onAdd"
    //)
    resize(
      :padding="20"
      v-loading="loading"
    )
      template(#default="{ resized } ")
        el-auto-resizer
          template(#default="{ width }")
            article-pricing-table(
              :article-pricing="articlePricingFiltered"
              :width="width"
              :editing="editing"
              :column-width="150"
              :height="resized"
              @resize="onColumnsResize"
              @price-change="onPriceChange"
            )

</template>

<script setup lang="ts">
import keyBy from 'lodash/keyBy'
import orderBy from 'lodash/orderBy'
import { computed, ref, watch } from 'vue'
import Resize from '@/lib/StmResize.vue'
import PageTitle from '@/components/PageTitle.vue'
import PricingSelect from '@/components/select/PricingSelect.vue'
import ArticlePricingTable from '@/components/catalogue/ArticlePricingTable.vue'
import ArticlePricing from '@/models/ArticlePricing'
import Article from '@/models/Article'
import { fetchArticlePricing } from '@/services/dataSync'
import ToolButton from '@/lib/ToolButton.vue'
import { useRouteParams } from '@/lib/updateRouteParams'
// import ArticlePricingRowEdit from '@/components/catalogue/ArticlePricingRowEdit.vue'
import SearchInput from '@/lib/SearchInput.vue'
import { likeLt } from '@/services/lt'

interface ColumnInfo {
  width: number
  key: string
}

const { route, updateRouteParams } = useRouteParams()
const pricingId = ref(route.query.pricingId as string)
// const edit = ref({ price: 0, articleId: '' })
const tableColumns = ref<ColumnInfo[]>([])
const editing = ref<boolan>(false)
const search = ref<string>('')
const date = ref(new Date())
const loading = ref<boolean>(false)

const articlePricingFiltered = computed(() => {
  const data = articlePricing.value.map(ap => ({
    ...ap,
    article: Article.getByID(ap.articleId),
  }))
  const sorted = orderBy(data, item => item.article?.name)
  const { value } = search
  if (!value) {
    return sorted
  }
  const re = likeLt(value)
  return sorted.filter(ap => {
    return ap.article && re.test(ap.article.name)
  })
})

const articlePricing = computed(() => {
  const data = ArticlePricing.reactiveManyByIndex('pricingId', pricingId.value)
  if (!editing.value) {
    return data
  }
  const articles = Article.reactiveFilter()
  const keyed = keyBy(data, 'articleId')
  return articles.map(a => {
    const existing = keyed[a.id] || {}
    return Object.assign({
      pricingId: pricingId.value,
      articleId: a.id,
      date: date.value,
      price: 0,
    }, existing)
  })
})

watch(pricingId, async (id: string) => {
  await updateRouteParams({}, { pricingId: id || undefined })
  if (id) {
    loading.value = true
    await fetchArticlePricing(id)
      .finally(() => {
        loading.value = false
      })

  }
})

async function onPriceChange(articleId: string, price: number) {
  const existing = articlePricing.value.find(ap => ap.articleId === articleId)
  loading.value = true
  try {
    if (existing?.id) {
      await ArticlePricing.updateOne({ id: existing.id, price })
    } else {
      await ArticlePricing.createOne({
        date: date.value,
        pricingId: pricingId.value,
        articleId,
        price,
      })
    }
  } finally {
    loading.value = false
  }
}

// function onAdd() {
//   ArticlePricing.createOne({ ...edit.value, date: date.value, pricingId: pricingId.value })
//     .then(() => {
//       edit.value = { price: 0, articleId: '' }
//     })
// }

function onEdit() {
  editing.value = !editing.value
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

.searchers {
  > * + * {
    margin-left: $margin-right;
  }
}
</style>
