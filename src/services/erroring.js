import i18n from '@/i18n';
import isString from 'lodash/isString';

const CONSTRAINED_RE = /: ([a-z]+)$/i;

// eslint-disable-next-line import/prefer-default-export
export function localizedDeleteError(e) {
  const { response } = e;
  const { data = '' } = response;
  if (isString(data)) {
    const [, constrained] = data.match(CONSTRAINED_RE) || [];
    if (constrained) {
      const localizedEntity = i18n.t(`models.${constrained}`).toString();
      return Error(i18n.t('validation.constrainedDelete', [localizedEntity]).toString());
    }
  }
  return e;
}
