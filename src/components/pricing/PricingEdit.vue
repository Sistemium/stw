<template lang="pug">
drawer-edit.storage-edit(
  :title="$tGen('editing', 'pricing')"
  :save-fn="saveFn"
  :destroy-fn="destroyFn"
  :model-origin="modelOrigin"
  :from="from"
  :deletable="true"
)
  template(#default="{ model }")
    pricing-form(:model="model")

</template>

<script setup lang="ts">
import { computed } from 'vue'
import DrawerEdit from '@/lib/DrawerEdit.vue'
import { useDrawerEditing } from '@/services/drawerEditing'
import Pricing, { type IPricing } from '@/models/Pricing'
import type { BaseItem } from '@/init/Model'
import PricingForm from '@/components/pricing/PricingForm.vue'

const props = defineProps<{
  pricingId?: string
  from: BaseItem
}>()

const { saveFn, destroyFn } = useDrawerEditing(Pricing)

const modelOrigin = computed<Partial<IPricing>>(() => props.pricingId ? Pricing.reactiveGet(props.pricingId) : {
  name: '',
  vatPrices: true,
})


</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";
</style>
