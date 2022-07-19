import lowerFirst from 'lodash/lowerFirst';
import upperFirst from 'lodash/upperFirst';
import trim from 'lodash/trim';
import map from 'lodash/map';
import ArticleProp from '@/models/ArticleProp';

// eslint-disable-next-line import/prefer-default-export
export function compoundName(filters) {
  const res = map(filters, filter => {
    const { stringValue, numberValue } = filter;
    const simple = stringValue || numberValue;
    const prop = filter.prop || ArticleProp.getByID(filter.propId) || {};
    const { isNaming } = prop;
    if (!isNaming) {
      return null;
    }
    if (simple) {
      const { prefix, suffix } = prop;
      return [prefix, simple, suffix]
        .filter(a => a)
        .join('');
    }
    const { boolValue } = filter;
    if (boolValue !== undefined && prop) {
      return boolValue ? prop.name : prop.inverse;
    }
    return '';
  })
    .filter(x => x)
    .map(lowerFirst)
    .join(' ');
  return upperFirst(trim(res));
}
