<template lang="pug">

  .property-matcher

    h2(v-if="title") {{ title }}

    prop-tags(@click="addProp" :exclude="props")

    .match()
      .prop(v-for="prop in props" :key="prop.id")
        el-tag(
          closable @close="removeProp"
          size="small"
          type="info"
        ) {{ prop.name }}
        .value
          prop-value-input(:prop="prop")

</template>
<script>

import PropTags from '@/components/PropTags.vue';
import PropValueInput from '@/components/PropValueInput.vue';

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
    PropValueInput,
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

@import "../styles/variables";

.match {
  margin-top: $margin-top;
  text-align: center;
}

.prop {
  display: flex;
  align-items: center;
  justify-content: center;
  > .el-tag {
    margin-right: $margin-right;
  }
}

</style>
