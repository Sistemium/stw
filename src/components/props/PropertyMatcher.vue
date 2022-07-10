<template lang="pug">

.property-matcher

  h2(v-if="title") {{ title }}

  prop-tags(@click="addProp" :tags="tags" size="small")

  .match()
    transition-group(name="flip-list")
      .prop(v-for="(prop, index) in props" :key="prop.id")
        .ordering
          el-button(
            type="text"
            @click.prevent.stop="reorder(prop, -1)"
            :disabled = "index === 0"
          )
            i.el-icon-arrow-up

          el-button(
            type="text"
            @click.prevent.stop="reorder(prop, 1)"
            :disabled = "index === props.length - 1"
          )
            i.el-icon-arrow-down
        prop-input(
          :prop="prop"
          @close="removeProp"
          v-model="values[prop.id]"
        )

</template>
<script>

import find from 'lodash/find';
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
    this.$watch('value', (value, oldValue) => {
      if (oldValue && value) {
        return;
      }
      this.setData(value);
    });
  },
  computed: {
    tags() {
      return ArticleProp.reactiveFilter(({ id }) => !find(this.props, ({ id })));
    },
  },
  methods: {
    reorder(prop1, change) {
      this.$debug(prop1, change);
      const { props } = this;
      const ord1 = props.indexOf(prop1);
      const ord2 = ord1 + change;
      props.splice(ord1, 1);
      props.splice(ord2, 0, prop1);
      this.$emit('input', this.getResult(this.values));
    },
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

.prop {
  display: flex;
  align-items: center;

  .prop-input {
    flex: 1;
  }
}

.prop + .prop {
  margin-top: $margin-right;
}

.flip-list-move {
  transition: transform 0.3s;
}

</style>
