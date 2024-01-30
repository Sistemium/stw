<template lang="pug">
.pricing-page.page
  template(v-if="isRoot")
    page-title(title="menu.pricing")
    .buttons(v-if="pricing.length")
      tool-button(
        tool="add"
        @click="onAdd()"
      )
    stm-resize(:padding="20")
      alert-empty(
        v-if="!pricing.length"
        @click="onAdd()"
        :button-text="$tAction('add', 'pricing')"
      )
      pricing-list(
        v-else
        :pricing="pricing"
        @editClick="onEdit"
        @click="onClick"
      )
  router-view

</template>

<script setup lang="ts">
import { computed } from 'vue'
import PageTitle from '@/components/PageTitle.vue'
import { orderByName } from '@/services/util'
import Pricing from '@/models/Pricing'
import StmResize from '@/lib/StmResize.vue'
import PricingList from '@/components/pricing/PricingList.vue'
import ToolButton from '@/lib/ToolButton.vue'
import AlertEmpty from '@/lib/AlertEmpty.vue'
import { useRouteParams } from '@/lib/updateRouteParams'

const pricing = computed(() => orderByName(Pricing.reactiveFilter()))
const { router, route } = useRouteParams()
const ARTICLES_ROUTE = 'articlePricing'
const isRoot = computed(() => route.name !== ARTICLES_ROUTE)

const props = defineProps<{
  editRoute: string
  createRoute: string
}>()

function onAdd() {
  router.push({ name: props.createRoute })
}

function onEdit(pricing: { id: string }) {
  router.push({ name: props.editRoute, params: { pricingId: pricing.id } })
}

function onClick(pricing: { id: string }) {
  router.push({ name: ARTICLES_ROUTE, params: { pricingId: pricing.id } })
}

</script>

<style scoped lang="scss">
@import "@/styles/page";
.page {
  max-width: 1024px;
}
</style>
