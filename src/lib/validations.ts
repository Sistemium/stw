import cloneDeep from 'lodash/cloneDeep';
import round from 'lodash/round';
import isNumber from 'lodash/isNumber';
import { ElLoading, ElMessage } from 'element-plus';
import i18n from '@/i18n';
import type { BaseItem } from '@/init/Model'

export default {

  directives: {
    cancelReadOnly(el: Element) {
      const input = el.querySelector('.el-input__inner');
      input?.removeAttribute('readonly');
    },
  },

  methods: {
    $ts,
    $tAction: tAction,
    $tGen: tGen,
    $nr(num: number, decimals = 2) {
      return i18n.global.n(round(num, decimals), 'decimal');
    },
  },
};

export function $requiredRule(fieldOrArray: string | string[]) {
  const res: BaseItem = {};
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

export function cloneInstance(res: BaseItem) {
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

export function tGen(action: string, name: string) {
  return t(`actions.${action}`, [t(`genitive.${name}`)]);
}

export function t(key: string, etc?: string[]): string {
  if (!key) {
    return '';
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return i18n.global.t(key, etc);
}

export async function saveWithLoading(asyncFunction: () => Promise<any>) {
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

export function $percent(value: number = 0) {
  return `${i18n.global.n(value * 100.0)}%`;
}

export function $ts(dateString: string, key = 'timestamp') {
  return i18n.global.d(new Date(dateString), key);
}

export function tn(num: number, format?: string): string {
  return isNumber(num) ? i18n.global.n(num, format || 'decimal') : '';
}

export const td = $ts
