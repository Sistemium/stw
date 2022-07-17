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
@include responsive-only(xxs) {
  h1 {
    display: none;
  }
}
</style>
