<template lang="pug">

h1.page-title(v-t="title")

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
@import "../styles/variables";

h1 {
  @include responsive-only(xxs) {
    display: none;
  }
  @include responsive-only(xs) {
    @media (orientation: landscape) {
      display: none;
    }
  }
}
</style>
