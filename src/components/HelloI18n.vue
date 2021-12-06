<template lang="pug">

  resize.hello-i18n(:padding="10")
    p(v-t="'hello'")
    form-buttons(:deletable="false" @cancelClick="cancelClick")

</template>
<script>

import FormButtons from '@bit/sistemium.vue.form-buttons/FormButtons.vue';

export default {
  name: 'HelloI18n',
  components: { FormButtons },
  methods: {
    cancelClick() {
      this.$error('cancelClick');
      this.$message(this.$t('about'));
    },
  },
  i18n: {
    messages: {
      en: {
        hello: 'Hello i18n in SFC!',
      },
      ru: {
        hello: 'Привет, локализация в однофайловой компоненте!',
      },
      lt: {
        hello: 'Sveiki i18n viduje SFC!',
      },
    },
  },
};

</script>
