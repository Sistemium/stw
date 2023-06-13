import cloneDeep from 'lodash/cloneDeep';
import { ElLoading, ElMessage } from 'element-plus';
import i18n from '@/i18n';

export default {

  directives: {
    cancelReadOnly(el) {
      const input = el.querySelector('.el-input__inner');
      input.removeAttribute('readonly');
    },
  },

  methods: {
    $ts,
    $tAction: tAction,
    $tGen(action, name) {
      return this.$t(`actions.${action}`, [this.$t(`genitive.${name}`)]);
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

export function tAction(action: string, name: string): string {
  return t(`actions.${action}`, [t(`accusative.${name}`)]);
}

export function t(key: string, etc?: string[]): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!key) {
    return '';
  }
  return i18n.global.t(key, etc);
}

export async function saveWithLoading(asyncFunction) {
  const loading = ElLoading.service({});
  let result;
  try {
    result = await asyncFunction();
    ElMessage.info({
      message: t('saved').toString(),
      showClose: true,
    });
  } catch (e) {
    console.error('saveWithLoading', e);
    ElMessage.error({
      message: t('savingError').toString(),
      showClose: true,
    });
  }
  loading.close();
  return result;
}

export function $percent(value) {
  return `${i18n.global.n(value * 100.0)}%`;
}

export function $ts(dateString, key = 'timestamp') {
  return i18n.global.d(new Date(dateString), key);
}
