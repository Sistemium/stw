<template lang="pug">

.property-matcher

  h2(v-if="title") {{ title }}

  prop-tags(@click="addProp" :exclude="props")

  .match()
    .prop(v-for="prop in props" :key="prop.id")
      prop-input(
        :prop="prop"
        @close="removeProp"
        v-model="values[prop.id]"
      )

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
      values: {},
    };
  },
  components: {
    PropInput,
    PropTags,
  },
  computed: {},
  methods: {
    removeProp(prop) {
      delete this.values[prop.id];
      this.props.splice(this.props.indexOf(prop), 1);
    },
    addProp(prop) {
      this.props.push(prop);
      // this.values[prop.id] = {};
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
  margin-top: $margin-right;
}

</style>
