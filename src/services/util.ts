import orderBy from 'lodash/orderBy'
import type { BaseItem } from '@/init/Model'

export function orderByName(items: BaseItem[]) {
  return orderBy(items, 'name')
}
