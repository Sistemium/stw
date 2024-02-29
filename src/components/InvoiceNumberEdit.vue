<template lang="pug">

.invoice-number-edit
  el-input.series(v-model="series" :placeholder="$t('fields.series')")
  el-input.number(v-model="number" :placeholder="$t('fields.number')")

</template>

<script setup lang="ts">
import { computed } from 'vue'
import trim from 'lodash/trim'

const model = defineModel<string>()
const series = computed<string>({
  get() {
    const { value = '' } = model
    if (!/-/.test(value)) {
      return ''
    }
    const [res] = value.match(/^[^-]+/) || []
    return res || ''
  },
  set(val) {
    setModel(val, number.value)
  },
})
const number = computed<string>({
  get() {
    const { value = '' } = model
    if (!/-/.test(value)) {
      return value
    }
    const [res] = value.match(/[^-]+$/) || []
    return res || ''
  },
  set(val) {
    setModel(series.value, val)
  },
})

function setModel(ser: string, num: string) {
  model.value = ser ? `${trim(ser).toLocaleUpperCase()}-${trim(num)}` : trim(num)
}

</script>

<style scoped lang="scss">
@import "@/styles/variables.scss";

.invoice-number-edit {
  display: flex;

  > * + * {
    margin-left: $padding;
  }
  .series {
    width: 120px;
  }
  .number {
    width: 120px;
  }
}
</style>
