<template lang="pug">

  .property-matcher

    h2(v-if="title") {{ title }}

    prop-tags(@click="addProp" :exclude="props")

    .match()
      .prop(v-for="prop in props" :key="prop.id")
        prop-input(:prop="prop" @close="removeProp")

</template>
<script>

import PropTags from '@/components/props/PropTags.vue';
import PropInput from '@/components/props/PropInput.vue';

export default {
  name: 'PropertyMatcher',
  props: {
    title: String,
  },
  data() {
    return {
      props: [],
    };
  },
  components: {
    PropInput,
    PropTags,
  },
  computed: {},
  methods: {
    removeProp(prop) {
      this.props.splice(this.props.indexOf(prop), 1);
    },
    addProp(prop) {
      this.props.push(prop);
    },
  },
};

</script>
<style scoped lang="scss">

@import "../../styles/variables";

.match {
  margin-top: $margin-top;
  text-align: center;
}

.prop + .prop {
  margin-top: $padding;
}

</style>
