<template lang="pug">

el-sub-menu.lang-menu(
  index="lang"
)
  template(#title) {{ lang.key }}
  el-menu-item(
    v-for="lng in languages"
    :key="lng.key"
    @click="setLang(lng)"
  ) {{ lng.name }}

</template>
<script setup lang="ts">

import find from 'lodash/find'
import { computed } from 'vue'
// import FlaggedLang from './FlaggedLang.vue'

const props = defineProps<{
  languages: any[],
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
const lang = computed(() => {
  const { languages } = props
  const found = find(languages, { key: props.modelValue })
  return found || languages[0]
})

function setLang(lng) {
  emit('update:modelValue', lng.key)
}

</script>
<style scoped>

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

</style>
