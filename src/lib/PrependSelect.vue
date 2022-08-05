<template lang="pug">

button-prepend.prepend-select(@buttonClick="$emit('buttonClick')")
  el-select(:value="value" @input="v => $emit('input', v)")
    slot

</template>
<script>

import ButtonPrepend from '@/lib/ButtonPrepend.vue';

export default {
  name: 'PrependSelect',
  components: { ButtonPrepend },
  props: {
    value: String,
  },
};

</script>
<style scoped lang="scss">

</style>
