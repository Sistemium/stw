import each from 'lodash/each';
import replace from 'lodash/replace';
import escapeRegExp from 'lodash/escapeRegExp';

const LT_LETTERS = {

  a: 'ą',
  s: 'š',
  e: 'ėę',
  i: 'į',
  u: 'ūų',
  c: 'č',
  z: 'ž',

};

export function likeLt(string: string) {

  let res = escapeRegExp(string);

  each(LT_LETTERS, (to, from) => {
    const braced = `[${to}${from}]`;
    res = replace(res, new RegExp(braced, 'ig'), braced);
  });

  return new RegExp(res, 'i');
}
