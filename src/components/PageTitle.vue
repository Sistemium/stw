<template lang="pug">

h1.page-title {{ $t(title) }}

</template>
<script>

export default {
  name: 'PageTitle',
  props: {
    title: String,
  },
};

</script>
<style scoped lang="scss">
@import "../styles/responsive";

h1 {
  margin-bottom: $margin-top;
  @include xxs() {
    display: none;
  }
}
</style>
