<template lang="pug">
.service-list-input(
)
  el-form.service-form(
    v-for="(service, idx) in services"
    :key="idx"
    :ref="el => addRef(el)"
    :disabled="disabled"
    :rules="rules"
    :model="service"
  )
    el-link(@click="removeService(idx)")
      small {{ $t('remove') }}
    el-form-item(prop="articleId")
      article-select(
        v-model="service.articleId"
        :filters="articleFilter"
        @update:model-value="v => onArticle(v, idx)"
      )
    price-form(
      :model="service"
      :vat-prices="true"
    )
  .buttons
    el-link(
      v-if="!services.length"
      @click="onAddMaterial()"
      :disabled="disabled"
    )
      small {{ $tAction('add', 'service') }}
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref, type Ref } from 'vue'
import { $requiredRule } from '@/lib/validations'
import type { ServiceTaskService } from '@/models/ServiceTask'
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue'
import PriceForm from '@/components/out/PriceForm.vue'
import { eachSeries } from 'async'
import { safeT } from '@/i18n'
import { getPricing } from '@/services/pricing'
import { dateFormat } from '@/services/timing'

const services: Ref<Partial<ServiceTaskService>[]> = defineModel({ default: [] })
const articleFilter = { isService: true }
const itemRefs = ref([])
const rules = $requiredRule(['articleId', 'price'])
const { VITE_MASTER_PRICING } = import.meta.env

rules.articleId.push({
  validator(rule: any, value: any, callback: any) {
    const count = services.value.filter(({ articleId }) => articleId === value)
    if (!value || count.length <= 1) {
      return callback()
    }
    callback(new Error(safeT('uniq', 'validation', safeT('fields.service'))))
  },
})

function addRef(el: any) {
  if (el) {
    itemRefs.value.push(el)
  }
}

onBeforeUpdate(() => {
  itemRefs.value = []
})

const props = defineProps<{
  disabled?: boolean
  date?: string
  siteId?: string
  employeeId?: string
}>()

function onAddMaterial() {
  services.value.push({
    articleId: undefined,
    price: undefined,
  })
}

function onArticle(articleId: string, idx: number) {
  if (!articleId) {
    return
  }
  services.value[idx].price = getPricing(VITE_MASTER_PRICING, articleId, dateFormat(props.date), props.siteId, props.employeeId) || 0
}

type Validator = (result: boolean) => any

defineExpose({
  validate(callback: Validator) {
    let hasError = false
    eachSeries(itemRefs.value, (item, cb) => {
      item.validate((itemValid: boolean) => {
        if (!itemValid) {
          hasError = true
        }
        cb(null)
      })
    }, err => {
      callback(!err && !hasError)
    })
  },
})

function removeService(idx: number) {
  services.value.splice(idx, 1)
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.article-select {
  width: 100%;
}

.el-form-item {
  text-align: right;
}
</style>
