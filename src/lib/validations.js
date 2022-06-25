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
    async $saveWithLoading(promise) {
      const loading = this.$loading({});
      try {
        await promise();
        this.$message.info(this.$t('saved').toString());
      } catch (e) {
        this.$error('saveWithLoading', e);
        this.$message.error(this.$t('savingError').toString());
      }
      loading.close();
    },
  },

});
