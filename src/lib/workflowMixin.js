export default {
  props: {
    workflow: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    value: String,
    size: {
      type: String,
      default: 'mini',
    },
  },
  computed: {
    step() {
      return this.workflow.step(this.value);
    },
    options() {
      const { step } = this;
      return (step && step.options) || [];
    },
  },
  methods: {
    onCommand(to) {
      this.$emit('input', to);
    },
  },
};
