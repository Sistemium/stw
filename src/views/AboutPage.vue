<template lang="pug">

.about
  page-title(title="menu.about")
  h3 {{ $t('about') }}
  .version v{{ version }}

  p(v-if="isSupported && clientData")
    el-button(
      @click="requestNotifications"
    )
      el-icon(v-if="isGranted && clientData?.deviceToken" )
        Check
      span {{ tAction('turnOn', 'notifications') }}

</template>
<script setup lang="ts">

import { computed, ref } from 'vue'
import packageJson from '../../package.json'
import PageTitle from '@/components/PageTitle.vue'
import { getToken, messaging } from '@/init/firebase'
import { onMessage } from 'firebase/messaging'
import { useClientData } from '@/services/dataSync'
import { ElMessage } from 'element-plus'
import { t } from '@/lib/validations'
import { tAction } from '@/lib/validations'
import { useWebNotification } from '@vueuse/core'
import { Check } from '@element-plus/icons-vue'

const {
  isSupported,
  permissionGranted,
  show,
} = useWebNotification({
  requestPermissions: false,
})

const { updatePushToken, clientData } = useClientData()
const isGranted = ref(permissionGranted)
const version = computed(() => packageJson.version)

onMessage(messaging, message => {
  show(message.notification)
})

function requestNotifications() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      isGranted.value = true
      getNotificationToken()
    } else {
      isGranted.value = false
      ElMessage.warning(t('validation.notificationsForbidden').toString())
    }
  })
}

async function getNotificationToken() {

  const sw = await navigator.serviceWorker.getRegistration()
  const vapidKey = import.meta.env.VITE_VAPID_KEY as string
  const currentToken = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: sw,
  })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err)
    })

  if (currentToken) {
    console.log('FCM Token:', currentToken)
    return updatePushToken(currentToken)
  } else {
    console.log('No registration token available.')
  }
}

</script>
