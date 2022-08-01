import Vue from 'vue';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';

Vue.mixin({

  directives: {
    cancelReadOnly(el) {
      const input = el.querySelector('.el-input__inner');
      input.removeAttribute('readonly');
    },
  },

  methods: {
    $map: map,
    $find: find,
    $orderBy: orderBy,
    $ts(dateString, key = 'timestamp') {
      return this.$d(new Date(dateString), key);
    },
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
    $get: get,
    async $saveWithLoading(asyncFunction) {
      const loading = this.$loading({});
      let result;
      try {
        result = await asyncFunction();
        this.$message.info({
          message: this.$t('saved').toString(),
          showClose: true,
        });
      } catch (e) {
        this.$error('saveWithLoading', e);
        this.$message.error({
          message: this.$t('savingError').toString(),
          showClose: true,
        });
      }
      loading.close();
      return result;
    },
    $watchImmediate(expOrFn, callback) {
      return this.$watch(expOrFn, callback, { immediate: true });
    },
  },
});
