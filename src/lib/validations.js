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
    $tAction(action, name) {
      return this.$t(`actions.${action}`, [this.$t(`accusative.${name}`)]);
    },
    async $saveWithLoading(asyncFunction) {
      const loading = this.$loading({});
      try {
        await asyncFunction();
        this.$message.info(this.$t('saved').toString());
      } catch (e) {
        this.$error('saveWithLoading', e);
        this.$message.error(this.$t('savingError').toString());
      }
      loading.close();
    },
    $watchImmediate(expOrFn, callback) {
      return this.$watch(expOrFn, callback, { immediate: true });
    },
  },
});
