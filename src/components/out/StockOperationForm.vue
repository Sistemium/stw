<template lang="pug">
// eslint-disable vue/no-mutating-props
el-form.stock-operation-form(
  :model="model"
  ref="form"
  :rules="rules"
  :disabled="disabled"
)

  el-form-item(
    :label="$t('fields.date')"
    prop="date"
  )
    date-string-picker(v-model="model.date")

  el-form-item(
    :label="$t('fields.ndoc')"
    prop="ndoc"
  )
    el-input(
      v-model="model.ndoc"
    )

  el-form-item(
    :label="$t('fields.storage')"
    prop="storageId"
  )
    el-select(v-model="model.storageId")
      el-option(
        v-for="{ id, name } in storages"
        :key="id"
        :label="name"
        :value="id"
      )

  el-form-item(
    :label="$t('fields.pricing')"
    prop="pricingId"
  )
    pricing-select(v-model="model.pricingId")

  el-form-item(
    :label="$t('fields.markup')"
    prop="markup"
    v-if="operationName === 'stockWithdrawing'"
  )
    el-input-number(
      v-model="model.markup"
    )

  el-form-item(
    :label="$t(counterpartyLabel.type)"
    prop="counterpartyType"
  )
    counterparty-type-switch(
      v-model="model.counterpartyType"
      @change="model.counterpartyId = null"
    )

  el-form-item(
    v-if="model.counterpartyType"
    :label="$t(counterpartyLabel.choice)"
    prop="counterparty"
  )
    button-prepend(@button-click="addCounterparty")
      counterparty-select(
        v-model="model.counterpartyId"
        :type="model.counterpartyType"
      )

  el-form-item(
    :label="$t('fields.processing')"
    prop="processing"
  )
    workflow-button(
      :workflow="workflow"
      v-model="model.processing"
    )

  el-form-item(
    :label="$t('fields.commentText')"
    prop="commentText"
    v-if="!disabled || model.commentText"
  )
    el-input(
      v-model="model.commentText"
      type="textarea"
      :autosize="{ minRows: 2 }"
    )

  component(
    v-if="showDrawer && counterpartyEditComponent"
    :is="counterpartyEditComponent"
    :drawer-style="{ top: '50px' }"
    @saved="counterpartySaved"
    @closed="counterpartyEditClosed"
  )

</template>
<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref } from 'vue'
import WorkflowButton from '@/lib/WorkflowButton.vue'
import Storage from '@/models/Storage'
import { workflow } from '@/models/StockWithdrawing'
import DateStringPicker from '@/lib/DateStringPicker.vue'
import ButtonPrepend from '@/lib/ButtonPrepend.vue'
import CounterpartyTypeSwitch from '@/components/CounterpartyTypeSwitch.vue'
import CounterpartySelect from '@/components/CounterpartySelect.vue'
import LegalEntityEdit from '@/components/contacts/LegalEntityEdit.vue'
import StorageEdit from '@/components/stock/StorageEdit.vue'
import { $requiredRule } from '@/lib/validations'
import type { StockOperation } from '@/models/StockOperations'
import { useFormValidate } from '@/services/validating'
import PricingSelect from '@/components/select/PricingSelect.vue'

const props = defineProps<{
  model: StockOperation
  disabled: boolean
  counterpartyRole: string
  operationName?: string
}>()

const { form, validate } = useFormValidate()

defineExpose({ validate })

const showDrawer = ref(false)

const counterpartyLabel = computed(() => {
  const { counterpartyRole } = props
  return {
    type: `fields.${counterpartyRole}Type`,
    choice: `fields.${counterpartyRole}`,
  }
})

const rules = $requiredRule(['date', 'storageId'])

const storages = computed(() => Storage.reactiveFilter())

const cpMap = new Map([
  ['Storage', StorageEdit],
  ['LegalEntity', LegalEntityEdit],
])

const counterpartyEditComponent = computed(() => {
  const { counterpartyType } = props.model
  return counterpartyType && cpMap.get(counterpartyType)
})

function addCounterparty() {
  showDrawer.value = true
}

function counterpartySaved(counterparty?: { id: string }) {
  if (counterparty) {
    setTimeout(() => {
      props.model.counterpartyId = counterparty.id
    }, 0)
  }
}

function counterpartyEditClosed() {
  showDrawer.value = false
}

</script>
