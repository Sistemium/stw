<template lang="pug">
span(v-if="localized") {{ localized[getLocale()] }}
</template>

<script setup lang="ts">
import type { LocalizedString } from '@/services/prompting'
import { getLocale } from '@/services/i18n'

defineProps<{
  localized?: LocalizedString
}>()

</script>
