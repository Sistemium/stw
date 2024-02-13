import isString from 'lodash/isString';
import { t } from '@/lib/validations'

const CONSTRAINED_RE = /: ([a-z]+)$/i;

export function localizedDeleteError(e: any) {
  const { response } = e;
  const { data = '' } = response;
  if (isString(data)) {
    const [, constrained] = data.match(CONSTRAINED_RE) || [];
    if (constrained) {
      const localizedEntity = t(`models.${constrained}`).toString();
      return Error(t('validation.constrainedDelete', [localizedEntity]).toString());
    }
  }
  return e;
}
