import Vue from 'vue';

Vue.mixin({

  methods: {
    $requiredRule(field) {
      return {
        [field]: [{
          required: true,
          message: this.$t('validation.required', [this.$t(`fields.${field}`)]),
        }],
      };
    },
  },

});
