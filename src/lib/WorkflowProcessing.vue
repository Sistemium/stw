<template lang="pug">

.processing() {{ $t(`workflow.${ processing || 'progress' }`) }}

</template>
<script>

export default {
  name: 'WorkflowProcessing',
  props: {
    processing: String,
  },
};

</script>
<style scoped lang="scss">

</style>
