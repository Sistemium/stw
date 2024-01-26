<template lang="pug">
  .article-pricing-page.page
    page-title(title="menu.articlePricing")

    .filters
      .searchers
        pricing-select(v-model="pricingId")
        date-string-picker(
          v-model="date"
          format="YYYY-MM-DD"
        )
        site-select(v-model="siteId")
        employee-select(v-model="masterId")
      .tools
        search-input(v-model="search")
        tool-button(
          :disabled="!pricingId"
          :tool="editing ? 'check' : 'edit'"
          @click="onEdit()"
        )

    alert-empty(v-if="emptyText" :title="emptyText")

    resize(
      v-else
      :padding="20"
      v-loading="loading"
    )
      template(#default="{ resized } ")
        el-auto-resizer
          template(#default="{ width }")
            article-pricing-table(
              :article-pricing="articlePricingFiltered"
              :width="width"
              :date="date"
              :editing="editing"
              :column-width="150"
              :height="resized"
              @resize="onColumnsResize"
              @price-change="onPriceChange"
            )

</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import map from 'lodash/map'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import orderBy from 'lodash/orderBy'
import { computed, ref, watch } from 'vue'
import Resize from '@/lib/StmResize.vue'
import PageTitle from '@/components/PageTitle.vue'
import PricingSelect from '@/components/select/PricingSelect.vue'
import ArticlePricingTable from '@/components/catalogue/ArticlePricingTable.vue'
import ArticlePricing, { type IArticlePricing } from '@/models/ArticlePricing'
import Article from '@/models/Article'
import { fetchArticlePricing } from '@/services/dataSync'
import ToolButton from '@/lib/ToolButton.vue'
import { useRouteParams } from '@/lib/updateRouteParams'
import SearchInput from '@/lib/SearchInput.vue'
import { likeLt } from '@/services/lt'
import DateStringPicker from '@/lib/DateStringPicker.vue'
import EmployeeSelect from '@/components/select/EmployeeSelect.vue'
import SiteSelect from '@/components/select/SiteSelect.vue'
import { tAction } from '@/lib/validations'
import AlertEmpty from '@/lib/AlertEmpty.vue'

interface ColumnInfo {
  width: number
  key: string
}

const { route, updateRouteParams } = useRouteParams()
const pricingId = ref(route.query.pricingId as string)
const tableColumns = ref<ColumnInfo[]>([])
const editing = ref<boolan>(false)
const search = ref<string>('')
const date = ref(dayjs().format('YYYY-MM-DD'))
const loading = ref<boolean>(false)
const masterId = ref<string>()
const siteId = ref<string>()

const articlePricingFiltered = computed(() => {
  const data = articlePricing.value.map(ap => ({
    ...ap,
    articleName: Article.reactiveGet(ap.articleId)?.name,
  }))
  const sorted = orderBy(data.filter(d => d.articleName), item => item.articleName)
  const { value } = search
  if (!value) {
    return sorted
  }
  const re = likeLt(value)
  return sorted.filter(ap => {
    return re.test(ap.articleName)
  })
})

const emptyText = computed(() => {
  if (!date.value) {
    return tAction('select', 'date')
  }
  if (!pricingId.value) {
    return tAction('select', 'pricing')
  }
  return undefined
})

const articlePricing = computed(() => {
  if (!date.value) {
    return []
  }
  const raw = ArticlePricing.reactiveManyByIndex('pricingId', pricingId.value)
    .filter(ap => {
      return ap.date <= date.value
        && (!ap.masterId || masterId.value === ap.masterId)
        && (!ap.siteId || siteId.value === ap.siteId)
    })
  const data = map(groupBy(raw, 'articleId'), mapLastPrice) as IArticlePricing[]
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
      // date: date.value,
      price: undefined,
    }, existing)
  })
})

watch([pricingId, date], async ([id, date]) => {
  await updateRouteParams({}, {
    pricingId: id || undefined,
    date: date || undefined,
  })
  if (id) {
    loading.value = true
    await fetchArticlePricing(id)
      .finally(() => {
        loading.value = false
      })
  }
})

function mapLastPrice(items: IArticlePricing[]) {
  let hasMaster = false
  const filtered = items.filter(i => {
    if (i.masterId) {
      hasMaster = true
    }
    return i.masterId || !hasMaster
  })
    .filter(i => i.masterId || !hasMaster)
  return orderBy(filtered, 'date').at(-1)
}

async function onPriceChange(articleId: string, price: number) {
  const existing = articlePricing.value.find(ap => {
    return ap.articleId === articleId
      && ap.date === date.value
      && (ap.masterId === masterId.value || !masterId.value)
      && (ap.siteId === siteId.value || !siteId.value)
  })
  loading.value = true
  try {
    if (existing?.id) {
      if (!price) {
        await ArticlePricing.destroy(existing.id)
      } else {
        await ArticlePricing.updateOne({ id: existing.id, price })
      }
    } else {
      if (!price) {
        throw Error('Empty price onPriceChange')
      }
      await ArticlePricing.createOne({
        date: date.value,
        pricingId: pricingId.value,
        masterId: masterId.value || null,
        siteId: siteId.value || null,
        articleId,
        price,
      })
    }
  } finally {
    loading.value = false
  }
}

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
  margin-bottom: $margin-right;
}

.article-pricing-row-edit {
  text-align: right;
}

.searchers, .tools {
  :deep(> * + *) {
    margin-left: $margin-right;
  }
}

.alert-empty {
  margin-top: $margin;
}
</style>
