import defaults from 'lodash/defaults';

const TYPES = {
  boolean: 'boolValue',
  string: 'stringValue',
  options: 'optionId',
  number: 'numberValue',
};

const DEFAULTS = {
  boolean: true,
  string: null,
  number: undefined,
  options: null,
};

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
      const defaultValue = DEFAULTS[type];
      const valName = TYPES[type];
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
