<template lang="pug">

.auth-page.page(
  v-loading="isAuthorizing"
  :element-loading-text="$t('authorizing')"
)
  page-title(title="menu.auth")

  p(v-if="!isAuthorized")
    oauth-button(
      :label="$t('actions.signIn')"
      image="img/icons8-cell_phone"
      button-type="danger"
      code="sms"
      :from="from"
      :disabled="!!isAuthorizing"
    )

  template(v-else)
    hello-world(
      :msg="$t('actions.welcome', [account.name])"
    )
    p
      el-button(type="warning" @click="logout") {{ $t('actions.logout') }}

</template>
<script>

import { createNamespacedHelpers } from 'vuex';
import * as g from 'sistemium-vue/store/auth/getters';
import * as a from 'sistemium-vue/store/auth/actions';
import PageTitle from '@/components/PageTitle.vue';
import OauthButton from '@/lib/OauthButton.vue';
import HelloWorld from '@/components/HelloWorld.vue';

const {
  mapActions,
  mapGetters,
} = createNamespacedHelpers('auth');

export default {
  name: 'AuthPage',
  components: { OauthButton, PageTitle, HelloWorld },
  computed: {
    from() {
      return this.$route.query.from;
    },
    accessToken() {
      return this.$route.query['access-token'];
    },
    ...mapGetters({
      isAuthorized: g.IS_AUTHORIZED,
      isAuthorizing: g.IS_AUTHORIZING,
      account: g.ACCOUNT,
    }),
  },
  methods: {
    ...mapActions({
      login: a.AUTH_INIT,
      logout: a.LOGOFF,
    }),
    onAuth() {
      const { from, accessToken } = this;
      if (from || accessToken) {
        const to = this.from || '/';
        this.$router.push(to);
      }
    },
  },
  watch: {
    isAuthorized(yes) {
      this.$debug('isAuthorized', yes);
      if (yes) {
        this.onAuth();
      }
    },
  },
  async created() {
    this.$debug('created', this.from, this.isAuthorizing, this.isAuthorized);
    if (this.isAuthorized) {
      this.onAuth();
    }
    if (!this.accessToken) {
      return;
    }
    await this.login(this.accessToken);
  },
};

</script>
<style scoped lang="scss">

</style>
