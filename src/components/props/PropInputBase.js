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
  },
  data() {
    return {
      value: null,
    };
  },
};
