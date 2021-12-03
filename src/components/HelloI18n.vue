<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'HelloI18n',
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
