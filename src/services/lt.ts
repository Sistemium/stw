import each from 'lodash/each';
import replace from 'lodash/replace';
import escapeRegExp from 'lodash/escapeRegExp';
import trim from 'lodash/trim'
import { BaseItem } from '@/init/Model'

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

export function searchRe(search: string): { test(s: string): boolean } {
  const trimmed = trim(search).replace(/ +/g, ' ')
  if (!trimmed) {
    return { test: () => true }
  }
  const parts = search.split(' ').map(likeLt)
  if (parts.length === 1) {
    return likeLt(search)
  }
  return { test: s => !parts.find(re => !re.test(s)) }
}

export function applySearch<T extends BaseItem>(search: string, fields: string[]) {
  const re = searchRe(search)
  return (items: T[]) => {
    if (!search) {
      return items
    }
    return matchRecord(items)
  }

  function matchRecord(items: BaseItem[]): T[] {
    return items.filter(item => {
      return fields.find(field => {
        const val = item[field] as string | BaseItem[]
        const isArray = val && Array.isArray(val)
        return isArray ? matchRecord(val as BaseItem[]).length : re.test(val)
      })
    }) as T[]
  }
}
