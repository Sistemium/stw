<template lang="pug">

.oauth-button
  el-button(
    size="large"
    :type="buttonType"
    @click="onClick"
    :disabled="disabled"
  )
    .button-content
      img(:src="src")
      span {{ label }}

</template>
<script setup lang="ts">

import toLower from 'lodash/toLower';
import { computed } from 'vue';

const { VITE_OAUTH_URL, VITE_OAUTH_REDIRECT_URI, VITE_OAUTH_ORG_APP } = import.meta.env;

const props = withDefaults(defineProps<{
  disabled: boolean;
  from?: string;
  label: string;
  image: string;
  buttonType: string;
  code: string;
}>(), { buttonType: 'primary' });

const src = computed(() => `${props.image}.png`);
const href = computed(() => {
  const url = props.code || toLower(props.label);
  const redirect = [
    `redirect_uri=${encodeURIComponent(VITE_OAUTH_REDIRECT_URI)}`,
    props.from && `?from=${props.from}`,
  ]
    .filter(x => x)
    .join('');
  return `${VITE_OAUTH_URL}/auth/${url}/vfs?${redirect}&orgAppId=${VITE_OAUTH_ORG_APP}`;
});

function onClick() {
  window.location.href = href.value;
}

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
