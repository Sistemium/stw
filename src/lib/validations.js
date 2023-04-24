// import Vue from 'vue';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import trim from 'lodash/trim';
import i18n from '@/i18n';
import cloneDeep from 'lodash/cloneDeep';

export default {

  directives: {
    cancelReadOnly(el) {
      const input = el.querySelector('.el-input__inner');
      input.removeAttribute('readonly');
    },
  },

  methods: {
    $percent(value) {
      return `${i18n.global.n(value * 100.0)}%`;
    },
    $cloneInstance: cloneInstance,
    $trim: trim,
    $map: map,
    $find: find,
    $orderBy: orderBy,
    $ts(dateString, key = 'timestamp') {
      return i18n.global.d(new Date(dateString), key);
    },
    $requiredRule,
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
    $watchImmediate(expOrFn, callback, options = {}) {
      return this.$watch(expOrFn, callback, { immediate: true, ...options });
    },
  },
};

export function $requiredRule(fieldOrArray) {
  const res = {};
  const fields = Array.isArray(fieldOrArray) ? fieldOrArray : [fieldOrArray];
  fields.forEach(field => {
    const [, concept] = field.match(/(.+)Id$/) || [];
    const label = `${concept ? 'concepts' : 'fields'}.${concept || field}`;
    res[field] = [{
      required: true,
      message: i18n.global.t('validation.required', [i18n.global.t(label)]),
    }];
  });
  return res;
}

export function cloneInstance(res) {
  return res && {
    ...cloneDeep(res),
    cts: undefined,
    ts: undefined,
    deviceCts: undefined,
    _id: undefined,
    id: undefined,
  };
}
