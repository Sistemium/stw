import Vue from 'vue';

Vue.mixin({

  methods: {
    $requiredRule(fieldOrArray) {
      const res = {};
      const fields = Array.isArray(fieldOrArray) ? fieldOrArray : [fieldOrArray];
      fields.forEach(field => {
        const [, concept] = field.match(/(.+)Id$/) || [];
        const label = `${concept ? 'concepts' : 'fields'}.${concept || field}`;
        res[field] = [{
          required: true,
          message: this.$t('validation.required', [this.$t(label)]),
        }];
      });
      return res;
    },
    $tAction(action, name) {
      return this.$t(`actions.${action}`, [this.$t(`accusative.${name}`)]);
    },
    $tGen(action, name) {
      return this.$t(`actions.${action}`, [this.$t(`genitive.${name}`)]);
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
