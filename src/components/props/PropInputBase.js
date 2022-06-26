import defaults from 'lodash/defaults';

const TYPES = {
  boolean: 'boolValue',
  string: 'stringValue',
  options: 'optionId',
  number: 'numberValue',
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
    defaults: {
      type: Object,
      default: () => ({
        boolean: true,
        string: null,
        number: undefined,
        options: null,
      }),
    },
  },
  data() {
    const result = {};
    this.$watchImmediate(() => ({
      type: this.prop.type,
      value: this.value,
    }), ({ type, value }) => {
      const defaultValue = this.defaults[type];
      const valName = TYPES[type];
      result[valName] = defaults({ ...value }, { [valName]: defaultValue })[valName];
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
