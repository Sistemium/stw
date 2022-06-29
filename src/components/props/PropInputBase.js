import defaults from 'lodash/defaults';
import { VALUE_TYPES, TYPES_DEFAULTS } from '@/models/ArticleProp';

export default {
  props: {
    prop: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    const result = {};
    this.$watchImmediate(() => ({
      type: this.prop.type,
      value: this.value,
    }), ({ type, value }) => {
      const defaultValue = TYPES_DEFAULTS[type];
      const valName = VALUE_TYPES[type];
      this.$set(result, valName, defaults({ ...value }, { [valName]: defaultValue })[valName]);
    });
    return { result };
  },
  watch: {
    result: {
      immediate: true,
      deep: true,
      handler(result) {
        this.$emit('input', result);
      },
    },
  },
};
