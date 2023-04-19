import log from 'sistemium-debug';

export default {

  computed: {
    $log() {
      return log(this.$options.name);
    },
  },

  methods: {
    $debug(...args) {
      return this.$log.debug(...args);
    },
    $error(...args) {
      return this.$log.error(...args);
    },
  },

};
