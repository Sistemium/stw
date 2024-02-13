import orderBy from 'lodash/orderBy'
import type { BaseItem } from '@/init/Model'

export function orderByName<T = BaseItem>(items: T[]) {
  return orderBy(items, 'name')
}

export function orderByDateDesc<T = BaseItem>(items: T[]) {
  return orderBy(items, ['date'], ['desc'])
}
