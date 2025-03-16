<template lang="pug">

.about
  page-title(title="menu.about")
  h3 {{ $t('about') }}
  h3(v-if="store.account") {{ $t('actions.welcome', [store.account.name]) }}
  .version v{{ version }}

  p(v-if="isSupported && clientData")
    el-button(
      @click="toggleNotifications"
      :type="isEnabled ? 'success' : 'primary'"
      :disabled="isBusy"
    )
      el-icon(v-if="isGranted" )
        Check(v-if="isEnabled")
        MuteNotification(v-else)
      span {{ tAction(isEnabled ? 'turnOff' : 'turnOn', 'notifications') }}

</template>
<script setup lang="ts">

import { computed, ref } from 'vue'
import packageJson from '../../package.json'
import PageTitle from '@/components/PageTitle.vue'
import { getToken, messaging } from '@/init/firebase'
import { useClientData } from '@/services/dataSync'
import { ElMessage } from 'element-plus'
import { t } from '@/lib/validations'
import { tAction } from '@/lib/validations'
import { useWebNotification } from '@vueuse/core'
import { Check, MuteNotification } from '@element-plus/icons-vue'
import { useInvStore } from '@/store/invStore'

const store = useInvStore()
const {
  isSupported,
  permissionGranted,
} = useWebNotification({
  requestPermissions: false,
})

const { updatePushToken, clientData } = useClientData()
const isGranted = ref(permissionGranted)
const version = computed(() => packageJson.version)
const isEnabled = computed(() => isGranted.value && !!clientData.value?.deviceToken)
const isBusy = ref()

function toggleNotifications() {
  if (isEnabled.value) {
    isBusy.value = true
    updatePushToken(null)
      .finally(() => {
        isBusy.value = false
      })
  } else {
    requestNotifications()
  }
}

function requestNotifications() {
  isBusy.value = true
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      isGranted.value = true
      return getNotificationToken()
    } else {
      isGranted.value = false
      ElMessage.warning(t('validation.notificationsForbidden').toString())
    }
  })
    .finally(() => {
      isBusy.value = false
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
      console.error('An error occurred while retrieving token. ', err)
    })

  if (currentToken) {
    console.log('FCM Token:', currentToken)
    return updatePushToken(currentToken)
  } else {
    console.error('No registration token available.')
  }
}

</script>
