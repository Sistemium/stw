<template lang="pug">

v-btn.lang-menu(
  variant="text"
  append-icon='$mdiMenuDown'
  size="small"
)
  span {{ lang.key }}
  v-menu(activator='parent')
    v-list
      v-list-item(
        v-for="lng in languages"
        :key="lng.key"
        @click="setLang(lng)"
      ) {{ lng.name }}

</template>
<script setup lang="ts">

import find from 'lodash/find'
import { computed } from 'vue'

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
