import Vue from 'vue';

import log from 'sistemium-debug';

Vue.mixin({

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

});
