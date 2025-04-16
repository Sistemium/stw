<template lang="pug">
.service-list-input(
)
  el-form.service-form(
    v-for="service in services"
    :key="service.articleId"
    :ref="el => addRef(el)"
    :disabled="disabled"
    :rules="rules"
    :model="service"
  )
    el-link(@click="removeService(service)")
      small {{ $t('delete') }}
    el-form-item(prop="articleId")
      article-select(
        v-model="service.articleId"
        :filters="articleFilter"
      )
    price-form(
      :model="service"
      :vat-prices="true"
    )
  .buttons
    el-link(
      @click="onAddMaterial()"
      :disabled="disabled"
    )
      small {{ $tAction('add', 'service') }}
</template>

<script setup lang="ts">
import { onBeforeUpdate, ref, type Ref } from 'vue'
import remove from 'lodash/remove'
import { $requiredRule } from '@/lib/validations'
import type { ServiceTaskService } from '@/models/ServiceTask'
import ArticleSelect from '@/components/catalogue/ArticleSelect.vue'
import PriceForm from '@/components/out/PriceForm.vue'
import { eachSeries } from 'async'

const services: Ref<Partial<ServiceTaskService>[]> = defineModel({ default: [] })
const articleFilter = { isService: true }
const rules = $requiredRule(['articleId', 'price'])
const itemRefs = ref([])

function addRef(el: any) {
  if (el) {
    itemRefs.value.push(el)
  }
}

onBeforeUpdate(() => {
  itemRefs.value = [];
});

defineProps<{
  disabled?: boolean
}>()

function onAddMaterial() {
  services.value.push({
    articleId: undefined,
    price: undefined,
  })
}

type Validator = (result: boolean) => any

defineExpose({
  validate(callback: Validator) {
    eachSeries(itemRefs.value, (item, cb) => {
      item.validate((itemValid: boolean) => {
        cb(itemValid ? null : Error('invalid item'));
      });
    }, err => {
      callback(!err);
    });
  },
})

function removeService(service: ServiceTaskService) {
  remove(services.value, ({ articleId }) => articleId === service.articleId)
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
