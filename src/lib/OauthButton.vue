<template lang="pug">

.oauth-button
  el-button(:type="buttonType" @click="onClick" :disabled="disabled")
    .button-content
      img(:src="src")
      span {{ label }}

</template>
<script>

import toLower from 'lodash/toLower';

const { VITE_OAUTH_URL, VITE_OAUTH_REDIRECT_URI, VITE_OAUTH_ORG_APP } = import.meta.env;

export default {
  name: 'OauthButton',
  props: {
    disabled: Boolean,
    from: String,
    label: String,
    image: String,
    buttonType: {
      type: String,
      default: 'primary',
    },
    code: String,
  },
  computed: {
    src() {
      return `${this.image}.png`;
    },
    href() {
      const url = this.code || toLower(this.label);
      const redirect = [
        `redirect_uri=${encodeURIComponent(VUE_APP_OAUTH_REDIRECT_URI)}`,
        this.from && `?from=${this.from}`,
      ]
        .filter(x => x)
        .join('');
      return `${VUE_APP_OAUTH_URL}/auth/${url}/vfs`
        + `?${redirect}&orgAppId=${VUE_APP_OAUTH_ORG_APP}`;
    },
  },
  methods: {
    onClick() {
      window.location.href = this.href;
    },
  },
};

</script>
<style scoped lang="scss">
@import "../styles/variables";

.button-content {
  display: flex;
  align-items: center;
}

img {
  width: 30px;
  margin-right: $margin-right;
}

.mint-button {
  display: block;
  width: 100%;
}

</style>
