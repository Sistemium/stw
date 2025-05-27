<template lang="pug">

assistant-page(v-if="store.account")
.home.text-center(v-else)
  img(alt="Vue logo" src="../assets/logo.png")
  hello-world(:msg="$t('message')")

</template>
<script setup lang="ts">

import { useInvStore } from '@/store/invStore'
import HelloWorld from '@/components/HelloWorld.vue';
import AssistantPage from '@/views/AssistantPage.vue'

const store = useInvStore()

// this.$debug('home');
</script>
