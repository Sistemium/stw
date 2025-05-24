<template lang="pug">

.auth-page.page.text-center.my-4(
  v-loading="isAuthorizing"
  :element-loading-text="$t('authorizing')"
)
  page-title(title="menu.auth")

  .my-3(v-if="!isAuthorized")
    oauth-button(
      :label="$t('actions.signIn')"
      image="img/icons8-cell_phone"
      button-type="danger"
      code="sms"
      :from="from"
      :disabled="!!isAuthorizing"
    )

  template(v-else)
    hello-world.my-3(
      :msg="$t('actions.welcome', [account.name])"
    )
    .my-3
      el-button(type="warning" @click="logout") {{ $t('actions.logout') }}

</template>
<script setup lang="ts">

import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import * as g from 'sistemium-vue/store/auth/getters.js';
import * as a from 'sistemium-vue/store/auth/actions.js';
import PageTitle from '@/components/PageTitle.vue';
import OauthButton from '@/lib/OauthButton.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import { logoffSocket } from '@/services/socket'

const store = useStore();
const route = useRoute();
const router = useRouter();

const from = computed(() => route.query.from as string);
const accessToken = computed(() => route.query['access-token'] as string);
const isAuthorized = computed(() => store.getters[`auth/${g.IS_AUTHORIZED}`]);
const isAuthorizing = computed(() => store.getters[`auth/${g.IS_AUTHORIZING}`]);
const account = computed(() => store.getters[`auth/${g.ACCOUNT}`]);

function login (token: string) {
  return store.dispatch(`auth/${a.AUTH_INIT}`, token);
}

function logout () {
  logoffSocket()
  return store.dispatch(`auth/${a.LOGOFF}`);
}

function onAuth() {
  if (from.value || accessToken.value) {
    const to = from.value || '/';
    router.push(to);
  }
}

watch(isAuthorized, yes => {
  // debug('isAuthorized', yes);
  if (yes) {
    onAuth();
  }
});

created();

async function created() {
  // debug('created', this.from, this.isAuthorizing, this.isAuthorized);
  if (isAuthorized.value) {
    onAuth();
  }
  if (!accessToken.value) {
    return;
  }
  await login(accessToken.value);
}

</script>
