<template lang="pug">

.property-matcher

  h2(v-if="title") {{ title }}

  prop-tags(@click="addProp" :exclude="props" size="small")

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
import ArticleProp from '@/models/ArticleProp';

const PICK_VALUES = [
  'optionId',
  'boolValue',
  'stringValue',
  'numberValue',
];

export default {
  name: 'PropertyMatcher',
  props: {
    title: String,
    value: Array,
  },
  data() {
    return {
      props: [],
      values: {},
      // result: [],
    };
  },
  components: {
    PropInput,
    PropTags,
  },
  created() {
    this.setData(this.value);
  },
  methods: {
    getResult(values) {
      return this.props.map(prop => ({
        propId: prop.id,
        ...values[prop.id],
        type: prop.type,
        prop,
      }));
    },
    setData(results) {
      this.props = results.map(result => {
        PICK_VALUES.forEach(key => {
          const value = result[key];
          if (value === undefined) {
            return;
          }
          this.$set(this.values, key, value);
        });
        return ArticleProp.reactiveGet(result.propId);
      });
    },
    removeProp(prop) {
      delete this.values[prop.id];
      this.props.splice(this.props.indexOf(prop), 1);
      this.$emit('input', this.getResult(this.values));
    },
    addProp(prop) {
      this.props.push(prop);
      this.$set(this.values, prop.id, {});
    },
  },
  watch: {
    values: {
      deep: true,
      handler(values) {
        this.$emit('input', this.getResult(values));
      },
    },
  },
};

</script>
<style scoped lang="scss">

@import "../../styles/variables";

h2 {
  @include responsive-only(gt-xxs) {
    margin-bottom: 30px;
  }
}

.match {
  margin-top: $margin-top;
  text-align: center;
}

.prop + .prop {
  margin-top: $margin-right;
}

</style>
