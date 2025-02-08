import dayjs from 'dayjs';
import { computed } from 'vue'
import orderBy from 'lodash/orderBy'
import type { BaseItem } from '@/init/Model'
import { useRouteParams } from '@/lib/updateRouteParams'

export function orderByName<T = BaseItem>(items: T[]) {
  return orderBy(items, 'name')
}

export function orderByDateDesc<T = BaseItem>(items: T[]) {
  return orderBy(items, ['date'], ['desc'])
}

export function useSearch() {
  const { updateRouteParams, route } = useRouteParams()
  const search = computed<string>({
    get() {
      return route.query.search as string || ''
    },
    set(search) {
      updateRouteParams({}, { search: search || undefined })
        .then()
    },
  })

  return {
    search,
  }
}

export interface ColumnInfo {
  width: number
  key?: string
  dataKey?: string
}

export function todayStringDate() {
  return dayjs().toJSON()
}

export function useDateRange() {
  const { updateRouteParams, route } = useRouteParams()
  const today = dayjs().endOf('day');
  const monthAgo = today.add(-12, 'month');
  const dateRange = computed({
    get() {
      const { dateB, dateE } = route.query
      return [
        dayjs(dateB as string || monthAgo).toDate(),
        dayjs(dateE as string || today).toDate(),
      ]
    },
    set(val) {
      const [dateB, dateE] = val || [monthAgo, today]
      updateRouteParams({}, {
        dateB: dayjs(dateB).toJSON(),
        dateE: dayjs(dateE).toJSON(),
      })
        .then()
    },
  })

  return { dateRange }
}

